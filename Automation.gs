// =========================================================================
// 🏭 NHÀ MÁY TỰ ĐỘNG HÓA (AUTOMATION ECOSYSTEM)
// - Flow 1: Lõi Tài Nguyên (Data Core)
// - Flow 2: Bộ Tổng Tư Lệnh (Master Scheduler)
// - Flow 3: Robot Nghiệp Vụ (Worker Bots)
// =========================================================================

// -------------------------------------------------------------------------
// ⚙️ FLOW 1: LÕI TÀI NGUYÊN (CENTRALIZED DATA CORE)
// Nhiệm vụ: Đọc toàn bộ Sheet lên RAM 1 lần duy nhất để các Robot xài chung, 
// tuyệt đối không cho phép Robot tự ý getRange().getValue() lắt nhắt làm chậm app.
// -------------------------------------------------------------------------
function getDatabaseSnapshot(sheetName) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return null;
    var dataMatrix = sheet.getDataRange().getValues();
    return {
        sheet: sheet,
        matrix: dataMatrix,
        totalRows: dataMatrix.length,
        totalCols: dataMatrix[0].length
    };
}

// -------------------------------------------------------------------------
// ⚙️ FLOW 3: TRẠM XỬ LÝ NGHIỆP VỤ (WORKER BOTS)
// Nhiệm vụ: Robot chuyên trách chốt task qua ngày Air + Có Quản lý xác nhận "OK"
// Input: Nhận bản Snapshot từ Flow 1
// Output: Trả về mảng danh sách task đã thay đổi.
// -------------------------------------------------------------------------
function bot_AutoCloseAiredTasks(snapshot) {
    var changedTasks = []; 
    var isChanged = false; 
    
    var today = new Date();
    today.setHours(0, 0, 0, 0); 

    // Dò tìm tọa độ các cột dựa vào bản đồ FIELD_MAP toàn cầu
    var colId = letterToColIndex(FIELD_MAP["Mã Task"].col) - 1;
    var colName = letterToColIndex(FIELD_MAP["Chủ đề task"].col) - 1; 
    var colStatus = letterToColIndex(FIELD_MAP["Trạng thái task"].col) - 1;
    var colAirDate = letterToColIndex(FIELD_MAP["Ngày air task"].col) - 1; 
    
    // 🚀 MỚI: Thêm tọa độ cột Chat để Robot đọc tin nhắn
    var colChat = letterToColIndex(FIELD_MAP["Nhận xét & sửa task"].col) - 1; 

    for (var i = 11; i < snapshot.totalRows; i++) {
        // BƯỚC 1: ÉP TOÀN BỘ TRẠNG THÁI VỀ CHỮ IN HOA
        var rawStatus = String(snapshot.matrix[i][colStatus]).trim();
        var statusUpper = rawStatus.toUpperCase(); 
        
        // BƯỚC 2: DANH SÁCH CHẶN
        var lockedStatuses = ["HOÀN THÀNH", "HỦY", "TẠM HOÃN"];
        if (statusUpper === "" || lockedStatuses.includes(statusUpper)) continue;

        var airDateVal = snapshot.matrix[i][colAirDate];
        if (!airDateVal) continue; 

        var airDate = null;
        if (Object.prototype.toString.call(airDateVal) === "[object Date]") {
            airDate = airDateVal;
        } else {
            var parts = String(airDateVal).split(/[-/]/);
            if (parts.length === 3) {
                if (parts[0].length === 4) airDate = new Date(parts[0], parts[1] - 1, parts[2]);
                else airDate = new Date(parts[2], parts[1] - 1, parts[0]); 
            }
        }

        // BƯỚC 3.5: SO SÁNH NGÀY AIR
        if (airDate && !isNaN(airDate.getTime())) {
            airDate.setHours(0, 0, 0, 0);
            if (airDate.getTime() < today.getTime()) {
                
                // 🕵️ LƯỚI 1: XÁC NHẬN TASK ĐÃ LỌT VÀO VÒNG XÉT DUYỆT CHAT
                var tempId = snapshot.matrix[i][colId];
                Logger.log("-------------------------------------------------");
                Logger.log("🕵️ LƯỚI 1 - Đang xét Dòng " + (i+1) + " (Mã: " + tempId + ") | Trạng thái: " + rawStatus + " | Đã qua ngày Air -> ĐỦ ĐIỀU KIỆN QUÉT CHAT.");

                // =========================================================
                // 🚀 BƯỚC 3.6: QUÉT JSON CHAT TÌM LỆNH "OK" CỦA QUẢN LÝ
                // =========================================================
                var chatDataStr = String(snapshot.matrix[i][colChat] || "").trim();
                var hasManagerApproved = false;
                
                if (chatDataStr !== "" && chatDataStr.startsWith("[")) {
                    try {
                        var chatHistory = JSON.parse(chatDataStr);
                        // Quét ngược từ tin nhắn mới nhất về cũ nhất
                        for (var j = chatHistory.length - 1; j >= 0; j--) {
                            var msg = chatHistory[j];
                            
                            // 🕵️ LƯỚI 2: ĐỌC TỪNG TIN NHẮN TRONG LỊCH SỬ
                            Logger.log("   ➤ Đọc tin nhắn: Role ['" + msg.role + "'] | Text gốc ['" + msg.text + "']");

                            if (msg.role === "Quản lý" || msg.role === "Admin") {
                                // Ép chữ về in thường và cắt khoảng trắng 2 đầu
                                var msgText = String(msg.text || "").trim().toLowerCase();
                                
                                // 🕵️ LƯỚI 3: SOI CẬN CẢNH ĐIỀU KIỆN SO SÁNH
                                Logger.log("      ⚠️ Thấy Quản lý/Admin! Máy đang so sánh: Text thực tế là ['" + msgText + "'] có bằng tuyệt đối ['ok'] không?");
                                
                                if (msgText === "ok") {
                                    Logger.log("         ✅ TRÚNG ĐÍCH! Đã tìm thấy lệnh OK.");
                                    hasManagerApproved = true;
                                    break; // Chỉ cần tìm thấy 1 chữ OK là đủ điều kiện, đập tan vòng lặp
                                } else {
                                    Logger.log("         ❌ TRƯỢT! Text không khớp tuyệt đối với chữ 'ok'.");
                                }
                            }
                        }
                    } catch (e) {
                        Logger.log("Lỗi Parse JSON ở dòng " + (i+1));
                    }
                }
                
                // 🕵️ LƯỚI 4: KẾT LUẬN CUỐI CÙNG TRƯỚC KHI TỪ CHỐI
                if (!hasManagerApproved) {
                    Logger.log("🛑 LƯỚI 4 - TỪ CHỐI CHỐT DÒNG " + (i+1) + ": Lục tung lịch sử nhưng không tìm thấy lệnh OK hợp lệ!");
                    continue;
                }
                // NẾU TÌM THẤY OK, CODE BÊN DƯỚI SẼ TIẾP TỤC CHẠY ĐỂ BẮN "HOÀN THÀNH"
                Logger.log("🎯 BẮN TỈA: Dòng " + (i+1) + " ĐƯỢC CHỐT THÀNH CÔNG!");
                // =========================================================
                               
                // BƯỚC 4: RA ĐÒN "BẮN TỈA" & CẬP NHẬT DỮ LIỆU VÀO LOG
                var taskId = snapshot.matrix[i][colId] ? snapshot.matrix[i][colId].toString() : "Dòng " + (i + 1);
                var taskName = snapshot.matrix[i][colName] ? snapshot.matrix[i][colName].toString() : "";
                var oldStatus = rawStatus;
                
                // 🚀 BẮN TỈA 1: Ghi trực tiếp chữ "HOÀN THÀNH" xuống Google Sheet
                snapshot.sheet.getRange(i + 1, colStatus + 1).setValue("HOÀN THÀNH");
                
                // 🚀 BẮN TỈA 2 (VÁ LỖI CHÍ MẠNG): Ép cập nhật luôn vào bản nháp RAM để Robot 2 nhận diện được ngay lập tức!
                snapshot.matrix[i][colStatus] = "HOÀN THÀNH";
                
                // Gói dữ liệu ném vào mảng báo cáo
                changedTasks.push({
                    taskInfo: taskId + " - " + taskName,
                    oldValue: oldStatus
                });
            }
        }
    }

    return changedTasks; 
}

// -------------------------------------------------------------------------
// ⚙️ FLOW 3.2: TRẠM DỌN DẸP & PHỤC HỒI DỮ LIỆU (DATA CLEANSING BOT)
// Nhiệm vụ: Xử lý các "Bóng ma Kế toán" (Task Hoàn thành nhưng thiếu ngày)
// -------------------------------------------------------------------------
function bot_DataCleansing_CompletedTasks(snapshot) {
    var changedTasks = [];
    var dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Bộ lọc định dạng dd/mm/yyyy

    // Lấy tọa độ cột từ bản đồ FIELD_MAP
    var colId = letterToColIndex(FIELD_MAP["Mã Task"].col) - 1;
    var colName = letterToColIndex(FIELD_MAP["Chủ đề task"].col) - 1;
    var colStatus = letterToColIndex(FIELD_MAP["Trạng thái task"].col) - 1;
    var colComplete = letterToColIndex(FIELD_MAP["Ngày hoàn thành"].col) - 1;
    var colAirDate = letterToColIndex(FIELD_MAP["Ngày air task"].col) - 1;
    var colChat = letterToColIndex(FIELD_MAP["Nhận xét & sửa task"].col) - 1;
    
    // 🚀 [MỚI BỔ SUNG] Tọa độ phục vụ Trạm gác Kế toán
    var colAssignee = letterToColIndex(FIELD_MAP["Người làm task"].col) - 1;
    var colAI = letterToColIndex(FIELD_MAP["Tiến độ Thanh toán"].col) - 1;

    // =====================================================================
    // 🚀 TRẠM PRE-FETCH: TẢI TRƯỚC BỘ NHỚ LƯƠNG VÀO RAM ĐỂ TRÁNH LAG SERVER
    // =====================================================================
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetNs = ss.getSheetByName("Nhân sự");
    var nsData = sheetNs ? sheetNs.getDataRange().getDisplayValues() : [];
    var paidDataMap = {};
    
    for (var n = 11; n < nsData.length; n++) {
        var nsName = String(nsData[n][2]).trim().toLowerCase(); // Tên nhân viên (Cột C)
        var rawPaid = String(nsData[n][16] || "").trim();       // Đã Thanh Toán Lương (Cột Q)
        if (rawPaid.startsWith("{")) {
            try { paidDataMap[nsName] = JSON.parse(rawPaid); } catch(e){}
        }
    }
    // =====================================================================

    for (var i = 11; i < snapshot.totalRows; i++) {
        var rawStatus = String(snapshot.matrix[i][colStatus]).trim();
        if (rawStatus.toUpperCase() !== "HOÀN THÀNH") continue; // Chỉ khám cho bệnh nhân HOÀN THÀNH

        // =====================================================================
        // 🚀 TRẠM GÁC BLACKLIST (ĐÃ GIA CỐ): BỎ QUA > 201 VÀ < 564
        // =====================================================================
        var rawId = String(snapshot.matrix[i][colId] || "").trim();
        var numericId = Number(rawId);
        
        // Đóng băng nếu lấy sai tọa độ cột (Ra NaN)
        if (isNaN(numericId) || rawId === "") continue; 

        // Chặn vùng đen (201 -> 564)
        if (numericId > 201 && numericId < 564) continue; 

        // =====================================================================
        // 🚦 TRẠM CHECK NGÀY (ĐÃ DỜI LÊN TRƯỚC ĐỂ TRÁNH SPAM LOG)
        // =====================================================================
        var rawCompleteForLock = snapshot.matrix[i][colComplete];
        var rawAirForLock = snapshot.matrix[i][colAirDate];

        var isDateObjC = (Object.prototype.toString.call(rawCompleteForLock) === "[object Date]" && !isNaN(rawCompleteForLock.getTime()));
        var isDateObjA = (Object.prototype.toString.call(rawAirForLock) === "[object Date]" && !isNaN(rawAirForLock.getTime()));
        var isStrC = (typeof rawCompleteForLock === "string" && dateRegex.test(rawCompleteForLock.trim()));
        var isStrA = (typeof rawAirForLock === "string" && dateRegex.test(rawAirForLock.trim()));

        var isValidC = isDateObjC || isStrC;
        var isValidA = isDateObjA || isStrA;

        // Bỏ qua im lặng nếu cả 2 ngày đều đã chuẩn chỉnh (Không cần báo cáo)
        if (isValidC && isValidA) continue;

        // =====================================================================
        // 🛡️ TRẠM GÁC KẾ TOÁN: KHÓA BẤT BIẾN (CHỈ KÍCH HOẠT KHI THIẾU NGÀY)
        // =====================================================================
        var isProjPaid = String(snapshot.matrix[i][colAI] || "").trim() !== "";
        var isSalaryPaid = false;
        var assigneeName = String(snapshot.matrix[i][colAssignee] || "").trim().toLowerCase();
        
        var completeDateStr = "";
        if (isDateObjC) completeDateStr = Utilities.formatDate(rawCompleteForLock, Session.getScriptTimeZone(), "dd/MM/yyyy");
        else if (isStrC) completeDateStr = rawCompleteForLock.trim();

        if (!isProjPaid && assigneeName !== "" && completeDateStr !== "") {
            var pts = completeDateStr.split('/');
            if (pts.length === 3) {
                var d = parseInt(pts[0], 10), m = parseInt(pts[1], 10), y = parseInt(pts[2], 10);
                var batch = "1"; var targetM = m; var targetY = y;
                if (d >= 11 && d <= 25) { batch = "2"; } 
                else if (d >= 26) { batch = "1"; targetM = m + 1; if (targetM > 12) { targetM = 1; targetY = y + 1; } }
                
                if (paidDataMap[assigneeName] && paidDataMap[assigneeName][targetY] && paidDataMap[assigneeName][targetY][targetM] && paidDataMap[assigneeName][targetY][targetM][batch]) {
                    isSalaryPaid = true;
                }
            }
        }
        
        // =====================================================================
        // 🚨 VÁ LỖI CHÍ MẠNG: Hứng cả Dữ liệu dạng Date Object và String
        // =====================================================================
        var rawComplete = snapshot.matrix[i][colComplete];
        var rawAir = snapshot.matrix[i][colAirDate];

        // Lưới 1: Kiểm tra xem có phải là Object Date chuẩn của Google Sheet không
        var isDateObjComplete = (Object.prototype.toString.call(rawComplete) === "[object Date]" && !isNaN(rawComplete.getTime()));
        var isDateObjAir = (Object.prototype.toString.call(rawAir) === "[object Date]" && !isNaN(rawAir.getTime()));

        // Lưới 2: Kiểm tra xem có phải là Chuỗi chữ "dd/mm/yyyy" không
        var isStringComplete = (typeof rawComplete === "string" && dateRegex.test(rawComplete.trim()));
        var isStringAir = (typeof rawAir === "string" && dateRegex.test(rawAir.trim()));

        // Chốt kiểm duyệt: Thỏa mãn 1 trong 2 loại trên là hợp lệ!
        var hasValidComplete = isDateObjComplete || isStringComplete;
        var hasValidAir = isDateObjAir || isStringAir;

        // Bỏ qua nếu cả 2 ngày đều đã chuẩn chỉnh (Robot không được phép đụng vào)
        if (hasValidComplete && hasValidAir) continue;

        // =====================================================================
        // 🚀 LẤY THÔNG TIN TASK VÀ LỊCH SỬ CHAT
        // =====================================================================
        var taskId = snapshot.matrix[i][colId] ? snapshot.matrix[i][colId].toString() : "Dòng " + (i + 1);
        var taskName = snapshot.matrix[i][colName] ? snapshot.matrix[i][colName].toString() : "";
        var taskInfo = taskId + " - " + taskName;

        var chatDataStr = String(snapshot.matrix[i][colChat] || "").trim();
        var foundOkDateStr = null; 
        var chatHistory = [];

        // Lục soát chat tìm lệnh "ok" (Giữ nguyên logic toLowerCase === "ok")
        if (chatDataStr !== "" && chatDataStr.startsWith("[")) {
            try {
                chatHistory = JSON.parse(chatDataStr);
                // Quét từ dưới lên (Mới nhất)
                for (var j = chatHistory.length - 1; j >= 0; j--) {
                    var msg = chatHistory[j];
                    if (msg.role === "Quản lý" || msg.role === "Admin") {
                        var msgText = String(msg.text || "").trim().toLowerCase();
                        if (msgText === "ok") {
                            if (msg.time && msg.time.length >= 10) foundOkDateStr = msg.time.substring(0, 10);
                            break;
                        }
                    }
                }
            } catch(e) { chatHistory = [{ sender: "Hệ thống", role: "Admin", time: "Lịch sử cũ", text: chatDataStr }]; }
        } else if (chatDataStr !== "") {
            chatHistory = [{ sender: "Hệ thống", role: "Admin", time: "Lịch sử cũ", text: chatDataStr }];
        }

        // Nếu không có OK -> Hoàn thành khống -> Giáng cấp
        if (!foundOkDateStr || !dateRegex.test(foundOkDateStr)) {
            snapshot.sheet.getRange(i + 1, colStatus + 1).setValue("CẦN SỬA");
            
            var now = new Date();
            var timeStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
            var sysMsg = { id: "sys_bot_" + now.getTime(), sender: "Hệ thống", role: "Admin", time: timeStr, isSysMsg: true, text: "⚠️ Robot Y Tế đã giáng cấp task về [CẦN SỬA] do task bị đánh dấu Hoàn thành khống (Không tìm thấy lệnh chốt OK hợp lệ từ Quản lý)." };
            chatHistory.push(sysMsg);
            snapshot.sheet.getRange(i + 1, colChat + 1).setValue(JSON.stringify(chatHistory));
            
            changedTasks.push({ taskInfo: taskInfo, action: "⚠️ Giáng cấp (Không có lệnh OK)", oldValue: "HOÀN THÀNH", newValue: "CẦN SỬA" });
            continue; // Chuyển sang dòng tiếp theo
        }

        // =====================================================================
        // 🚀 THUẬT TOÁN TIME-BOXING: ÉP KHUNG THỜI GIAN THEO CHU KỲ KẾ TOÁN
        // =====================================================================
        var okPts = foundOkDateStr.split('/');
        var okD = parseInt(okPts[0], 10), okM = parseInt(okPts[1], 10), okY = parseInt(okPts[2], 10);
        var okDateObj = new Date(okY, okM - 1, okD);

        var hasUpdated = false;
        var rawAI = String(snapshot.matrix[i][colAI] || "").trim();
        var isProjPaid = rawAI !== ""; 
        var assigneeName = String(snapshot.matrix[i][colAssignee] || "").trim().toLowerCase();

        // -----------------------------------------------------------------
        // 🛡️ LUỒNG 2A: XỬ LÝ NGÀY AIR TASK (Rỗng) - Liên kết Dự Án
        // -----------------------------------------------------------------
        if (!hasValidAir) {
            var finalAirDate = foundOkDateStr;
            
            if (isProjPaid && rawAI.length >= 8) {
                // Giải mã Cột AI (Ví dụ: 01072026 -> Đợt 1, Tháng 7, Năm 2026)
                var pBatch = parseInt(rawAI.substring(0, 2), 10);
                var pMonth = parseInt(rawAI.substring(2, 4), 10);
                var pYear = parseInt(rawAI.substring(4, 8), 10);
                
                var pStartDate, pEndDate;
                if (pBatch === 1) {
                    // Đợt 1: 26 tháng trước -> 10 tháng này
                    var prevMonth = pMonth === 1 ? 12 : pMonth - 1;
                    var prevYear = pMonth === 1 ? pYear - 1 : pYear;
                    pStartDate = new Date(prevYear, prevMonth - 1, 26);
                    pEndDate = new Date(pYear, pMonth - 1, 10);
                } else {
                    // Đợt 2: 11 -> 25 tháng này
                    pStartDate = new Date(pYear, pMonth - 1, 11);
                    pEndDate = new Date(pYear, pMonth - 1, 25);
                }

                if (okDateObj < pStartDate || okDateObj > pEndDate) {
                    finalAirDate = Utilities.formatDate(pEndDate, Session.getScriptTimeZone(), "dd/MM/yyyy");
                }
            }
            
            snapshot.sheet.getRange(i + 1, colAirDate + 1).setValue(finalAirDate);
            changedTasks.push({ taskInfo: taskInfo, action: (isProjPaid ? "Bù Ngày Air (Ép khung DA)" : "Bù Ngày Air (Lệnh OK)"), oldValue: "Trống", newValue: finalAirDate });
            hasUpdated = true;
        }

        // -----------------------------------------------------------------
        // 🛡️ LUỒNG 2B: XỬ LÝ NGÀY HOÀN THÀNH (Rỗng) - Liên kết Lương
        // -----------------------------------------------------------------
        if (!hasValidComplete) {
            var finalCompleteDate = foundOkDateStr;
            
            // Đánh giá lại Khóa Lương dựa vào ngày OK để ghi log cho chuẩn xác
            var isSalaryPaid_Recheck = false;
            var batchL = (okD <= 17) ? "1" : "2";
            if (assigneeName !== "" && paidDataMap[assigneeName] && paidDataMap[assigneeName][okY] && paidDataMap[assigneeName][okY][okM] && paidDataMap[assigneeName][okY][okM][batchL]) {
                isSalaryPaid_Recheck = true;
            }

            // 🚀 BỎ ÉP NGÀY: Dù đã khóa lương, vẫn giữ nguyên Ngày OK ban đầu
            snapshot.sheet.getRange(i + 1, colComplete + 1).setValue(finalCompleteDate);
            
            var actionLog = isSalaryPaid_Recheck ? "Bù Ngày HT (Lệnh OK - Đã chốt Lương)" : "Bù Ngày HT (Lệnh OK)";
            changedTasks.push({ taskInfo: taskInfo, action: actionLog, oldValue: "Trống", newValue: finalCompleteDate });
            hasUpdated = true;
        }

        // Cập nhật log chat nếu có thay đổi
        if (hasUpdated) {
            var timeStrNow = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
            var baseSysMsg = { id: "sys_bot_" + new Date().getTime(), sender: "Hệ thống", role: "Admin", time: timeStrNow, isSysMsg: true, text: "✅ Robot Y Tế đã tự động bù đắp ngày khuyết thiếu dựa trên tin nhắn chốt OK và chu kỳ Kế toán." };
            chatHistory.push(baseSysMsg);
            snapshot.sheet.getRange(i + 1, colChat + 1).setValue(JSON.stringify(chatHistory));
        }
    }
    
    return changedTasks;
}

// -------------------------------------------------------------------------
// ⚙️ FLOW 2: MASTER SCHEDULER (VÒNG LẶP XẢ LOG BẮN PHÁO BÔNG)
// -------------------------------------------------------------------------
function masterNightlyBatch() {
    Logger.log("🔄 Bắt đầu chạy Master Nightly Batch...");
    var taskSnapshot = getDatabaseSnapshot("Công việc");
    if (!taskSnapshot) {
        Logger.log("🚨 Lỗi: Không tìm thấy Sheet Công việc!");
        return;
    }

    try {
        // Hứng mảng danh sách chi tiết các task bị robot xử lý
        var changedTasks_Closing = bot_AutoCloseAiredTasks(taskSnapshot);
        
        // 🚀 KÍCH HOẠT ROBOT MỚI: BỆNH VIỆN PHỤC HỒI DỮ LIỆU
        var changedTasks_Cleansing = bot_DataCleansing_CompletedTasks(taskSnapshot);

        var totalProcessed = changedTasks_Closing.length + changedTasks_Cleansing.length;
        Logger.log("✅ Master Batch hoàn tất. Đã xử lý tổng cộng: " + totalProcessed + " task.");

        // 🚀 Xả log cho Robot 1 (Chốt Task)
        if (changedTasks_Closing.length > 0 && typeof writeLog === 'function') {
            changedTasks_Closing.forEach(function(task) {
                writeLog("🤖 Robot Tuần Tra", "Tự động hoàn thành (Qua ngày Air)", task.taskInfo, task.oldValue, "HOÀN THÀNH");
            });
        }

        // 🚀 Xả log cho Robot 2 (Dọn dẹp & Giáng cấp)
        if (changedTasks_Cleansing.length > 0 && typeof writeLog === 'function') {
            changedTasks_Cleansing.forEach(function(task) {
                writeLog("🚑 Robot Y Tế", task.action, task.taskInfo, task.oldValue, task.newValue);
            });
        }

    } catch (e) {
        Logger.log("🚨 Lỗi nghiêm trọng tại Master Batch: " + e.toString());
    }

    // ==========================================
    // 🤖 NHIỆM VỤ 2: ROBOT DỌN DẸP DRIVE
    // ==========================================
    try {
        if (typeof autoCleanUploadedFiles === 'function') {
            autoCleanUploadedFiles();
        } else {
            Logger.log("⚠️ Không tìm thấy hàm autoCleanUploadedFiles() trong hệ thống.");
        }
    } catch (e) {
        Logger.log("🚨 Lỗi tại Robot dọn rác: " + e.toString());
    }

    Logger.log("🏁 KẾT THÚC TOÀN BỘ TIẾN TRÌNH ĐÊM!");
}


// =========================================================================
// ⚙️ HÀM CÀI ĐẶT ĐỒNG HỒ BÁO THỨC CHO ROBOT (Chỉ cần chạy 1 lần duy nhất)
// =========================================================================
function setupNightlyTrigger() {
    var functionName = "masterNightlyBatch";
    
    // 1. Quét xem có đồng hồ nào cài cho Robot này chưa, nếu có thì đập đi cài lại (Chống trùng lặp)
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
        if (triggers[i].getHandlerFunction() === functionName) {
            ScriptApp.deleteTrigger(triggers[i]);
        }
    }

    // 2. Tạo đồng hồ mới: Chạy lặp lại mỗi ngày, vào khoảng từ 00:00 đến 01:00 sáng
    ScriptApp.newTrigger(functionName)
        .timeBased()
        .everyDays(1)
        .inTimezone(Session.getScriptTimeZone())
        .atHour(0) // Khung giờ từ 0h sáng
        .create();

    // Thông báo cho Admin biết
    //SpreadsheetApp.getUi().alert("✅ Cài đặt thành công! Robot sẽ tự động đi tuần tra chốt task vào lúc 0h sáng mỗi ngày.");
    // 3. Ghi log nội bộ thay vì bật Popup để tránh lỗi Context
    Logger.log("✅ Cài đặt thành công! Robot sẽ tự động đi tuần tra chốt task vào lúc 0h sáng mỗi ngày.");
}

// =========================================================================
// 🤖 ROBOT DỌN RÁC DRIVE (Xóa file cũ hơn 30 ngày - Phiên bản bọc thép JS)
// =========================================================================
function autoCleanUploadedFiles() {
    Logger.log("🧹 Khởi động Robot dọn rác Drive...");
    
    // ID THƯ MỤC LƯU ẢNH/FILE TRÊN DRIVE CỦA BẠN
    var folderId = "18RAw9TTU6E1mvbC16FDiUr_ARZ95pMRN"; 
    
    try {
        var folder = DriveApp.getFolderById(folderId);
        
        // Lấy tất cả file trong thư mục (Tuyệt đối không dùng lệnh query 'q' để tránh lỗi)
        var files = folder.getFiles(); 
        
        // 1. Tính toán mốc thời gian: Lùi về quá khứ 30 ngày
        var thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - 30);
        var thresholdTime = thresholdDate.getTime(); // Đổi sang mili-giây để so sánh toán học
        
        var trashedCount = 0;
        
        // 2. Tự dùng Javascript bóc từng file ra kiểm tra
        while (files.hasNext()) {
            var file = files.next();
            
            // Nếu file CHƯA vào thùng rác VÀ có thời gian tạo < thời gian mốc 30 ngày trước
            if (!file.isTrashed() && file.getDateCreated().getTime() < thresholdTime) {
                file.setTrashed(true); // Đưa vào Thùng rác
                trashedCount++;
            }
        }
        
        Logger.log("✅ Dọn rác hoàn tất! Đã đưa " + trashedCount + " file cũ vào Thùng rác.");
        
    } catch(e) {
        Logger.log("🚨 Lỗi Robot Dọn rác: Không thể truy cập Drive hoặc Folder. Chi tiết: " + e.toString());
    }
}
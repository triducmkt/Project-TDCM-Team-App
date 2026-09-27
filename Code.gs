/* ==========================================================================
 * MODULE 1: CẤU HÌNH HỆ THỐNG & MA TRẬN PHÂN QUYỀN (VERSION 94)
 * - Tự động đồng bộ tên hiển thị Frontend và tiêu đề thực tế Backend Sheet
 * - Dễ dàng thêm, bớt hoặc khóa quyền các cột trong tương lai
 * ========================================================================== */

// 1. Định nghĩa các vai trò (Roles) trong hệ thống
const ROLES = {
    MANAGER: 'Quản lý',
    ADMIN: 'Admin',
    FREELANCER: 'Freelancer',
    GUEST: 'Khách lạ'
};

// 2. BẢN ĐỒ MAPPING TOÀN BỘ CỘT (Từ cột B đến cột AI)
// Cấu trúc cấu hình từng khối: Tên hiển thị App: { tiêu đề thật trên Sheet, quyền ẩn/hiện trên Web, ký hiệu cột }
const FIELD_MAP = {
    // --- Các cột MAPPING SHEET CÔNG VIỆC - TRANG TASK LIST HIỂN THỊ và ĐỒNG BỘ trên Frontend ---
    "Mã Task":           { sheetHeader: "Mã TASK",      visible: true,  col: "B", frontendKey: "id" },
    "Dự án":             { sheetHeader: "Tên dự án",             visible: true,  col: "F", frontendKey: "project" },
    "Loại Content":      { sheetHeader: "Loại CONTENT",    visible: true,  col: "V", frontendKey: "type" },
    "Chủ đề task":       { sheetHeader: "Tên TASK",     visible: true,  col: "C", frontendKey: "name" },
    "Nội dung task":     { sheetHeader: "Nội dung task",          visible: true,  col: "D", frontendKey: "noidung" },
    "Người làm task":    { sheetHeader: "Người phụ trách", visible: true,  col: "H", frontendKey: "assignee"  },
    "Nhận xét & sửa task": { sheetHeader: "Nhận xét sửa task",          visible: true,  col: "AD", frontendKey: "nhanxet" },
    "Link nộp":          { sheetHeader: "Link nộp task",          visible: true,  col: "AE", frontendKey: "link" },
    "Trạng thái air":    { sheetHeader: "Tình trạng air task",    visible: true,  col: "AH", frontendKey: "airstat" },
    "Ngày hoàn thành":   { sheetHeader: "Ngày hoàn thành thực tế",          visible: true,  col: "N", frontendKey: "complete" },
    "Ngày bắt đầu":      { sheetHeader: "Ngày bắt đầu",      visible: true, col: "L", frontendKey: "start" },
    "Trạng thái task":   { sheetHeader: "Trạng thái",       visible: true, col: "O", frontendKey: "status" },
    "Đơn giá":           { sheetHeader: "Đơn giá task",          visible: true, col: "AF", frontendKey: "dongia" },

    // --- Các cột ẨN (Xen kẽ trên Sheet, không xuất hiện công khai trên Web Frontend) ---
        
    "Mã dự án":                      { sheetHeader: "Mã dự án",         visible: false, col: "E" },
    "Mã nhân sự phụ trách":          { sheetHeader: "Mã nhân sự phụ trách",           visible: false, col: "G" },
    "Email phụ trách":               { sheetHeader: "Email phụ trách",         visible: false, col: "I" },
    "Bộ phận phụ trách":             { sheetHeader: "Bộ phận phụ trách",           visible: false, col: "J" },
    "Người giao":                    { sheetHeader: "Người giao",         visible: false, col: "K" },
    "Hạn chót":                      { sheetHeader: "Hạn chót",        visible: false, col: "M" },
    "Mức ưu tiên":                   { sheetHeader: "Mức ưu tiên",        visible: false, col: "P", frontendKey: "priority" },
    "Quan trọng":                    { sheetHeader: "Quan trọng",    visible: false, col: "Q" },
    "Khẩn cấp":                      { sheetHeader: "Khẩn cấp",         visible: false, col: "R" },
    "Trọng số":                      { sheetHeader: "Trọng số",          visible: false, col: "S" },
    "Độ khó":                        { sheetHeader: "Độ khó",     visible: false, col: "T" },
    "Đổi người":                     { sheetHeader: "Đổi người",         visible: false, col: "U", frontendKey: "doinguoi" },
    "Mức độ hoàn chỉnh":             { sheetHeader: "Mức độ hoàn chỉnh",           visible: false, col: "W" },
    "Số ngày còn lại":               { sheetHeader: "Số ngày còn lại",        visible: false, col: "X" },
    "Cảnh báo hạn":                  { sheetHeader: "Cảnh báo hạn",          visible: false, col: "Y" },
    "Đã gửi nhắc 3 ngày":            { sheetHeader: "Đã gửi nhắc 3 ngày",         visible: false, col: "Z" },
    "Đã gửi nhắc 1 ngày":            { sheetHeader: "Đã gửi nhắc 1 ngày",     visible: false, col: "AA" },
    "Đã gửi nhắc hôm nay":           { sheetHeader: "Đã gửi nhắc hôm nay",      visible: false, col: "AB" },
    "Lần gửi gần nhất":              { sheetHeader: "Lần gửi gần nhất",       visible: false, col: "AC" },
    "Kì thanh toán Freelancer":      { sheetHeader: "Kì thanh toán Freelancer",        visible: false, col: "AG", frontendKey: "fcercharge" },
    "Tiến độ Thanh toán":            { sheetHeader: "Tiến độ Thanh toán",         visible: false, col: "AI", frontendKey: "projchargedate" },
    "Ngày giao task":                { sheetHeader: "Ngày giao task",         visible: false, col: "AJ", frontendKey: "assigndate"  },
    "Ngày air task":                { sheetHeader: "Ngày air task",         visible: true, col: "AK", frontendKey: "airdate"  },
    "Loại dịch vụ":                { sheetHeader: "Loại dịch vụ",         visible: true, col: "AL", frontendKey: "servicetype"  },
    "Loại content chuyển đổi":                { sheetHeader: "Loại content chuyển đổi",         visible: true, col: "AM", frontendKey: "conversetype"  } ,
    "Ghi chú Admin":                { sheetHeader: "Ghi chú Admin",         visible: true, col: "AN", frontendKey: "adminnote"  } ,
    "Thành tiền":            { sheetHeader: "Thành tiền TTDA",         visible: true, col: "AO", frontendKey: "projcharge" }
};

// ==========================================
// 💰 BẢNG GIÁ ĐỊNH MỨC THEO LOẠI CONTENT
// ==========================================
var CONTENT_PRICING = {
    "Clip content": 150000,
    "Thiết kế": 100000,
    "Bài viết dài": 75000,
    "Infographic": 100000,
    "Lập kế hoạch": 0,
    "Bài viết ngắn": 25000,
    "Thêm sản phẩm Haravan": 25000,
    "Bố cục bài viết": 0,
    "Khác": 0,
    "Clip reel": 50000,
    "Khảo sát GG Map": 25000,
    "Clip giải trí tiktok": 150000,
    "Cân màu": 50000
    // Đơn giá content cho freelancer
};

const PROJECT_PRICING = { // 💡 Đơn giá thanh toán dự án với khách hàng
    "Dự án Vingroup": {
        "Clip content": 300000,
        "Bài viết dài": 200000,
        // ...
    },
    "Dự án Shopee": {
        "Clip content": 250000,
        "Bài viết dài": 150000,
        // ...
    },
    "DEFAULT": { 
        "Clip content": 250000,
        "Thiết kế": 200000,
        "Bài viết dài": 150000,
        "Infographic": 170000,
        "Lập kế hoạch": 0,
        "Bài viết ngắn": 25000,
        "Thêm sản phẩm Haravan": 50000,
        "Bố cục bài viết": 0,
        "Khác": 0,
        "Clip reel": 100000,
        "Khảo sát GG Map": 25000,
        "Clip giải trí tiktok": 200000,
        "Cân màu": 75000
    }
}

// =========================================================================
// 💰 BẢN ĐỒ LƯU TRỰC CHI MKT CÓ ĐỊNH MỨC MẶC ĐỊNH (MKT_ACTUAL_COST_FIELD_MAP)
// =========================================================================
const MKT_ACTUAL_COST_FIELD_MAP = {
    "doanh_thu":       { order: 0, label: "Doanh thu tháng", type: "number", placeholder: "VD: 100.000.000", defaultVal: 0 },
    "ti_le_phan_bo":   { order: 1, label: "Tỉ lệ %", type: "float", placeholder: "VD: 3.5", defaultVal: "" },
    "han_muc":         { order: 2, label: "Hạn mức chi KH", type: "number", placeholder: "VD: 32.000.000", defaultVal: 0 },
    "han_muc_thuc_te": { order: 3, label: "Hạn mức chi TT", type: "number", placeholder: "Tự động tính...", defaultVal: 0 },
    "cp_content":      { order: 4, label: "Chi phí Content", type: "number", placeholder: "0", defaultVal: 0 },
    "luong_ql":        { order: 5, label: "Lương QL MKT", type: "number", placeholder: "0", defaultVal: 3000000 },
    "luong_nv":        { order: 6, label: "Lương NV MKT", type: "number", placeholder: "0", defaultVal: 0 },
    "seo":             { order: 7, label: "Chi phí SEO", type: "number", placeholder: "0", defaultVal: 0 },
    "cong_cu":         { order: 8, label: "Công cụ MKT", type: "number", placeholder: "0", defaultVal: 0 },
    "ads":             { order: 9, label: "Chi phí Ads", type: "number", placeholder: "0", defaultVal: 0 },
    "phat_sinh":       { order: 10, label: "Phát sinh", type: "number", placeholder: "0", defaultVal: 0 }
};

// =========================================================================
// 🏢 MA TRẬN ĐỊNH PHÍ KẾ TOÁN (PROJECT_FIXED_COSTS)
// =========================================================================
const PROJECT_FIXED_COSTS = {
    "AP CAR CARE": [
        { note: "Lương admin phụ trách content", amount: 1500000, isFixed: true },
        { note: "buff tiktok", amount: 300000, isFixed: true }
    ],
    "HỌC VIỆN DETAILING VN": [
        { note: "buff fanpage", amount: 200000, isFixed: true },
        { note: "buff tiktok", amount: 500000, isFixed: true }
    ],
    // Bạn có thể thoải mái thêm/bớt các Dự án của bạn tại đây khi cần truy xuất
    "DEFAULT": []
};

// =========================================================================
// 🎯 MA TRẬN HẠN MỨC MKT KẾ HOẠCH THEO DỰ ÁN (PROJECT_MKT_LIMITS)
// =========================================================================
const PROJECT_MKT_LIMITS = {
    "AP CAR CARE": 32000000,
    "HỌC VIỆN DETAILING VN": 15000000,
    // Bạn thoải mái thêm các dự án khác ở đây...
    "DEFAULT": 0 // Mức mặc định nếu dự án chưa được cấu hình
};

const USER_FIELD_MAP = {
    // --- Các cột CƠ SỞ DỮ LIỆU SHEET NHÂN SỰ ---
    "SĐT Zalo":          { sheetHeader: "SĐT Zalo",             visible: true,  col: "J" },
    "Mật khẩu":          { sheetHeader: "Mật khẩu",             visible: true,  col: "K" },
    "Tên":               { sheetHeader: "Họ và tên",            visible: true,  col: "C" },
    "Vị trí":            { sheetHeader: "Vai trò",              visible: true,  col: "F" },
    "Ảnh Avatar":        { sheetHeader: "Ảnh Avatar",           visible: true,  col: "L" },
    "Màu sắc yêu thích": { sheetHeader: "Màu sắc yêu thích",    visible: true,  col: "M" },
    "Lương & Bonus":     { sheetHeader: "Lương & Bonus",        visible: true,  col: "N", frontendKey: "salaryHistory" }
};

const GLOBAL_DB_MAP = {
    
    // 🗂️ BẢNG : CỔNG THÔNG TIN
    "Cổng thông tin": {
        "ID":                { col: "B", type: "text",   visible: true,  required: true },
        "Loại thông tin":    { col: "C", type: "list",   visible: true,  required: true },
        "Người gửi":         { col: "D", type: "list",   visible: true,  required: false },
        "Người nhận":        { col: "E", type: "list",   visible: true,  required: false },
        "Nội dung":          { col: "F", type: "text",   visible: true,  required: false },
        "Thời gian":         { col: "G", type: "date",   visible: true,  required: false },
        "Ẩn danh":           { col: "H", type: "text",   visible: true,  required: false }, // Lưu "Có" hoặc "Không"
        "Đính kèm":          { col: "I", type: "text",   visible: true,  required: false },  // Lưu Link Drive sau này
        "Người đọc":          { col: "J", type: "text",   visible: false,  required: false }  // Đã đọc?
        // ... (điền tiếp các cột của bảng Công việc)
    },

    // 🗂️ BẢNG 2: THỐNG KÊ & BÁO CÁO
    
    // 🗂️ BẢNG 3: TÀI CHÍNH / THANH TOÁN
    
    // 🗂️ BẢNG 4: AUTOMATION    
};

// 3. KHỐI PHÂN NHÓM QUYỀN HẠN (Field Permission Groups)
const PERMISSION_GROUPS = {
    // Freelancer chỉ được sửa 2 cột này
    FREELANCER_FIELDS: [
        "Nhận xét & sửa task", 
        "Link nộp"
    ],
    // Admin được phép điều phối sửa 8 cột này
    ADMIN_FIELDS: [
        "Dự án", 
        "Loại Content", 
        "Chủ đề task", 
        "Nội dung task", 
        "Người làm task", 
        "Nhận xét & sửa task", 
        "Link nộp", 
        "Trạng thái air"
    ]
};

// 4. KHỐI MA TRẬN ĐIỀU KIỆN ((Bộ Luật Tĩnh - Quyền Căn Bản Mặc Định Của Từng Role))
// MA TRẬN ĐIỀU KHIỂN TỔNG LỰC (Trang + Nút + Cột)
const ROLE_MATRIX = {
    [ROLES.MANAGER]: {
        fullAccess: true,          // Quyền lực tối cao
        allowedPages: ["*"],       // Trái tim của ứng dụng: "*" nghĩa là truy cập mọi trang
        allowedActions: ["*"],     // "*" nghĩa là bấm được mọi nút
        allowedFields: Object.keys(FIELD_MAP)
    },
    [ROLES.ADMIN]: {
        fullAccess: false,
        requireOwnership: false,   // Được sửa việc người khác
        checkStatus: true,         // Bị chặn nếu task đã Hoàn thành
        allowedPages: ["Home", "Task_list", "Dashboard", "Media_Uploader"], // Không cho vào HR_Dashboard
        allowedActions: ["Thêm Task", "ĐỒNG BỘ", "Xóa Task"], // Khai báo các nút được phép bấm
        allowedFields: PERMISSION_GROUPS.ADMIN_FIELDS
    },
    [ROLES.FREELANCER]: {
        fullAccess: false,
        requireOwnership: true,    // Chỉ được sửa việc của mình
        checkStatus: true,         // Bị chặn nếu task đã Hoàn thành
        allowedPages: ["Home", "Task_list", "HR_Dashboard"], // Không cho xem Dashboard tổng
        allowedActions: ["ĐỒNG BỘ"], // Chỉ được bấm đồng bộ, không được Thêm/Xóa task
        allowedFields: PERMISSION_GROUPS.FREELANCER_FIELDS
    },
    [ROLES.GUEST]: {
        fullAccess: false,
        readOnly: true,
        allowedPages: ["Home", "Task_list"],    // Chỉ được ở ngoài trang chủ
        allowedActions: [],        // Khóa toàn bộ nút
        allowedFields: []
    }
};

// ==========================================================================
// CỖ MÁY TỰ ĐỘNG HÓA & KHÓA QUYỀN (BỘ LUẬT ĐỘNG - AUTOMATION RULE ENGINE)
// ==========================================================================
const TASK_AUTOMATION_RULES = [
    // VÍ DỤ 1: Quản lý chốt task chờ Up
    {
        ruleName: "Khóa ô & Điền ngày khi Chờ up",
        stateCondition: { field: "Trạng thái task", operator: "==", value: "Chờ up" },
        locks: [
            { roles: ["Freelancer", "Admin"], fields: ["Nhận xét & sửa task", "Link nộp"] }
        ],
        autoFill: {
            onEditField: "Trạng thái task",
            onEditValue: "Chờ up",
            triggerRoles: ["Quản lý"], // Chỉ Quản lý bấm mới kích hoạt tự điền
            actions: [ { targetField: "Ngày hoàn thành", value: "TODAY" } ]
        }
    },

    // VÍ DỤ 2: Admin lên bài thực tế (Điền Link Air)
    //{
    //    ruleName: "Khóa Trạng thái air khi đã điền",
    //    stateCondition: { field: "Trạng thái air", operator: "NOT_EMPTY", requireAlso: { field: "Trạng thái task", value: "Chờ Up" } },
    //    locks: [
    //        { roles: ["Admin"], fields: ["Trạng thái air"] }
    //    ]
    //},

    // VÍ DỤ 3: Chốt người làm task (Giao việc)
    {
        ruleName: "Khóa thông tin task khi đã giao việc",
        stateCondition: { field: "Người làm task", operator: "NOT_EMPTY" },
        locks: [
            { roles: ["Admin"], fields: ["Dự án", "Loại Content", "Chủ đề task", "Nội dung task", "Người làm task"] }
        ],
        autoFill: {
            onEditField: "Người làm task",
            operator: "CHANGED_FROM_EMPTY", // Kích hoạt khi giá trị cũ rỗng, giá trị mới có text
            //actions: [ { targetField: "Ngày giao task", value: "TODAY" } ]
        }
    },
    
    // VÍ DỤ 4: Tự điền ngày giao task 
    // # sau khi user được giao task đó click xem nội dung task và tự đổi trạng thái task Đã nhận
    {
        ruleName: "Tính ngày giao task và trạng thái Đã nhận task",
        autoFill: {
            onEditField: "Trạng thái task",
            onEditValue: "ĐÃ NHẬN",
            triggerRoles: ["Freelancer", "Admin"], // Chỉ kích hoạt khi người thao tác là Freelancer hoặc Admin
            actions: [ { targetField: "Ngày giao task", value: "TODAY" } ]
        }
    },

    // VÍ DỤ 5: Tự đổi trạng thái sang Cần Sửa khi dán link nộp bài hợp chuẩn
    {
        ruleName: "Chuyển trạng thái Cần sửa khi nộp Link",
        autoFill: {
            onEditField: "Link nộp",
            operator: "VALID_LINK",
            requireCurrentState: { field: "Trạng thái task", values: ["Chưa nhận", "Chưa bắt đầu", "Đã nhận", "Đang làm"] },
            requireNotEmpty: "Người làm task",
            triggerRoles: ["Freelancer", "Admin", "Quản lý"],
            actions: [ { targetField: "Trạng thái task", value: "CẦN SỬA" } ]
        }
    }
];

// 🤖 HÀM NGẦM: TỰ ĐỘNG NẢY SỐ TIỀN DỰ ÁN
function calculateProjectCharge(projectName, contentType) {
    let pName = String(projectName || "").trim();
    let cType = String(contentType || "").trim();
    if (!cType) return ""; // Không có loại Content thì không có giá

    // Tìm bảng giá của riêng Dự án đó, nếu không có thì lấy DEFAULT
    let projectMap = PROJECT_PRICING[pName] || PROJECT_PRICING["DEFAULT"];
    let price = projectMap[cType];

    // Cứu cánh: Nếu Dự án có tên trong list, nhưng lại quên không set giá cho Loại Content này -> Lấy giá DEFAULT của Loại Content đó
    if (typeof price === 'undefined') {
        price = PROJECT_PRICING["DEFAULT"][cType];
    }

    return typeof price !== 'undefined' ? price : 0;
}

// ==========================================
// 🚀 HÀM CHẠY THỦ CÔNG: TỰ ĐỘNG ĐIỀN THÀNH TIỀN CHO CÁC TASK
// ==========================================
function manualSyncProjectCharges() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Công việc");
    if (!sheet) return;

    var lastRow = sheet.getLastRow();
    if (lastRow < 12) return;

    // 1. Quét toàn bộ dữ liệu từ dòng 12 trở xuống
    var dataRange = sheet.getRange(12, 1, lastRow - 11, sheet.getLastColumn());
    var data = dataRange.getDisplayValues();

    // 2. Định vị tọa độ Index của các cột dựa trên bản đồ FIELD_MAP
    var colB_MaTask = letterToColIndex(FIELD_MAP["Mã Task"].col) - 1;
    var colF_DuAn = letterToColIndex(FIELD_MAP["Dự án"].col) - 1;
    var colV_LoaiContent = letterToColIndex(FIELD_MAP["Loại Content"].col) - 1;
    var colAI_TienDo = letterToColIndex(FIELD_MAP["Tiến độ Thanh toán"].col) - 1;
    var colAO_ThanhTien = letterToColIndex(FIELD_MAP["Thành tiền"].col); // Lấy số cột gốc để ghi dữ liệu

    // Mảng chứa dữ liệu cột AO hiện tại (Để giữ nguyên những ô không thỏa điều kiện)
    var oldAOValues = sheet.getRange(12, colAO_ThanhTien, lastRow - 11, 1).getValues();
    var outValues = [];
    var updateCount = 0;

    // 3. Vòng lặp rà soát từng dòng
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var maTask = String(row[colB_MaTask]).trim();
        var tienDoTT = String(row[colAI_TienDo]).trim();

        // ⛔ ĐIỀU KIỆN SẮT: Cột B (Mã Task) KHÁC RỖNG và Cột AI (Tiến độ) KHÁC RỖNG
        if (maTask !== "") {
            var duAn = String(row[colF_DuAn]).trim();
            var loaiContent = String(row[colV_LoaiContent]).trim();

            // Lấy giá từ Map và đưa vào mảng chờ
            var newCharge = calculateProjectCharge(duAn, loaiContent);
            outValues.push([newCharge]);
            updateCount++;
        } else {
            // Nếu không thỏa mãn, nạp lại giá trị cũ của ô đó để không bị ghi đè mất
            outValues.push([oldAOValues[i][0]]);
        }
    }

    // 4. Ghi đè 1 lần duy nhất toàn bộ cột AO để tối ưu tốc độ (Tránh lỗi Timeout của Google)
    sheet.getRange(12, colAO_ThanhTien, outValues.length, 1).setValues(outValues);
    
}

// Hàm hỗ trợ dịch chữ cái cột thành số index (VD: A->1, B->2) để Backend dùng
function letterToColIndex(letter) {
    let col = 0;
    for (let i = 0; i < letter.length; i++) {
        col += (letter.toUpperCase().charCodeAt(i) - 64) * Math.pow(26, letter.length - i - 1);
    }
    return col;
}

// 5. KHỐI ĐỘNG: Đọc danh sách trạng thái khóa từ sheet "Danh mục"
// Hệ thống sẽ chạy hàm này realtime để nạp các trạng thái đóng băng việc
function getLockedStatuses() {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const catalogSheet = ss.getSheetByName("Danh mục");
        if (!catalogSheet) return ["Hoàn thành", "Hủy", "Tạm hoãn"]; // Phương án dự phòng nếu lỗi sheet

        // Đọc toàn bộ dữ liệu cột B từ dòng 12 trở xuống
        const lastRow = catalogSheet.getLastRow();
        if (lastRow < 12) return ["Hoàn thành", "Hủy", "Tạm hoãn"];

        const rawValues = catalogSheet.getRange(12, 2, lastRow - 11, 1).getValues();
        
        // Trích xuất các giá trị hợp lệ, loại bỏ ô trống và cắt khoảng trắng thừa
        const allStatuses = rawValues.map(row => row[0].toString().trim()).filter(val => val !== "");

        // Chỉ lọc ra đúng các trạng thái bạn quy định ĐÓNG BĂNG VĨNH VIỄN
        const lockedCriteria = ["Hoàn thành", "Hủy", "Tạm hoãn"]; //Đã dời "Chờ Up" sang bộ luật động automation
        return allStatuses.filter(status => lockedCriteria.includes(status));
    } catch (e) {
        return ["Hoàn thành", "Hủy", "Tạm hoãn"]; // Trả về cấu hình mặc định an toàn nếu hệ thống trục trặc
    }
}
/**
 * TRẠM GÁC CỔNG (VALIDATION ENGINE)
 * Kiểm tra xem User có quyền edit cột này không dựa vào Ma trận phân quyền
 */
function canPerformAction(userPhone, taskRowData, fieldName) {
    const userRole = getUserRoleByPhone(userPhone); // Hàm này bạn đã có sẵn hoặc cần viết để lấy Role từ SĐT
    const matrix = ROLE_MATRIX[userRole];

    // 1. Quản lý: Full quyền
    if (matrix.fullAccess) return { allowed: true };

    // 2. Khách lạ: Read only
    if (matrix.readOnly) return { allowed: false };

    // 3. Kiểm tra Trạng thái Khóa (Khối 1)
    const taskStatus = taskRowData["Trạng thái task"]; // Lấy trạng thái hiện tại của task
    if (matrix.checkStatus && getLockedStatuses().includes(taskStatus)) {
        return { allowed: false };
    }

    // 4. Kiểm tra quyền sở hữu (requireOwnership)
    if (matrix.requireOwnership) {
        const ownerPhone = taskRowData["Người làm task"]; // SĐT người phụ trách
        if (ownerPhone !== userPhone) {
            return { allowed: false };
        }
    }

    // 5. Kiểm tra nhóm cột (Khối 2)
    if (matrix.allowedFields && !matrix.allowedFields.includes(fieldName)) {
        return { allowed: false };
    }

    return { allowed: true };
}

// ==========================================
// HÀM API: CẬP NHẬT THÔNG TIN CÁ NHÂN (PROFILE) & UPLOAD AVATAR DRIVE
// ==========================================
function updateUserProfile(newData) {
    const getColNum = (letter) => {
        let col = 0;
        for (let i = 0; i < letter.length; i++) {
            col += (letter.toUpperCase().charCodeAt(i) - 64) * Math.pow(26, letter.length - i - 1);
        }
        return col;
    };

    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Nhân sự"); 
        if (!sheet) return { success: false, message: "Không tìm thấy Sheet Nhân sự!" };

        const data = sheet.getDataRange().getValues();
        const idxPhone = getColNum(USER_FIELD_MAP["SĐT Zalo"].col) - 1;
        const idxPass = getColNum(USER_FIELD_MAP["Mật khẩu"].col) - 1;
        const idxName = getColNum(USER_FIELD_MAP["Tên"].col) - 1;
        const idxRole = getColNum(USER_FIELD_MAP["Vị trí"].col) - 1;
        const idxAvatar = getColNum(USER_FIELD_MAP["Ảnh Avatar"].col) - 1;
        const idxColor = getColNum(USER_FIELD_MAP["Màu sắc yêu thích"].col) - 1;
        
        let userRowIndex = -1;
        for (let i = 11; i < data.length; i++) { 
            if (String(data[i][idxPhone]).trim() === String(newData.phone).trim()) {
                userRowIndex = i; break;
            }
        }
        
        if (userRowIndex === -1) return { success: false, message: "Không tìm thấy tài khoản!" };
        const rowNum = userRowIndex + 1; 
                
        // 🚀 BƯỚC 3: LƯU TRỰC TIẾP MÃ BASE64 VÀO GOOGLE SHEET
        if (newData.avatarBase64) {
            // Khóa an toàn 2 lớp: Chặn mã quá 50,000 ký tự để tránh làm lỗi ô Google Sheet
            if (newData.avatarBase64.length > 50000) {
                return { success: false, message: "Ảnh vẫn quá lớn. Vui lòng thử lại!" };
            }
            // Gán thẳng mã chuỗi ảnh vào biến avatar để ghi xuống Sheet
            newData.avatar = newData.avatarBase64; 
        }
        
        // 2. GHI ĐÈ DỮ LIỆU VÀO SHEET
        // if (newData.name) sheet.getRange(rowNum, getColNum(USER_FIELD_MAP["Tên"].col)).setValue(newData.name);
        if (newData.password) sheet.getRange(rowNum, getColNum(USER_FIELD_MAP["Mật khẩu"].col)).setValue(newData.password);
        if (newData.avatar) sheet.getRange(rowNum, getColNum(USER_FIELD_MAP["Ảnh Avatar"].col)).setValue(newData.avatar);
        if (newData.color) sheet.getRange(rowNum, getColNum(USER_FIELD_MAP["Màu sắc yêu thích"].col)).setValue(newData.color);
        // 🚀 NẾU CÓ SĐT MỚI: Đổi SĐT cũ thành SĐT mới
        if (newData.newPhone && newData.newPhone !== newData.phone) {
            sheet.getRange(rowNum, getColNum(USER_FIELD_MAP["SĐT Zalo"].col)).setValue(newData.newPhone);
        }
        
        // 3. Trả về dữ liệu mới nhất
        const updatedRow = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
        const updatedUser = {
            phone: String(updatedRow[idxPhone]).trim(),
            name: String(updatedRow[idxName]).trim(),
            role: String(updatedRow[idxRole]).trim(),
            avatar: String(updatedRow[idxAvatar] || "").trim(),
            color: String(updatedRow[idxColor] || "").trim()
        };
        
        return { success: true, user: updatedUser, message: "Cập nhật hồ sơ thành công!" };
        
    } catch (error) {
        return { success: false, message: "Lỗi Backend: " + error.toString() };
    }
}
const PM_CONFIG = {
  APP_TITLE: " ",
  MENU_NAME: "🕐 Công cụ",
  MENU_ITEM: "📈 Mở Dashboard",
  DIALOG_WIDTH: 1280,
  DIALOG_HEIGHT: 820,
 
  SHEETS: {
    TASKS: "Công việc",
    PROJECTS: "Dự án",
    PEOPLE: "Nhân sự",
    CATALOG: "Danh mục",
    EMAIL: "Cấu hình email",
  },
 
  HEADER_ROW: 10,
  // Dữ liệu thật bắt đầu từ hàng 12 (hàng 11 là hướng dẫn)
  MIN_DATA_ROW: 12,
 
  CACHE_TTL_SEC: 60, // giữ nguyên
};
/* =========================
 * tương tác zalo
 * ========================= */
// 1. HÀM TỰ ĐỘNG CHẠY NGẦM: Nhận dữ liệu tự động từ Zalo Server gửi về
function doPost(e) {
  try {
    // 1. Kiểm tra nếu không có dữ liệu nội dung gửi đến thì dừng lại ngay
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({"ok": false, "error": "No data"}))
                           .setMimeType(ContentService.MimeType.JSON);
    }
 
    // 2. Chuyển chuỗi chữ thô nhận được từ Zalo thành đối tượng lập trình (Object)
    const postData = JSON.parse(e.postData.contents);
   
    // 3. Kiểm tra xem cấu trúc có đúng là sự kiện nhận tin nhắn văn bản không
    if (postData && postData.event_name === "message.text.received" && postData.message) {
     
      const messageObj = postData.message;
     
      // Bóc tách chính xác các trường thông tin dựa trên mẫu thực tế nhận được
      const chatId = messageObj.chat.id; // Lấy Chat ID: "87b45e9741d5a88bf1c4"
      const displayName = messageObj.from ? messageObj.from.display_name : "Ẩn danh"; // Lấy tên: "Trí Đức"
      const textMessage = messageObj.text; // Lấy nội dung gõ: "test"
     
      // 4. Tìm trang tính để lưu dữ liệu sạch
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Danh sách Freelancer");
     
      if (sheet) {
        // Chèn vào Sheet theo thứ tự: Thời gian | Tên Zalo | Chat ID | Tin nhắn
        sheet.appendRow([new Date(), displayName, chatId, textMessage]);
        console.log("✅ Đã lưu tự động freelancer: " + displayName);
      } else {
        console.error("❌ Lỗi: Không tìm thấy trang tính mang tên 'Danh sách Freelancer'");
      }
    }
 
    // 5. Phản hồi thành công cho Zalo Server (Bắt buộc trả về đúng chuẩn JSON)
    return ContentService.createTextOutput(JSON.stringify({"ok": true}))
                         .setMimeType(ContentService.MimeType.JSON);
 
  } catch (error) {
    console.error("🚨 Lỗi xử lý Webhook ngầm: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({"ok": false, "error": error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
 
// 2. HÀM KÍCH HOẠT: Gọi lên Zalo đăng ký liên kết Webhook (Chỉ chạy 1 lần duy nhất)
function dangKyWebhookVoiZalo() {
  const BOT_TOKEN = "1845152671021158154:hDpEAYUHjyPVMRFbdhaVcEhIWUIlyTZWzZuQSksjfTxKVmzEFDOrKqxyDiLxmIMv";
  const URL_WEBHOOK_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwY8svA41ORkkQDaZ42azH7ePEggav6M-rJXhGW1UfkQI70UNSrcYby8XiW71IcBL25PA/exec";
  const SECRET_TOKEN = "QuanLyDuAnFreelancer2026"; // Phải trùng khớp với MY_SECRET_TOKEN ở trên
 
  const url = "https://bot-api.zaloplatforms.com/bot" + BOT_TOKEN + "/setWebhook";
 
  const payload = {
    "url": URL_WEBHOOK_APPS_SCRIPT,
    "secret_token": SECRET_TOKEN
  };
 
  const options = {
    "method": "POST",
    "contentType": "application/json; charset=utf-8",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
 
  try {
    const response = UrlFetchApp.fetch(url, options);
    const jsonResponse = JSON.parse(response.getContentText());
   
    if (jsonResponse.ok === true) {
      Logger.log("✅ Đăng ký Webhook lên Zalo thành công! Hệ thống bắt đầu chuyển sang chế độ tự động.");
    } else {
      Logger.log("❌ Đăng ký thất bại. Chi tiết: " + jsonResponse.description);
    }
  } catch (error) {
    Logger.log("🚨 Lỗi kết nối đăng ký: " + error.toString());
  }
}
function xoaCauHinhWebhookCu() {
  const BOT_TOKEN = "1845152671021158154:hDpEAYUHjyPVMRFbdhaVcEhIWUIlyTZWzZuQSksjfTxKVmzEFDOrKqxyDiLxmIMv";
  const url = "https://bot-api.zaloplatforms.com/bot" + BOT_TOKEN + "/deleteWebhook";
 
  const options = {
    "method": "POST",
    "muteHttpExceptions": true
  };
 
  const response = UrlFetchApp.fetch(url, options);
  Logger.log("Kết quả gỡ Webhook: " + response.getContentText());
}
 
// CÁCH LẤY chat_id CỦA BẤT KỲ ZALO CÁ NHÂN NÀO
// CẦN CHẠY FUNC chuDongLayChatId() XONG RỒI CHAT BẤT KÌ TỪ ZALO CÁ NHÂN CHO BOT MỚI LẤY ĐƯỢC chat_id
function chuDongLayChatId() {
  const BOT_TOKEN = "1845152671021158154:hDpEAYUHjyPVMRFbdhaVcEhIWUIlyTZWzZuQSksjfTxKVmzEFDOrKqxyDiLxmIMv";
  const url = "https://bot-api.zaloplatforms.com/bot" + BOT_TOKEN + "/getUpdates";
 
  const options = {
    "method": "POST",
    "contentType": "application/json; charset=utf-8",
    "payload": JSON.stringify({ "timeout": 30 }),
    "muteHttpExceptions": true
  };
  Logger.log("--- CHAT BẤT KÌ CÂU GÌ TỪ ZALO CÁ NHÂN CHO BOT MỚI LẤY ĐƯỢC chat_id ---");
  Logger.log("--- HỆ THỐNG ĐANG CHỜ TRONG 30 GIÂY ---");
  try {
    const response = UrlFetchApp.fetch(url, options);
    const resultText = response.getContentText();
   
    Logger.log("--- DỮ LIỆU JSON TỪ ZALO TRẢ VỀ ---");
    Logger.log(resultText);
    Logger.log("----------------------------------");
   
  } catch (error) {
    Logger.log("🚨 Lỗi kết nối: " + error.toString());
  }
}
// 1. HÀM CORE: Dùng chung để bắn tin nhắn cho bất kỳ ai khi biết chat_id
function guiTinNhanZaloBot(chatId, noiDungTinNhan) {
  const BOT_TOKEN = "1845152671021158154:hDpEAYUHjyPVMRFbdhaVcEhIWUIlyTZWzZuQSksjfTxKVmzEFDOrKqxyDiLxmIMv";
  const bot_url = "https://bot-api.zaloplatforms.com/bot" + BOT_TOKEN + "/sendMessage";
 
  const bot_header = {
    "Content-Type": "application/json; charset=utf-8",
    "Accept": "application/json"
  };
 
  const bot_payload = {
    "chat_id": chatId,
    "text": noiDungTinNhan
  };
 
  const bot_options = {
    "method": "POST",
    "headers": bot_header,
    "payload": JSON.stringify(bot_payload),
    "muteHttpExceptions": true
  };
 
  try {
    const response = UrlFetchApp.fetch(bot_url, bot_options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    Logger.log("🚨 Lỗi đường truyền Zalo: " + error.toString());
    return null;
  }
}
/* =========================
zalo ID của Đức: 87b45e9741d5a88bf1c4
 * ========================= */
//VÍ DỤ ỨNG DỤNG: Tự động chạy khi Freelancer cập nhật tiến độ trên Dashboard
function FreelancerCapNhatTienDo() {
  // Giả lập logic: Script tự động tìm dữ liệu từ Sheet ra được thông tin sau:
  const chatIdFreelancer = "87b45e9741d5a88bf1c4"; // Lấy từ cột ID trong Sheets ra
  const tenDuAn = "Thiết kế Giao diện App Freelancer";
  const tienDoMoi = "100% (Hoàn thành)";
 
  // Cấu trúc nội dung tin nhắn tự động thông minh
  const thongBao = "🤖 [THÔNG BÁO CẬP NHẬT TIẾN ĐỘ TASK FREELANCER]\n" +
                   "📌 Dự án: " + tenDuAn + "\n" +
                   "📊 Trạng thái: Freelancer đã cập nhật tiến độ mới: " + tienDoMoi + "\n" +
                   "🌐 Vui lòng kiểm tra Dashboard quản lý để duyệt task.";
                   
  // Gọi hàm core để bắn tin nhắn đi lập tức
  const ketQua = guiTinNhanZaloBot(chatIdFreelancer, thongBao);
 
  if (ketQua && ketQua.ok === true) {
    Logger.log("✅ Hệ thống đã bắn thông báo tự động thành công!");
  }
}
/* =========================
zalo ID của Đức: 87b45e9741d5a88bf1c4
 * tạo link url độc lập
 * ========================= */
 // 1. Hàm khởi tạo: Luôn luôn tải file index.html làm bộ khung cố định duy nhất
function doGet(e) {
  return HtmlService.createTemplateFromFile("Index") // Đảm bảo tên file trong dự án viết đúng là "Index"
      .evaluate()
      .setTitle('Hệ thống Quản lý Tiến Độ Tasks - Trí Đức Car Media')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
 
// 2. Hàm hỗ trợ nhúng (Dùng nếu bạn muốn chia nhỏ file CSS/JS ra cho gọn)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
 
// 3. Hàm cốt lõi của SPA: Nhận tên trang con, đọc nội dung và quăng về cho Trình duyệt dán vào khung
function loadPage(page) {
  try {
    return HtmlService.createTemplateFromFile(page).evaluate().getContent();
  } catch (error) {
    // Trả về thông báo lỗi trực quan nếu bạn gõ sai tên file html con
    return `
      <div class="alert alert-danger m-3 border-start border-4 border-danger">
        <h5>⚠️ Lỗi tải trang hệ thống</h5>
        <p>Không tìm thấy file giao diện có tên chính xác là: <b>${page}.html</b> trong dự án Apps Script.</p>
        <small>Lưu ý: Hệ thống phân biệt chữ HOA và chữ thường. Bạn hãy kiểm tra lại tên file trong Apps Script nhé.</small>
      </div>
    `;
  }
}
 
/* =========================
 * MENU
 * ========================= */
 
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu(PM_CONFIG.MENU_NAME)
    .addItem(PM_CONFIG.MENU_ITEM, "showPMDashboard")
    .addSeparator()
    .addItem("📧 Gửi nhắc việc ngay", "sendTaskRemindersManual")
    .addItem("👥 Mở Dashboard nhân sự", "showHRDashboard")
    .addItem("🔔 Cập nhật trigger email tự động", "setupDailyEmailReminderTrigger")
    .addToUi();
}
 
function showPMDashboard() {
  const html = HtmlService.createHtmlOutputFromFile("Dashboard")
    .setTitle(PM_CONFIG.APP_TITLE)
    .setWidth(PM_CONFIG.DIALOG_WIDTH)
    .setHeight(PM_CONFIG.DIALOG_HEIGHT);
 
  SpreadsheetApp.getUi().showModalDialog(html, PM_CONFIG.APP_TITLE);
}
 
/**
 * Dashboard nhân sự – mở file HTML HR_Dashboard
 */
function showHRDashboard() {
  const html = HtmlService.createHtmlOutputFromFile("HR_Dashboard")
    .setTitle("HR Performance Dashboard")
    .setWidth(PM_CONFIG.DIALOG_WIDTH)
    .setHeight(PM_CONFIG.DIALOG_HEIGHT);
  SpreadsheetApp.getUi().showModalDialog(html, " ");
}
 
/**
 * Bấm menu -> gửi nhắc việc ngay (không cần trigger).
 */
function sendTaskRemindersManual() {
  const res = sendTaskReminders();
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    "Gửi nhắc việc",
    `Đã tổng hợp: ${res?.sent ?? 0} công việc\nBỏ qua: ${res?.skipped ?? 0}${
      res?.reason ? "\nLý do: " + res.reason : ""
    }`,
    ui.ButtonSet.OK
  );
  return res;
}
 
/**
 * Trigger theo giờ gọi tự động.
 */
function sendTaskRemindersScheduled() {
  const res = sendTaskReminders();
  Logger.log("Scheduled sendTaskReminders result: " + JSON.stringify(res));
  return res;
}
 
/**
 * Tạo / cập nhật trigger chạy hàng ngày theo "Giờ gửi mỗi ngày"
 */
function setupDailyEmailReminderTrigger() {
  const ss = SpreadsheetApp.getActive();
  const cfg = readEmailConfig_(ss, PM_CONFIG.SHEETS.EMAIL) || {};
 
  let timeStr = cfg["Giờ gửi mỗi ngày"] || "08:00";
  timeStr = normalizeTime_(timeStr) || "08:00";
 
  const parts = String(timeStr).split(":");
  let hour = parseInt(parts[0], 10);
  let minute = parts.length > 1 ? parseInt(parts[1], 10) : 0;
 
  if (isNaN(hour) || hour < 0 || hour > 23) hour = 8;
  if (isNaN(minute) || minute < 0 || minute > 59) minute = 0;
 
  // Xoá trigger cũ
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (tr) {
    if (tr.getHandlerFunction && tr.getHandlerFunction() === "sendTaskRemindersScheduled") {
      ScriptApp.deleteTrigger(tr);
    }
  });
 
  // Tạo trigger mới
  ScriptApp.newTrigger("sendTaskRemindersScheduled")
    .timeBased()
    .everyDays(1)
    .atHour(hour)
    .nearMinute(minute)
    .create();
 
  SpreadsheetApp.getUi().alert(
    "Thiết lập xong",
    "Đã tạo/cập nhật trigger tự gửi email mỗi ngày lúc " +
      hour.toString().padStart(2, "0") +
      ":" +
      minute.toString().padStart(2, "0") +
      ".\nBạn không cần mở file, Google sẽ tự chạy theo giờ này.",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
 
/* =========================
 * INIT DATA (DASHBOARD)
 * ========================= */
 
/**
 * ✅ FIX LỖI: Argument too large: value
 * - CacheService giới hạn ~100KB/value → payload lớn thì skip cache, vẫn trả dữ liệu
 */
function getInitData() {
  const cache = CacheService.getScriptCache();
  const key = "PM_DASH_INIT_V1";
 
  // Try read cache (không để cache lỗi làm chết hàm)
  try {
    const cached = cache.get(key);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    Logger.log("⚠️ Cache get failed: " + e);
  }
 
  const ss = SpreadsheetApp.getActive();
  const today = new Date();
  const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
 
  const tasks = readTable_(ss, PM_CONFIG.SHEETS.TASKS);
  const projects = readTable_(ss, PM_CONFIG.SHEETS.PROJECTS);
  const people = readTable_(ss, PM_CONFIG.SHEETS.PEOPLE);
  const catalogs = readCatalogs_(ss, PM_CONFIG.SHEETS.CATALOG);
  const emailConfig = readEmailConfig_(ss, PM_CONFIG.SHEETS.EMAIL);
 
  const projectById = {};
  projects.forEach((p) => (projectById[p["Mã dự án"]] = p));
 
  const peopleById = {};
  people.forEach((n) => (peopleById[n["Mã nhân sự"]] = n));
 
  const normalized = normalizeAll_({
    tasks,
    projects,
    people,
    projectById,
    peopleById,
    today,
    tz,
  });
 
  const payload = {
    meta: {
      appTitle: PM_CONFIG.APP_TITLE,
      todayISO: Utilities.formatDate(today, tz, "yyyy-MM-dd"),
      tz,
      headerRow: PM_CONFIG.HEADER_ROW,
      minDataRow: PM_CONFIG.MIN_DATA_ROW,
      sheetNames: PM_CONFIG.SHEETS,
    },
    catalogs,
    emailConfig,
    tasks: normalized.tasks,
    projects: normalized.projects,
    people: normalized.people,
    customMetricsMap: DASHBOARD_METRICS_MAP,
  };
 
  // ✅ Safe cache put (skip nếu quá lớn)
  try {
    const json = JSON.stringify(payload);
    safeCachePut_(cache, key, json, PM_CONFIG.CACHE_TTL_SEC);
  } catch (e) {
    Logger.log("⚠️ Cache put skipped/failed: " + e);
  }
 
  return payload;
}
 
/**
 * Alias cho HR Dashboard
 */
function getHRInitData() {
  return getInitData();
}
 
/**
 * Update task fields
 */
function updateTask(patch) {
  if (!patch || !patch.rowNumber || !patch.updates) {
    throw new Error("Thiếu patch.rowNumber hoặc patch.updates");
  }
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(PM_CONFIG.SHEETS.TASKS);
  if (!sh) throw new Error("Không tìm thấy sheet Công việc");
 
  const headerRow = PM_CONFIG.HEADER_ROW;
  const headers = sh.getRange(headerRow, 1, 1, sh.getLastColumn()).getValues()[0];
 
  const row = patch.rowNumber;
  const updates = patch.updates;
 
  Object.keys(updates).forEach((h) => {
    const col = headers.indexOf(h) + 1;
    if (col <= 0) return;
    sh.getRange(row, col).setValue(updates[h]);
  });
 
  CacheService.getScriptCache().remove("PM_DASH_INIT_V1");
  return { ok: true };
}
 
/**
 * Update email config
 */
function updateEmailConfig(patch) {
  if (!patch || !patch.updates) throw new Error("Thiếu patch.updates");
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(PM_CONFIG.SHEETS.EMAIL);
  if (!sh) throw new Error("Không tìm thấy sheet Cấu hình email");
 
  const headerRow = PM_CONFIG.HEADER_ROW;
  const headers = sh.getRange(headerRow, 1, 1, sh.getLastColumn()).getValues()[0];
 
  const row = findFirstRealDataRow_(sh, headerRow) || PM_CONFIG.MIN_DATA_ROW;
  const updates = patch.updates;
 
  Object.keys(updates).forEach((h) => {
    const col = headers.indexOf(h) + 1;
    if (col <= 0) return;
    sh.getRange(row, col).setValue(updates[h]);
  });
 
  CacheService.getScriptCache().remove("PM_DASH_INIT_V1");
  return { ok: true };
}
 
/**
 * Jump to a specific row in a sheet
 */
function openRow(sheetName, rowNumber) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(sheetName);
  if (!sh) throw new Error("Không tìm thấy sheet: " + sheetName);
 
  ss.setActiveSheet(sh);
  sh.setActiveRange(sh.getRange(Math.max(1, rowNumber), 1));
  SpreadsheetApp.flush();
  return { ok: true };
}
 
/* =========================
 * HELPERS (CACHE / READ TABLE)
 * ========================= */
 
// ✅ FIX: cache value size guard
function safeCachePut_(cache, key, value, ttlSec) {
  // CacheService limit ~100KB/value, dùng ngưỡng an toàn thấp hơn
  const LIMIT = 90 * 1024; // 90KB
  const bytes = Utilities.newBlob(value).getBytes().length;
 
  if (bytes > LIMIT) {
    Logger.log("⚠️ Skip cache.put: payload " + bytes + " bytes > " + LIMIT + " bytes");
    return false;
  }
  cache.put(key, value, ttlSec);
  return true;
}
 
function readTable_(ss, sheetName) {
  const sh = ss.getSheetByName(sheetName);
  if (!sh) throw new Error("Không tìm thấy sheet: " + sheetName);
 
  const headerRow = PM_CONFIG.HEADER_ROW;
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  if (lastRow < headerRow + 1) return [];
 
  const values = sh.getRange(headerRow, 1, lastRow - headerRow + 1, lastCol).getValues();
  const headers = values[0].map((h) => String(h || "").trim());
 
  // Build header->index map (ignore empty headers)
  const headerIdx = {};
  headers.forEach((h, i) => {
    if (h) headerIdx[h] = i;
  });
 
  // ✅ Cột khóa để quyết định “hàng có dữ liệu thật”
  let keyHeader = null;
  if (sheetName === PM_CONFIG.SHEETS.TASKS) keyHeader = "Tên công việc";
  if (sheetName === PM_CONFIG.SHEETS.PROJECTS) keyHeader = "Tên dự án";
  if (sheetName === PM_CONFIG.SHEETS.PEOPLE) keyHeader = "Họ và tên";
 
  const keyIdx = keyHeader && headerIdx.hasOwnProperty(keyHeader) ? headerIdx[keyHeader] : null;
 
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const rowNumber = headerRow + i;
    if (rowNumber < PM_CONFIG.MIN_DATA_ROW) continue;
 
    const row = values[i];
 
    // ✅ Nếu có cột khóa: chỉ nhận dòng có giá trị thật ở cột khóa
    if (keyIdx !== null) {
      const raw = row[keyIdx];
      const s = String(raw || "").trim();
      if (!s) continue;
      if (s === "Điền" || s === "Chọn") continue;
      if (s.includes("🔐")) continue;
    } else {
      // Fallback: vẫn bỏ dòng trống hoàn toàn
      const nonEmpty = row.some((v) => {
        if (v === null || v === "") return false;
        const s = String(v).trim();
        if (!s) return false;
        if (s === "Điền" || s === "Chọn") return false;
        if (s.includes("🔐")) return false;
        return true;
      });
      if (!nonEmpty) continue;
    }
 
    const obj = { _rowNumber: rowNumber };
    Object.keys(headerIdx).forEach((h) => {
      obj[h] = row[headerIdx[h]];
    });
 
    // Normalize IDs (chỉ gán sau khi đã xác định là dòng “có dữ liệu thật”)
    if (sheetName === PM_CONFIG.SHEETS.TASKS) {
      obj["Mã công việc"] = obj["Mã công việc"] || "CV-" + rowNumber;
    }
    if (sheetName === PM_CONFIG.SHEETS.PROJECTS) {
      obj["Mã dự án"] = obj["Mã dự án"] || "DA-" + rowNumber;
    }
    if (sheetName === PM_CONFIG.SHEETS.PEOPLE) {
      obj["Mã nhân sự"] = obj["Mã nhân sự"] || "NS-" + rowNumber;
    }
 
    out.push(obj);
  }
 
  return out;
}
 
function normalizeCatalogKey_(k) {
  return String(k || "")
    .replace(/\u00A0/g, " ")   // NBSP
    .replace(/🔐/g, "")        // bỏ icon khóa
    .replace(/\s+/g, " ")      // gom khoảng trắng
    .trim();
}
 
function readCatalogs_(ss, sheetName) {
  const sh = ss.getSheetByName(sheetName);
  if (!sh) return {};
  const headerRow = PM_CONFIG.HEADER_ROW;
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  if (lastRow < headerRow + 2) return {};
 
  const values = sh.getRange(headerRow, 1, lastRow - headerRow + 1, lastCol).getValues();
  const headers = values[0];
 
  const catalogs = {};
 
  for (let c = 0; c < headers.length; c++) {
    const rawKey = headers[c];
    if (!rawKey || String(rawKey).trim() === "") continue;
 
    const cleanKey = normalizeCatalogKey_(rawKey);
    if (!cleanKey) continue;
 
    const list = [];
    for (let r = 1; r < values.length; r++) {
      const v = values[r][c];
      if (!v) continue;
      const s = String(v).trim();
      if (!s || s === "Điền" || s === "Chọn" || s.includes("🔐")) continue;
      list.push(s);
    }
 
    // merge nếu trùng key sau khi clean
    catalogs[cleanKey] = uniq_([...(catalogs[cleanKey] || []), ...list]);
  }
 
  return catalogs;
}
 
function readEmailConfig_(ss, sheetName) {
  const sh = ss.getSheetByName(sheetName);
  if (!sh) return {};
 
  const headerRow = PM_CONFIG.HEADER_ROW;
  const lastCol = sh.getLastColumn();
  const headers = sh.getRange(headerRow, 1, 1, lastCol).getValues()[0];
 
  const row = findFirstRealDataRow_(sh, headerRow) || PM_CONFIG.MIN_DATA_ROW;
  const vals = sh.getRange(row, 1, 1, lastCol).getValues()[0];
 
  const obj = {};
  headers.forEach((h, i) => {
    if (!h) return;
    obj[String(h).trim()] = vals[i];
  });
 
  obj["Giờ gửi mỗi ngày"] = normalizeTime_(obj["Giờ gửi mỗi ngày"]);
  return obj;
}
 
function findFirstRealDataRow_(sh, headerRow) {
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  for (let r = headerRow + 1; r <= Math.min(lastRow, headerRow + 20); r++) {
    const row = sh.getRange(r, 1, 1, lastCol).getValues()[0];
    const hasReal = row.some((v) => {
      if (!v) return false;
      const s = String(v).trim();
      if (!s) return false;
      if (s === "Điền" || s === "Chọn") return false;
      if (s.includes("🔐")) return false;
      return true;
    });
    if (hasReal) return r;
  }
  return null;
}
 
/* =========================
 * NORMALIZE DATA (DASHBOARD)
 * ========================= */
 
function eisenhowerQuadrant_(important, urgent) {
  const im = !!important;
  const ur = !!urgent;
  if (im && ur) return "Q1";
  if (im && !ur) return "Q2";
  if (!im && ur) return "Q3";
  return "Q4";
}
 
/**
 * ✅ Chuẩn hóa dữ liệu (đã thêm Quan trọng/Khẩn cấp)
 */
function normalizeAll_({ tasks, projects, people, projectById, peopleById, today, tz }) {
  const todayMs = new Date(Utilities.formatDate(today, tz, "yyyy/MM/dd")).getTime();
 
  const peopleOut = people.map((p) => ({
    id: p["Mã nhân sự"],
    name: p["Họ và tên"] || "",
    email: p["Email"] || "",
    department: p["Bộ phận"] || "",
    role: p["Vai trò"] || "",
    status: p["Trạng thái"] || "",
    activeTasks: num_(p["Số công việc đang làm"]),
    overdueTasks: num_(p["Số công việc quá hạn"]),
    note: p["Ghi chú"] || "",
    rowNumber: p._rowNumber,
  }));
 
  const projectsOut = projects.map((pr) => {
    const start = toDate_(pr["Ngày bắt đầu"]);
    const end = toDate_(pr["Ngày kết thúc"]);
    return {
      id: pr["Mã dự án"],
      name: pr["Tên dự án"] || "",
      goal: pr["Mục tiêu"] || "",
      managerId: pr["Mã nhân sự quản lý"] || "",
      managerName:
        pr["Họ tên quản lý"] ||
        (peopleById[pr["Mã nhân sự quản lý"]] ? peopleById[pr["Mã nhân sự quản lý"]]["Họ và tên"] : ""),
      startMs: start ? start.getTime() : null,
      endMs: end ? end.getTime() : null,
      startISO: start ? Utilities.formatDate(start, tz, "yyyy-MM-dd") : "",
      endISO: end ? Utilities.formatDate(end, tz, "yyyy-MM-dd") : "",
      status: pr["Trạng thái dự án"] || "",
      totalTasks: num_(pr["Tổng số công việc"]),
      doneTasks: num_(pr["Số công việc hoàn thành"]),
      progressPct: pct_(pr["Tiến độ %"]),
      overdueCount: num_(pr["Số công việc quá hạn"]),
      alert: pr["Cảnh báo dự án"] || "",
      note: pr["Ghi chú"] || "",
      rowNumber: pr._rowNumber,
    };
  });
 
  const tasksOut = tasks.map((t) => {
    const projectId = t["Mã dự án"] || "";
    const personId = t["Mã nhân sự phụ trách"] || "";
    const start = toDate_(t["Ngày bắt đầu"]);
    const due = toDate_(t["Hạn chót"]);
    const startMs = start ? start.getTime() : null;
    const dueMs = due ? due.getTime() : null;
 
    const done = toDate_(t["Ngày hoàn thành thực tế"]);
    const doneMs = done ? done.getTime() : null;
 
    let daysLeft = null;
    if (dueMs) daysLeft = Math.ceil((dueMs - todayMs) / 86400000);
 
    const status = t["Trạng thái"] || "";
    const doneLike = isDoneStatus_(status);
 
    const overdue = dueMs && !doneLike && dueMs < todayMs;
    const dueToday = dueMs && !doneLike && Math.floor((dueMs - todayMs) / 86400000) === 0;
    const due3 = dueMs && !doneLike && daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
    const due7 = dueMs && !doneLike && daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
 
    const difficultyLabel = t["Độ khó"] || "";
    const difficultyScore = difficultyScore_(difficultyLabel);
 
    const reviseRaw =
      t["Số lần sửa / Số lần bị trả về"] ??
      t["Số lần sửa"] ??
      t["Số lần sửa / Số lần bị trả"] ??
      0;
 
    // ✅ 2 cột mới
    const importantBool = toBool_(t["Quan trọng"] ?? t["Quan Trọng"]);
    const urgentBool = toBool_(t["Khẩn cấp"] ?? t["Khẩn Cấp"]);
    const eisenhower = eisenhowerQuadrant_(importantBool, urgentBool);
 
    return {
      id: t["Mã công việc"],
      name: t["Tên công việc"] || "",
      desc: t["Mô tả"] || "",
      projectId,
      projectName: t["Tên dự án"] || (projectById[projectId] ? projectById[projectId]["Tên dự án"] : ""),
      assigneeId: personId,
      assigneeName: t["Họ tên phụ trách"] || (peopleById[personId] ? peopleById[personId]["Họ và tên"] : ""),
      assigneeEmail: t["Email phụ trách"] || (peopleById[personId] ? peopleById[personId]["Email"] : ""),
      department: t["Bộ phận phụ trách"] || (peopleById[personId] ? peopleById[personId]["Bộ phận"] : ""),
      assigner: t["Người giao"] || "",
      startMs,
      dueMs,
      startISO: start ? Utilities.formatDate(start, tz, "yyyy-MM-dd") : "",
      dueISO: due ? Utilities.formatDate(due, tz, "yyyy-MM-dd") : "",
      status,
      priority: t["Mức ưu tiên"] || "",
      type: t["Loại công việc"] || "",
      progressPct: pctFromFraction_(t["Mức độ hoàn chỉnh"]),
      daysLeft,
      alert: t["Cảnh báo hạn"] || "",
      remind3: t["Đã gửi nhắc 3 ngày"] || "",
      remind1: t["Đã gửi nhắc 1 ngày"] || "",
      remindToday: t["Đã gửi nhắc hôm nay"] || "",
      lastSent: t["Lần gửi gần nhất"] || "",
      note: t["Ghi chú"] || "",
      link: t["Liên kết"] || "",
      completeMs: doneMs,
      completeISO: done ? Utilities.formatDate(done, tz, "yyyy-MM-dd") : "",
      weight: num_(t["Trọng số"]),
      difficulty: difficultyScore,
      difficultyLabel,
      reviseCount: num_(reviseRaw),
 
      important: importantBool,
      urgent: urgentBool,
      eisenhower: eisenhower,
      importantLabel: importantBool ? "Có" : "Không",
      urgentLabel: urgentBool ? "Có" : "Không",
 
      flags: { overdue, dueToday, due3, due7, doneLike },
      rowNumber: t._rowNumber,
    };
  });
 
  const tasksByProject = {};
  tasksOut.forEach((x) => {
    const key = x.projectId || "—";
    if (!tasksByProject[key]) tasksByProject[key] = [];
    tasksByProject[key].push(x);
  });
 
  const projectsOut2 = projectsOut.map((p) => {
    const list = tasksByProject[p.id] || [];
    if (!list.length) return p;
 
    const total = list.length;
    const done = list.filter((a) => a.flags.doneLike).length;
    const overdue = list.filter((a) => a.flags.overdue).length;
    const avgProgress = total
      ? Math.round(list.reduce((s, a) => s + (a.progressPct || 0), 0) / total)
      : 0;
 
    return { ...p, totalTasks: total, doneTasks: done, overdueCount: overdue, progressPct: avgProgress };
  });
 
  const tasksByPerson = {};
  tasksOut.forEach((x) => {
    const key = x.assigneeId || "—";
    if (!tasksByPerson[key]) tasksByPerson[key] = [];
    tasksByPerson[key].push(x);
  });
 
  const peopleOut2 = peopleOut.map((p) => {
    const list = tasksByPerson[p.id] || [];
 
    const active = list.filter((a) => !a.flags.doneLike).length;
    const overdue = list.filter((a) => a.flags.overdue).length;
    const completed = list.filter((a) => a.flags.doneLike).length;
 
    const totalWeight = list.reduce((s, a) => s + (a.weight || 0), 0);
    const diffSum = list.reduce((s, a) => s + (a.difficulty || 0), 0);
    const diffCount = list.filter((a) => a.difficulty && !isNaN(a.difficulty)).length;
    const avgDifficulty = diffCount ? Math.round((diffSum / diffCount) * 10) / 10 : 0;
 
    const totalRevisions = list.reduce((s, a) => s + (a.reviseCount || 0), 0);
 
    const onTimeTasks = list.filter(
      (a) => a.flags.doneLike && a.completeMs && a.dueMs && a.completeMs <= a.dueMs
    ).length;
    const onTimePct = completed ? Math.round((onTimeTasks / completed) * 100) : 0;
 
    return {
      ...p,
      activeTasks: active,
      overdueTasks: overdue,
      completedTasks: completed,
      totalWeight,
      avgDifficulty,
      totalRevisions,
      onTimeTasks,
      onTimePct,
    };
  });
 
  return { tasks: tasksOut, projects: projectsOut2, people: peopleOut2 };
}
 
function isDoneStatus_(s) {
  const x = String(s || "").toLowerCase();
  return x.includes("hoàn thành") || x === "hoan thanh" || x.includes("hủy") || x === "huy";
}
 
function uniq_(arr) {
  const seen = {};
  const out = [];
  arr.forEach((x) => {
    const k = String(x);
    if (seen[k]) return;
    seen[k] = true;
    out.push(x);
  });
  return out;
}
 
function toDate_(v) {
  if (!v) return null;
  if (Object.prototype.toString.call(v) === "[object Date]" && !isNaN(v.getTime())) return v;
  const s = String(v).trim();
  if (!s) return null;
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  return null;
}
 
function num_(v) {
  if (v === null || v === "" || typeof v === "undefined") return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}
 
function difficultyScore_(v) {
  if (v === null || typeof v === "undefined") return 0;
  if (typeof v === "number") return v;
 
  const s = String(v).trim().toLowerCase();
  if (!s) return 0;
 
  const n = Number(s);
  if (!isNaN(n)) return n;
 
  if (s.includes("rất khó")) return 5;
  if (s.includes("khó")) return 4;
  if (s.includes("trung bình") || s === "tb") return 3;
  if (s.includes("rất dễ")) return 1;
  if (s.includes("dễ")) return 2;
 
  return 0;
}
 
function pctFromFraction_(v) {
  if (v === null || v === "" || typeof v === "undefined") return 0;
  let n = Number(v);
  if (isNaN(n)) return 0;
  if (n <= 1) n = n * 100;
  n = Math.max(0, Math.min(100, n));
  return Math.round(n);
}
 
function pct_(v) {
  if (v === null || v === "" || typeof v === "undefined") return 0;
  let n = Number(v);
  if (isNaN(n)) return 0;
  if (n <= 1) n = n * 100;
  n = Math.max(0, Math.min(100, n));
  return Math.round(n);
}
 
function normalizeTime_(v) {
  if (!v) return "";
  if (Object.prototype.toString.call(v) === "[object Date]") {
    const hh = String(v.getHours()).padStart(2, "0");
    const mm = String(v.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  const s = String(v).trim();
  if (!s) return "";
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (m) return String(m[1]).padStart(2, "0") + ":" + m[2];
  return s;
}
 
/* =========================================================
 * EMAIL REMINDERS – GỬI BẢN TỔNG HỢP
 * ========================================================= */
 
function sendTaskReminders() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(25 * 1000)) {
    Logger.log("⏳ Không lấy được lock (đang có phiên chạy khác).");
    return { ok: false, reason: "lock_busy" };
  }
 
  try {
    const ss = SpreadsheetApp.getActive();
    const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
    const now = new Date();
    const todayDay = dayNumberUTC_(now, tz);
    const todayStr = Utilities.formatDate(now, tz, "dd/MM/yyyy");
    const nowStr = Utilities.formatDate(now, tz, "yyyy-MM-dd HH:mm:ss");
 
    const cfg = readEmailConfig_(ss, PM_CONFIG.SHEETS.EMAIL) || {};
 
    // Bật / tắt
    const enabledRaw = pickCfg_(cfg, ["Bật gửi email", "Bật email", "Enable email"], "Không");
    const enabled =
      String(enabledRaw).toLowerCase().includes("có") ||
      String(enabledRaw).toLowerCase().includes("yes") ||
      enabledRaw === true;
    if (!enabled) {
      Logger.log("🚫 Email đang tắt (Bật gửi email != Có).");
      return { ok: true, sent: 0, skipped: 0, reason: "disabled" };
    }
 
    // Các tuỳ chọn nhắc
    const send7 = toBool_(pickCfg_(cfg, ["Gửi nhắc 7 ngày", "Nhắc 7 ngày", "Nhắc trước 7 ngày"], "Có"));
    const send3 = toBool_(pickCfg_(cfg, ["Gửi nhắc 3 ngày", "Nhắc 3 ngày", "Nhắc trước 3 ngày"], "Có"));
    const send1 = toBool_(pickCfg_(cfg, ["Gửi nhắc 1 ngày", "Nhắc 1 ngày", "Nhắc trước 1 ngày"], "Có"));
    const sendToday = toBool_(pickCfg_(cfg, ["Gửi nhắc hôm nay", "Nhắc hôm nay", "Nhắc trong ngày"], "Có"));
    const sendOverdue = toBool_(pickCfg_(cfg, ["Gửi nhắc quá hạn", "Nhắc quá hạn"], "Không"));
 
    const senderName = pickCfg_(cfg, ["Tên người gửi", "Người gửi"], "PM Dashboard");
    const replyTo = pickCfg_(cfg, ["Email trả lời", "Reply-to", "ReplyTo"], "");
 
    // Email nhận tổng hợp
    const notifyEmail = pickCfg_(
      cfg,
      ["Email nhận thông báo", "Email nhan thong bao", "Email báo cáo", "Email thong bao"],
      ""
    );
    if (!notifyEmail) {
      Logger.log("⚠️ Không có 'Email nhận thông báo' trong Cấu hình email.");
      return { ok: true, sent: 0, skipped: 0, reason: "no_notify_email" };
    }
 
    // CC / BCC
    const baseCc = pickCfg_(cfg, ["Email CC cố định", "CC", "Cc"], "");
    const bcc = pickCfg_(cfg, ["BCC", "Bcc"], "");
 
    // Template
    const subjectTpl = pickCfg_(
      cfg,
      ["Tiêu đề email", "Mẫu tiêu đề email", "Mẫu tiêu đề", "Subject"],
      "[Nhắc việc] Tổng hợp công việc sắp đến hạn - {{Ngày chạy}}"
    );
 
    const bodyTpl = pickCfg_(
      cfg,
      ["Nội dung email", "Mẫu nội dung email", "Mẫu nội dung", "Body", "HTML"],
      defaultEmailHtmlTemplate_()
    );
 
    // Giới hạn số công việc được tổng hợp mỗi lần
    const maxPerRun = Number(pickCfg_(cfg, ["Giới hạn gửi mỗi lần", "Max per run"], 200)) || 200;
 
    const people = readTable_(ss, PM_CONFIG.SHEETS.PEOPLE) || [];
    const peopleById = {};
    people.forEach((p) => (peopleById[p["Mã nhân sự"]] = p));
 
    const sh = ss.getSheetByName(PM_CONFIG.SHEETS.TASKS);
    if (!sh) throw new Error("Không tìm thấy sheet Công việc");
 
    const headerRow = PM_CONFIG.HEADER_ROW;
    const lastRow = sh.getLastRow();
    const lastCol = sh.getLastColumn();
    if (lastRow < PM_CONFIG.MIN_DATA_ROW)
      return { ok: true, sent: 0, skipped: 0, reason: "no_data" };
 
    const headers = sh
      .getRange(headerRow, 1, 1, lastCol)
      .getValues()[0]
      .map((h) => String(h || "").trim());
    const col = (h) => headers.indexOf(h) + 1;
 
    const cTaskName = col("Tên công việc");
    const cStatus = col("Trạng thái");
    const cDue = col("Hạn chót");
    const cProjectName = col("Tên dự án");
    const cPriority = col("Mức ưu tiên");
 
    const cAssigneeName = col("Họ tên phụ trách");
    const cAssigneeId = col("Mã nhân sự phụ trách");
    const cLink = col("Liên kết");
 
    const cRem7 = col("Đã gửi nhắc 7 ngày"); // nếu chưa có cột này thì = 0
    const cRem3 = col("Đã gửi nhắc 3 ngày");
    const cRem1 = col("Đã gửi nhắc 1 ngày");
    const cRemToday = col("Đã gửi nhắc hôm nay");
    const cLastSent = col("Lần gửi gần nhất");
 
    if (!cTaskName || !cStatus || !cDue) {
      throw new Error("Thiếu cột bắt buộc trong sheet Công việc: Tên công việc / Trạng thái / Hạn chót");
    }
    if (!cRem3 || !cRem1 || !cRemToday || !cLastSent) {
      throw new Error("Thiếu cột log gửi email trong sheet Công việc (3 ngày / 1 ngày / hôm nay / Lần gửi gần nhất).");
    }
 
    const numRows = lastRow - PM_CONFIG.MIN_DATA_ROW + 1;
    const range = sh.getRange(PM_CONFIG.MIN_DATA_ROW, 1, numRows, lastCol);
    const values = range.getValues();
 
    const outRem7 = cRem7 ? values.map((r) => [r[cRem7 - 1]]) : null;
    const outRem3 = values.map((r) => [r[cRem3 - 1]]);
    const outRem1 = values.map((r) => [r[cRem1 - 1]]);
    const outRemToday = values.map((r) => [r[cRemToday - 1]]);
    const outLast = values.map((r) => [r[cLastSent - 1]]);
 
    // Các nhóm công việc
    const list7 = [];
    const list3 = [];
    const list1 = [];
    const list0 = [];
    const listOver = [];
 
    let collected = 0;
    let skipped = 0;
 
    for (let i = 0; i < values.length; i++) {
      if (collected >= maxPerRun) break;
 
      const row = values[i];
      const rowNumber = PM_CONFIG.MIN_DATA_ROW + i;
 
      const taskName = String(row[cTaskName - 1] || "").trim();
      if (!taskName) {
        skipped++;
        continue;
      }
 
      const status = String(row[cStatus - 1] || "").trim();
      if (isDoneStatus_(status)) {
        skipped++;
        continue;
      }
 
      const dueDate = toDate_(row[cDue - 1]);
      if (!dueDate) {
        skipped++;
        continue;
      }
 
      const dueDay = dayNumberUTC_(dueDate, tz);
      const daysLeft = dueDay - todayDay;
 
      const isDue7 = daysLeft === 7;
      const isDue3 = daysLeft === 3;
      const isDue1 = daysLeft === 1;
      const isDueToday = daysLeft === 0;
      const isOverdue = daysLeft < 0;
 
      if (
        !(
          (send7 && isDue7) ||
          (send3 && isDue3) ||
          (send1 && isDue1) ||
          (sendToday && isDueToday) ||
          (sendOverdue && isOverdue)
        )
      ) {
        skipped++;
        continue;
      }
 
      const vRem7 = cRem7 ? row[cRem7 - 1] : null;
      const vRem3 = row[cRem3 - 1];
      const vRem1 = row[cRem1 - 1];
      const vRemToday = row[cRemToday - 1];
 
      // Chặn gửi trùng trong cùng 1 ngày với cùng loại nhắc
      if (isDue7 && send7 && cRem7 && hasAnyValue_(vRem7)) {
        skipped++;
        continue;
      }
      if (isDue3 && send3 && hasAnyValue_(vRem3)) {
        skipped++;
        continue;
      }
      if (isDue1 && send1 && hasAnyValue_(vRem1)) {
        skipped++;
        continue;
      }
      if ((isDueToday || isOverdue) && (sendToday || sendOverdue) && isSameDay_(vRemToday, now, tz)) {
        skipped++;
        continue;
      }
 
      // Thông tin hiển thị
      const projectName = cProjectName ? String(row[cProjectName - 1] || "").trim() : "";
      const priority = cPriority ? String(row[cPriority - 1] || "").trim() : "";
 
      let assigneeName = cAssigneeName ? String(row[cAssigneeName - 1] || "").trim() : "";
      const assigneeId = cAssigneeId ? String(row[cAssigneeId - 1] || "").trim() : "";
      if (!assigneeName && assigneeId && peopleById[assigneeId]) {
        assigneeName = String(peopleById[assigneeId]["Họ và tên"] || "").trim();
      }
 
      let link = cLink ? String(row[cLink - 1] || "").trim() : "";
      if (!link) link = buildRowLink_(ss, sh, rowNumber);
 
      const dueStr = Utilities.formatDate(dueDate, tz, "dd/MM/yyyy");
 
      const item = {
        rowIndex: i,
        rowNumber,
        taskName,
        projectName,
        assigneeName,
        dueStr,
        daysLeft,
        priority,
        status,
        link,
      };
 
      if (isOverdue && sendOverdue) {
        listOver.push(item);
        outRemToday[i] = [nowStr];
        outLast[i] = [nowStr];
        collected++;
        continue;
      }
 
      if (isDueToday && sendToday) {
        list0.push(item);
        outRemToday[i] = [nowStr];
        outLast[i] = [nowStr];
        collected++;
        continue;
      }
 
      if (isDue1 && send1) {
        list1.push(item);
        outRem1[i] = [nowStr];
        outLast[i] = [nowStr];
        collected++;
        continue;
      }
 
      if (isDue3 && send3) {
        list3.push(item);
        outRem3[i] = [nowStr];
        outLast[i] = [nowStr];
        collected++;
        continue;
      }
 
      if (isDue7 && send7) {
        list7.push(item);
        if (cRem7) outRem7[i] = [nowStr];
        outLast[i] = [nowStr];
        collected++;
        continue;
      }
 
      skipped++;
    }
 
    const totalTasks =
      list7.length + list3.length + list1.length + list0.length + listOver.length;
 
    if (!totalTasks) {
      Logger.log("Không có công việc nào đến hạn để gửi.");
      return { ok: true, sent: 0, skipped, reason: "no_due_tasks" };
    }
 
    // Build HTML sections
    const sec7 = buildSummarySection_("Công việc còn 7 ngày đến hạn", list7);
    const sec3 = buildSummarySection_("Công việc còn 3 ngày đến hạn", list3);
    const sec1 = buildSummarySection_("Công việc còn 1 ngày đến hạn", list1);
    const sec0 = buildSummarySection_("Công việc đến hạn hôm nay", list0);
    const secOver = buildSummarySection_("Công việc đã quá hạn", listOver);
 
    const dataTpl = {
      "Ngày chạy": todayStr,
      "Tổng số công việc": totalTasks,
      "Danh sách 7 ngày": sec7,
      "Danh sách 3 ngày": sec3,
      "Danh sách 1 ngày": sec1,
      "Danh sách hôm nay": sec0,
      "Danh sách quá hạn": secOver,
    };
 
    const subject = applyTemplate_(subjectTpl, dataTpl);
    const htmlBody = applyTemplate_(bodyTpl, dataTpl);
    const plainBody = htmlToPlain_(htmlBody);
 
    // Chuẩn bị CC
    let ccAll = "";
    if (baseCc) {
      const ccList = [];
      String(baseCc)
        .split(/[;,]/)
        .forEach((addr) => {
          const s = addr.trim();
          if (s) ccList.push(s);
        });
      ccAll = ccList.join(",");
    }
 
    MailApp.sendEmail({
      to: notifyEmail,
      subject,
      body: plainBody,
      htmlBody,
      name: senderName,
      replyTo: replyTo || undefined,
      cc: ccAll || undefined,
      bcc: bcc || undefined,
    });
 
    // Ghi log
    if (cRem7 && outRem7) {
      sh.getRange(PM_CONFIG.MIN_DATA_ROW, cRem7, numRows, 1).setValues(outRem7);
    }
    sh.getRange(PM_CONFIG.MIN_DATA_ROW, cRem3, numRows, 1).setValues(outRem3);
    sh.getRange(PM_CONFIG.MIN_DATA_ROW, cRem1, numRows, 1).setValues(outRem1);
    sh.getRange(PM_CONFIG.MIN_DATA_ROW, cRemToday, numRows, 1).setValues(outRemToday);
    sh.getRange(PM_CONFIG.MIN_DATA_ROW, cLastSent, numRows, 1).setValues(outLast);
 
    CacheService.getScriptCache().remove("PM_DASH_INIT_V1");
    Logger.log(
      `✅ Tổng hợp ${totalTasks} công việc (7d=${list7.length}, 3d=${list3.length}, 1d=${list1.length}, today=${list0.length}, overdue=${listOver.length})`
    );
    return {
      ok: true,
      sent: totalTasks,
      skipped,
      groups: {
        d7: list7.length,
        d3: list3.length,
        d1: list1.length,
        today: list0.length,
        overdue: listOver.length,
      },
    };
  } finally {
    lock.releaseLock();
  }
}
 
/* =========================
 * EMAIL HELPERS
 * ========================= */
 
function pickCfg_(cfg, keys, fallback) {
  for (const k of keys) {
    if (
      cfg &&
      Object.prototype.hasOwnProperty.call(cfg, k) &&
      cfg[k] !== "" &&
      cfg[k] !== null &&
      typeof cfg[k] !== "undefined"
    ) {
      return cfg[k];
    }
  }
  return fallback;
}
 
function toBool_(v) {
  const s = String(v || "").trim().toLowerCase();
  if (v === true) return true;
  if (v === false) return false;
  if (!s) return false;
  return s.includes("có") || s === "yes" || s === "true" || s === "1" || s === "on";
}
 
function hasAnyValue_(v) {
  if (v === null || typeof v === "undefined") return false;
  if (v === "") return false;
  return String(v).trim() !== "";
}
 
function isSameDay_(v, refDate, tz) {
  const d = toDate_(v);
  if (!d) return false;
  return dayNumberUTC_(d, tz) === dayNumberUTC_(refDate, tz);
}
 
function dayNumberUTC_(d, tz) {
  const y = Number(Utilities.formatDate(d, tz, "yyyy"));
  const m = Number(Utilities.formatDate(d, tz, "MM")) - 1;
  const da = Number(Utilities.formatDate(d, tz, "dd"));
  return Math.floor(Date.UTC(y, m, da) / 86400000);
}
 
function buildRowLink_(ss, sh, rowNumber) {
  const gid = sh.getSheetId();
  return ss.getUrl() + "#gid=" + gid + "&range=" + rowNumber + ":" + rowNumber;
}
 
function applyTemplate_(tpl, data) {
  let out = String(tpl || "");
  Object.keys(data || {}).forEach((k) => {
    const re = new RegExp("\\{\\{\\s*" + escapeRegExp_(k) + "\\s*\\}\\}", "g");
    out = out.replace(re, String(data[k] ?? ""));
  });
  return out;
}
 
function escapeRegExp_(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
 
function htmlToPlain_(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
 
function escapeHtml_(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
 
/**
 * Tạo 1 section bảng cho từng nhóm (7 ngày, 3 ngày, 1 ngày, hôm nay, quá hạn)
 */
function buildSummarySection_(title, list) {
  if (!list || !list.length) return "";
 
  let rows = "";
  list.forEach((t, idx) => {
    rows +=
      "<tr>" +
      `<td style="border:1px solid #e5e7eb;padding:4px 6px;text-align:center;">${idx + 1}</td>` +
      `<td style="border:1px solid #e5e7eb;padding:4px 6px;">${escapeHtml_(t.taskName)}</td>` +
      `<td style="border:1px solid #e5e7eb;padding:4px 6px;">${escapeHtml_(t.assigneeName)}</td>` +
      `<td style="border:1px solid #e5e7eb;padding:4px 6px;">${escapeHtml_(t.projectName)}</td>` +
      `<td style="border:1px solid #e5e7eb;padding:4px 6px;text-align:center;">${escapeHtml_(t.dueStr)}</td>` +
      `<td style="border:1px solid #e5e7eb;padding:4px 6px;text-align:center;">${escapeHtml_(t.priority || "")}</td>` +
      `<td style="border:1px solid #e5e7eb;padding:4px 6px;">${escapeHtml_(t.status || "")}</td>` +
      `<td style="border:1px solid #e5e7eb;padding:4px 6px;text-align:center;">` +
      `<a href="${escapeHtml_(t.link)}" target="_blank">Mở</a>` +
      "</td>" +
      "</tr>";
  });
 
  return `
    <h3 style="margin:16px 0 6px;font-size:15px;color:#111827;">${escapeHtml_(title)} (${list.length})</h3>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:13px;border:1px solid #e5e7eb;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="border:1px solid #e5e7eb;padding:4px 6px;width:36px;">#</th>
          <th style="border:1px solid #e5e7eb;padding:4px 6px;">Công việc</th>
          <th style="border:1px solid #e5e7eb;padding:4px 6px;width:160px;">Người phụ trách</th>
          <th style="border:1px solid #e5e7eb;padding:4px 6px;">Dự án</th>
          <th style="border:1px solid #e5e7eb;padding:4px 6px;width:90px;">Hạn chót</th>
          <th style="border:1px solid #e5e7eb;padding:4px 6px;width:80px;">Ưu tiên</th>
          <th style="border:1px solid #e5e7eb;padding:4px 6px;">Trạng thái</th>
          <th style="border:1px solid #e5e7eb;padding:4px 6px;width:80px;">Liên kết</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}
 
/**
 * ✅ Template HTML email tổng hợp – có thể override bằng "Mẫu nội dung email"
 *
 * Placeholder hỗ trợ:
 *   {{Ngày chạy}}
 *   {{Tổng số công việc}}
 *   {{Danh sách 7 ngày}}
 *   {{Danh sách 3 ngày}}
 *   {{Danh sách 1 ngày}}
 *   {{Danh sách hôm nay}}
 *   {{Danh sách quá hạn}}
 */
function defaultEmailHtmlTemplate_() {
  return `
  <div style="max-width:840px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;line-height:1.6;">
    <div style="padding:12px 16px;background:#0f766e;color:#ffffff;border-radius:6px 6px 0 0;">
      <div style="font-size:12px;opacity:0.9;text-transform:uppercase;letter-spacing:0.04em;">
        Tổng hợp nhắc việc tự động
      </div>
      <div style="font-size:18px;font-weight:600;margin-top:2px;">
        Ngày {{Ngày chạy}} – {{Tổng số công việc}} công việc đến hạn
      </div>
    </div>
 
    <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 6px 6px;padding:18px 20px;background:#ffffff;">
      <p>Chào bạn,</p>
 
      <p>Dưới đây là tổng hợp các công việc sắp đến hạn và quá hạn trong hệ thống quản lý dự án &amp; công việc.</p>
 
      {{Danh sách 7 ngày}}
      {{Danh sách 3 ngày}}
      {{Danh sách 1 ngày}}
      {{Danh sách hôm nay}}
      {{Danh sách quá hạn}}
 
      <p style="margin-top:16px;">Sau khi xử lý, vui lòng cập nhật trạng thái trên file để hệ thống luôn phản ánh đúng tiến độ.</p>
 
      <p style="font-size:12px;color:#6b7280;margin-top:16px;">
        Email này được gửi tự động từ hệ thống quản lý dự án &amp; công việc.<br/>
        Vui lòng không trả lời email này nếu không cần thiết.
      </p>
    </div>
  </div>
  `;
}
 
// ==========================================
// API: LẤY DROPDOWN TỰ ĐỘNG (FIX LỖI AVATAR 100% ĐỘNG)
// ==========================================
function getDropdownData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pSheet = ss.getSheetByName("Dự án");
  var uSheet = ss.getSheetByName("Nhân sự");
  var cSheet = ss.getSheetByName("Danh mục");
  // Thêm dòng này vào phần khai báo biến của hàm getDropdownData()
  var infoTypes = cSheet ? cSheet.getRange(12, 22, cSheet.getLastRow() - 11 || 1, 1).getDisplayValues().flat().filter(String) : [];

  var projects = pSheet ? pSheet.getRange(12, 3, pSheet.getLastRow() - 11 || 1, 1).getDisplayValues().flat().filter(String) : [];
  
  var assignees = [];
  var assigneeDetails = {}; 
  if (uSheet) {
    // 🚀 ĐÃ FIX: Lấy full bảng và tính toán Cột động 100% bằng USER_FIELD_MAP
    var uData = uSheet.getDataRange().getDisplayValues();
    var idxName   = letterToColIndex(USER_FIELD_MAP["Tên"].col) - 1;
    var idxAvatar = letterToColIndex(USER_FIELD_MAP["Ảnh Avatar"].col) - 1;
    var idxColor  = letterToColIndex(USER_FIELD_MAP["Màu sắc yêu thích"].col) - 1;

    for (var i = 11; i < uData.length; i++) {
      var name = String(uData[i][idxName] || "").trim();
      var avatar = String(uData[i][idxAvatar] || "").trim();
      var color = String(uData[i][idxColor] || "").trim();
      
      if (name && name !== "") {
        assignees.push(name);
        assigneeDetails[name] = { color: color, avatar: avatar };
      }
    }
  }

  var types = cSheet ? cSheet.getRange(12, 6, cSheet.getLastRow() - 11 || 1, 1).getDisplayValues().flat().filter(String) : [];
  var priorities = cSheet ? cSheet.getRange(12, 4, 3, 1).getDisplayValues().flat().filter(String) : [];
  var statuses = cSheet ? cSheet.getRange(12, 2, cSheet.getLastRow() - 11 || 1, 1).getDisplayValues().flat().filter(String) : [];
  var serviceTypes = cSheet ? cSheet.getRange(12, 18, cSheet.getLastRow() - 11 || 1, 1).getDisplayValues().flat().filter(String) : [];
  var converseTypes = cSheet ? cSheet.getRange(12, 20, cSheet.getLastRow() - 11 || 1, 1).getDisplayValues().flat().filter(String) : [];
  
  var zColData = cSheet ? cSheet.getRange("Z1:Z50").getDisplayValues() : [];
  var bannerBase64 = zColData.flat().join(""); // Gộp tất cả mảnh vụn thành 1 chuỗi ảnh hoàn chỉnh

  return {
    projects: [...new Set(projects)],
    assignees: [...new Set(assignees)],
    assigneeDetails: assigneeDetails,
    types: [...new Set(types)],
    priorities: priorities,
    statuses: [...new Set(statuses)],
    serviceTypes: [...new Set(serviceTypes)],
    converseTypes: [...new Set(converseTypes)],
    infoTypes: [...new Set(infoTypes)], // 🚀 Trả về danh sách Loại thông tin
    bannerBase64: bannerBase64, // 🚀 GỬI BỨC ẢNH HOÀN CHỈNH XUỐNG FRONTEND
    pricingRules: CONTENT_PRICING, // 🚀 NHÉT THÊM BẢNG GIÁ VÀO ĐÂY ĐỂ GỬI LÊN FRONTEND
    fixedCosts: PROJECT_FIXED_COSTS,
    mktActualCostMap: MKT_ACTUAL_COST_FIELD_MAP // 🚀 TRUYỀN BẢN ĐỒ THỰC CHI MKT FORM XUỐNG FRONTEND
  };
}

// ==========================================
// API: LẤY DỮ LIỆU CHUẨN XÁC & ĐO ĐẠC RADAR ONLINE
// ==========================================
function getTasksList(currentUser) {
  // 🚀 VÁ LỖI: KHAI BÁO BIẾN ss Ở ĐÂY ĐỂ TRÁNH LỖI REFERENCE ERROR
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  var sheet = ss.getSheetByName("Công việc");
  if (!sheet) return { tasks: [], onlineUsers: [] };
  
  var data = sheet.getDataRange().getDisplayValues();
  var tasks = [];
  for (var i = 11; i < data.length; i++) {
    var row = data[i];
    if (String(row[1]).trim() === "") continue; 
    
    tasks.push({
      row: i + 1, 
      id: row[1], project: row[5], type: row[21], name: row[2], noidung: row[3], 
      assignee: row[7], start: row[11], complete: row[13], status: row[14],
      doinguoi: row[20] ? row[20] : "", 
      nhanxet: row[29], link: row[30], dongia: row[31], airstat: row[33], 
      airdate: row[36] ? row[36] : "", servicetype: row[37] ? row[37] : "", 
      conversetype: row[38] ? row[38] : "", adminnote: row[39] ? row[39] : "",
      projcharge: row[40] ? row[40] : "",
      projchargedate: row[34] ? row[34] : ""
    });
  }

  // XỬ LÝ LƯU VẾT ONLINE REAL-TIME
  var onlineUsers = [];
  try {
      if (currentUser && currentUser.name && currentUser.role !== 'Khách lạ') {
          var cache = CacheService.getScriptCache();
          var onlineData = JSON.parse(cache.get('APP_ONLINE_USERS') || "{}");
          var now = new Date().getTime();
          onlineData[currentUser.name] = now;
          for (var user in onlineData) {
              if (now - onlineData[user] > 20000) delete onlineData[user];
              else onlineUsers.push(user);
          }
          cache.put('APP_ONLINE_USERS', JSON.stringify(onlineData), 60);
      }
  } catch(e) { Logger.log("🚨 LỖI RADAR ONLINE: " + e.toString()); } 

  // 🚀 KÉO DỮ LIỆU CHI PHÍ MKT (CỘT O), LỊCH SỬ PDF (CỘT P) VÀ THỰC CHI MKT (CỘT Q) VÀO RAM
  var extraCostsData = {};
  var mktActualCostsData = {}; 
  var pdfExportData = {}; // 🚀 KHO CHỨA LỊCH SỬ PDF
  try {
      var pSheet = ss.getSheetByName("Dự án");
      if (pSheet) {
          var pData = pSheet.getRange(12, 3, pSheet.getLastRow() - 11 || 1, 15).getDisplayValues();
          for (var j = 0; j < pData.length; j++) {
              var pName = String(pData[j][0]).trim();
              var pCost = String(pData[j][12]).trim(); // Cột O (Index 12)
              var pPdf = String(pData[j][13] || "").trim(); // 🚀 Cột P (Index 13)
              var pActual = String(pData[j][14] || "").trim(); // Cột Q (Index 14)

              if (pName && pCost.startsWith("{")) {
                  try { extraCostsData[pName] = JSON.parse(pCost); } catch(err) {}
              }
              if (pName && pActual.startsWith("{")) {
                  try { mktActualCostsData[pName] = JSON.parse(pActual); } catch(err) {}
              }
              // 🚀 BÓC TÁCH PDF TRẢ VỀ FRONTEND ĐỂ LÀM KHIÊN KHÓA KẾ TOÁN
              if (pName && pPdf.startsWith("{")) {
                  try { 
                      let projectPdfObj = JSON.parse(pPdf); 
                      Object.keys(projectPdfObj).forEach(function(claimId) {
                          // Nếu là "null" thì bỏ qua, không đưa vào RAM khóa
                          if (claimId !== "null") pdfExportData[claimId] = projectPdfObj[claimId];
                      });
                  } catch(err) {}
              }
          }
      }
  } catch(e) { Logger.log("🚨 LỖI KÉO SHEET DỰ ÁN: " + e.toString()); }
  
  // 🚀 TRẠM PRE-FETCH: LẤY DỮ LIỆU THANH TOÁN LƯƠNG GỬI XUỐNG FRONTEND
  var sheetNs = ss.getSheetByName("Nhân sự");
  var nsData = sheetNs ? sheetNs.getDataRange().getDisplayValues() : [];
  var paidDataMap = {};
  for (var n = 11; n < nsData.length; n++) {
      var nsName = String(nsData[n][2]).trim().toLowerCase();
      var rawPaid = String(nsData[n][16] || "").trim(); // Cột Q
      if (rawPaid.startsWith("{")) {
          try { paidDataMap[nsName] = JSON.parse(rawPaid); } catch(e){}
      }
  }

  // 🚀 ĐÃ CẬP NHẬT TRẢ VỀ pdfExportData
  return { tasks: tasks, onlineUsers: onlineUsers, extraCostsData: extraCostsData, mktActualCostsData: mktActualCostsData, salaryPaidData: paidDataMap, pdfExportData: pdfExportData };
}
// ==========================================
// API: CẬP NHẬT TỪNG Ô (INLINE EDIT)
// ==========================================
// Hàm hỗ trợ: Chuyển đổi chỉ số cột (vd: 2) thành Tên Cột theo FIELD_MAP (vd: "Mã Task")
function getFieldNameByColIndex(colIndex) {
    // Thuật toán chuyển số cột thành chữ cái (VD: 2 -> B, 4 -> D)
    let temp, letter = '';
    let col = colIndex;
    while (col > 0) {
        temp = (col - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        col = (col - temp - 1) / 26;
    }

    // Dò tìm tên trường trong cấu hình FIELD_MAP
    for (let key in FIELD_MAP) {
        if (FIELD_MAP[key].col === letter) {
            return key;
        }
    }
    return null; // Không tìm thấy
}
// ==========================================
// API 3: CẬP NHẬT TỪNG Ô (INLINE EDIT & RULE ENGINE)
// ==========================================
function updateTaskCell(row, colIndex, value, currentUser) {
    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName("Công việc");

        // 1. ĐỌC DỮ LIỆU GỐC TỪ SHEET
        var taskRowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
        // =======================================================
        // 🚀 [TRẠM GÁC KẾ TOÁN] KHÓA CHẾT CỘT NGÀY THÁNG NẾU ĐÃ TT
        // =======================================================
        // Cột 14: Ngày hoàn thành thực tế | Cột 37: Ngày air task
        if (colIndex === 14 || colIndex === 37) { 
            if (isTaskFinanciallyLocked(ss, taskRowData)) {
                var taskId = taskRowData[1] ? taskRowData[1].toString() : ("Dòng " + row);
                var taskName = taskRowData[2] ? taskRowData[2].toString() : "";
                var taskInfo = taskId + " - " + taskName;
                
                // 🛑 GHI LOG VÀO SHEET LỊCH SỬ HOẠT ĐỘNG VỚI NOTE LÝ DO KHÔNG HỢP LỆ
                writeLog(userName, "⚠️ Toan tính sửa " + fieldName, taskInfo, taskRowData[colIndex - 1], "BỊ CHẶN: Thay đổi sang '" + value + "' không hợp lệ vì Task đã khóa Kế toán");
                
                return { success: false, message: "🚨 KHÔNG HỢP LỆ: Công việc [" + taskId + "] đã được chốt sổ quyết toán lương hoặc Claim dự án. Hệ thống từ chối đổi ngày và tự động phục hồi dữ liệu gốc!" };
            }
        }

        // 2. NHẬN DIỆN USER VÀ TRƯỜNG DỮ LIỆU ĐANG SỬA
        var role = currentUser ? currentUser.role : "Khách lạ";
        var userName = currentUser ? currentUser.name : "Khách lạ";
        var fieldName = getFieldNameByColIndex(colIndex);

        // =======================================================
        // [TRẠM GÁC 1] BỘ LUẬT TĨNH (ROLE_MATRIX CƠ BẢN)
        // =======================================================
        var matrix = ROLE_MATRIX[role];
        if (!matrix || role === 'Khách lạ' || matrix.readOnly) {
            return { success: false, message: "🚨 Bị chặn bởi Backend: Bạn không có quyền ghi dữ liệu!" };
        }

        if (matrix.fullAccess !== true) {
          // 🚀 ĐÃ FIX LỖI: Khai báo rõ ràng biến kiểm tra xem cột có nằm trong danh sách được phép sửa không
            var isFieldAllowed = (matrix.allowedFields && matrix.allowedFields.includes(fieldName));
            // 🚀 GIẤY THÔNG HÀNH NGOẠI LỆ đã nâng cấp: 

            // Freelancer & Admin chỉ được phép sửa cột Trạng thái NẾU VÀ CHỈ NẾU giá trị gửi lên chính xác là "Đã nhận"
            var allowedRolesToReceive = ["Freelancer", "Admin"];
            if (allowedRolesToReceive.includes(role) && fieldName === "Trạng thái task" && value.toUpperCase() === "ĐÃ NHẬN") {
                isFieldAllowed = true;
            }

            // Nếu không có quyền và cũng không có giấy thông hành -> Chặn đứng!
            if (!isFieldAllowed) {
                return { success: false, message: `🚨 Bị chặn: Vai trò [${role}] không được phép sửa tự do cột [${fieldName}].` };
            }

            // Đóng băng vĩnh viễn nếu task đã kết thúc
            var lockedStatuses = ["Hoàn thành", "Tạm hoãn", "Hủy"];
            var currentStatus = (taskRowData[letterToColIndex(FIELD_MAP["Trạng thái task"].col) - 1] || "").toString().trim();
            
            if (matrix.checkStatus && lockedStatuses.includes(currentStatus)) {
                return { success: false, message: `🚨 Bị chặn: Task đang ở trạng thái [${currentStatus}], không thể chỉnh sửa.` };
            }

            if (matrix.requireOwnership) {
                var currentAssignee = (taskRowData[letterToColIndex(FIELD_MAP["Người làm task"].col) - 1] || "").toString().trim();
                // 🚀 ĐÃ SỬA: Ép cả 2 về chữ thường để so sánh, triệt tiêu hoàn toàn lỗi gõ phím TEST/test
                if (currentAssignee.toLowerCase() !== userName.toLowerCase()) {
                    return { success: false, message: "🚨 Bị chặn: Bạn chỉ được phép sửa dữ liệu task do chính mình phụ trách." };
                }
            }
        }

        // =======================================================
        // [TRẠM GÁC 2] CỖ MÁY LUẬT ĐỘNG - KIỂM TRA KHÓA (LOCKS)
        // =======================================================
        for (let rule of TASK_AUTOMATION_RULES) {
            if (!rule.locks) continue;
            
            let isStateMatch = false;
            let conditionFieldCol = letterToColIndex(FIELD_MAP[rule.stateCondition.field].col);
            let stateFieldValue = (taskRowData[conditionFieldCol - 1] || "").toString().trim();

            // So sánh toán tử
            if (rule.stateCondition.operator === "==" && stateFieldValue === rule.stateCondition.value) {
                isStateMatch = true;
            } 
            else if (rule.stateCondition.operator === "NOT_EMPTY" && stateFieldValue !== "" && stateFieldValue !== "-") {
                isStateMatch = true;
                // Kiểm tra điều kiện phụ nếu có
                if (rule.stateCondition.requireAlso) {
                    let reqCol = letterToColIndex(FIELD_MAP[rule.stateCondition.requireAlso.field].col);
                    let reqVal = (taskRowData[reqCol - 1] || "").toString().trim();
                    if (reqVal !== rule.stateCondition.requireAlso.value) isStateMatch = false;
                }
            }

            // Nếu trạng thái của dòng hiện tại khớp với Luật -> Check xem có cấm user này sửa cột này không
            if (isStateMatch) {
                for (let lock of rule.locks) {
                    if (lock.roles.includes(role) && lock.fields.includes(fieldName)) {
                        return { success: false, message: `🚨 Bị chặn tự động: ${rule.ruleName}` };
                    }
                }
            }
        }

        // =======================================================
        // 3. VƯỢT QUA MỌI TRẠM GÁC -> GHI DỮ LIỆU
        // =======================================================
        var oldValue = taskRowData[colIndex - 1] ? taskRowData[colIndex - 1].toString().trim() : "";
        sheet.getRange(row, colIndex).setValue(value);
        let autoFilledData = null; // Biến báo cáo lại cho Frontend

        // =======================================================
        // [TRẠM GÁC 3] CỖ MÁY LUẬT ĐỘNG - KÍCH HOẠT TỰ ĐIỀN (AUTO-FILL)
        // =======================================================
        for (let rule of TASK_AUTOMATION_RULES) {
            if (!rule.autoFill || rule.autoFill.onEditField !== fieldName) continue;
            let triggerMatch = false;
            
            // Điều kiện 1: Khớp chính xác chữ
            if (rule.autoFill.onEditValue && value.toLowerCase() === rule.autoFill.onEditValue.toLowerCase()) {
                triggerMatch = true;
            }
            // Điều kiện 2: Từ trống thành có chữ
            else if (rule.autoFill.operator === "CHANGED_FROM_EMPTY" && (oldValue === "" || oldValue === "-") && value !== "") {
                triggerMatch = true;
            }
            // 🚀 ĐIỀU KIỆN 3 (MỚI): Bắt chuẩn Link http
            else if (rule.autoFill.operator === "VALID_LINK" && (value.startsWith("http://") || value.startsWith("https://"))) {
                triggerMatch = true;
            }

            // 🚀 RÀO CẢN MỚI: Chỉ kích hoạt nếu trạng thái hiện tại đúng như yêu cầu
            if (triggerMatch && rule.autoFill.requireCurrentState) {
                let reqCol = letterToColIndex(FIELD_MAP[rule.autoFill.requireCurrentState.field].col);
                let currentVal = (taskRowData[reqCol - 1] || "").toString().trim().toLowerCase();
                let allowedVals = rule.autoFill.requireCurrentState.values.map(v => v.toLowerCase());
                if (!allowedVals.includes(currentVal)) {
                    triggerMatch = false; // Bị hủy vì trạng thái hiện tại không cho phép
                }
            }

            // 🚀 RÀO CẢN MỚI 2: Chỉ kích hoạt nếu trường yêu cầu không bị trống (Ví dụ: Đã có Người làm task)
            if (triggerMatch && rule.autoFill.requireNotEmpty) {
                let reqColNotEmpty = letterToColIndex(FIELD_MAP[rule.autoFill.requireNotEmpty].col);
                let checkVal = (taskRowData[reqColNotEmpty - 1] || "").toString().trim().toLowerCase();
                
                // Trống, dấu trừ, hoặc chữ "chưa giao" đều tính là vô chủ
                if (checkVal === "" || checkVal === "-" || checkVal === "chưa giao") {
                    triggerMatch = false; 
                }
            }

            // Check xem Role này có được kích hoạt lệnh tự điền không
            if (triggerMatch && rule.autoFill.triggerRoles && !rule.autoFill.triggerRoles.includes(role)) {
                triggerMatch = false;
            }

            // Đạt chuẩn kích hoạt -> Tự động ghi Sheet
            if (triggerMatch && rule.autoFill.actions) {
                for (let action of rule.autoFill.actions) {
                    let targetCol = letterToColIndex(FIELD_MAP[action.targetField].col);
                    let finalValue = action.value;
                    
                    if (action.value === "TODAY") {
                        finalValue = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy");
                    }
                    
                    sheet.getRange(row, targetCol).setValue(finalValue);
                    autoFilledData = { field: action.targetField, value: finalValue };
                }
            }
            // =======================================================
            // 🚀 LUẬT ĐẶC BIỆT (CHIỀU NGHỊCH): GIAO VIỆC CHO TASK ĐÃ CÓ SẴN LINK NỘP
            // =======================================================
            if (fieldName === "Người làm task" && (oldValue === "" || oldValue === "-" || oldValue.toLowerCase() === "chưa giao") && value !== "") {
                let linkCol = letterToColIndex(FIELD_MAP["Link nộp"].col);
                let currentLink = (taskRowData[linkCol - 1] || "").toString().trim();
                
                // Nếu phát hiện task vô chủ này đã có sẵn link hợp lệ từ trước
                if (currentLink.startsWith("http://") || currentLink.startsWith("https://")) {
                    let statusCol = letterToColIndex(FIELD_MAP["Trạng thái task"].col);
                    let currentStatus = (taskRowData[statusCol - 1] || "").toString().trim().toLowerCase();
                    let allowedStates = ["chưa nhận", "chưa bắt đầu", "đã nhận", "đang làm"];
                    
                    // Ép trạng thái về CẦN SỬA ngay lập tức
                    if (allowedStates.includes(currentStatus)) {
                        sheet.getRange(row, statusCol).setValue("CẦN SỬA");
                        
                        if (!autoFilledData) {
                            autoFilledData = { field: "Trạng thái task", value: "CẦN SỬA" };
                        }
                    }
                }
            }
        }

        // --- BẮT ĐẦU GHI LOG LỊCH SỬ ---
        var taskId = taskRowData[1] ? taskRowData[1].toString() : ("Dòng " + row);
        var taskName = taskRowData[2] ? taskRowData[2].toString() : "";
        var taskInfo = taskId + " - " + taskName;
        writeLog(userName, "Cập nhật " + fieldName, taskInfo, oldValue, value);
        if (autoFilledData) {
            writeLog("🤖 Hệ Thống", "Tự động điền " + autoFilledData.field, taskInfo, "(Trống)", autoFilledData.value);
        }
        // --- KẾT THÚC GHI LOG ---

        return { success: true, newValue: value, autoFilledData: autoFilledData };

    } catch (e) {
        return { success: false, message: "Lỗi Server: " + e.toString() };
    }
}
// ==========================================
// API 4: THÊM TASK MỚI TỐI ƯU TỐC ĐỘ
// ==========================================
function createNewTask(taskData, currentUser) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Công việc");
   
    var today = new Date();
    var dd = ("0" + today.getDate()).slice(-2);
    var mm = ("0" + (today.getMonth() + 1)).slice(-2);
    var yy = today.getFullYear().toString().slice(-2);
    var dateSuffix = dd + mm + yy;
   
    // Tối ưu tốc độ: Chỉ quét dải dữ liệu thực tế thay vì quét toàn bộ cột B trống
    var lastRow = sheet.getLastRow();
    var startRow = 12;
    var numRows = Math.max(1, lastRow - startRow + 1);
    var values = sheet.getRange(startRow, 2, numRows, 2).getValues(); // Đọc cột B và C
   
    var targetRow = lastRow + 1;
    var maxSeq = 0;    
   
    for (var i = 0; i < values.length; i++) {
      var idVal = values[i][0] ? values[i][0].toString().trim() : "";
      var nameVal = values[i][1] ? values[i][1].toString().trim() : "";
     
      // Tìm dòng trống đầu tiên dựa vào việc cả Mã và Chủ đề đều trống
      if (idVal === "" && nameVal === "" && (i + startRow) < targetRow) {
        targetRow = i + startRow;
      }
     
      if (idVal.length >= 9 && idVal.endsWith(dateSuffix)) {
         var seq = parseInt(idVal.substring(0, idVal.length - 6), 10);
         if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
      }
    }
   
    // Tạo ID 3 chữ số chuẩn xác xyzddmmyy
    var nextSeq = maxSeq + 1;
    var xyz = String(nextSeq).padStart(3, '0');
    var newId = xyz + dateSuffix;
   
  // 🚀 ĐÃ NÂNG CẤP: Dùng ánh xạ động từ FIELD_MAP thay vì fix cứng số
    sheet.getRange(targetRow, letterToColIndex(FIELD_MAP["Mã Task"].col)).setValue(newId);
    sheet.getRange(targetRow, letterToColIndex(FIELD_MAP["Chủ đề task"].col)).setValue(taskData.name || "");
    sheet.getRange(targetRow, letterToColIndex(FIELD_MAP["Nội dung task"].col)).setValue(taskData.noidung || "");
    sheet.getRange(targetRow, letterToColIndex(FIELD_MAP["Dự án"].col)).setValue(taskData.project || "");
    sheet.getRange(targetRow, letterToColIndex(FIELD_MAP["Người làm task"].col)).setValue(taskData.assignee || "");
    sheet.getRange(targetRow, letterToColIndex(FIELD_MAP["Ngày bắt đầu"].col)).setValue(taskData.start || "");
    // 🚀 TỰ ĐỘNG PHÂN LOẠI TRẠNG THÁI NGAY TỪ LÚC MỚI ĐẺ RA
    var initialStatus = "CHƯA NHẬN";
    if (taskData.assignee && taskData.assignee !== "" && taskData.link && (taskData.link.startsWith("http://") || taskData.link.startsWith("https://"))) {
        initialStatus = "CẦN SỬA"; // Vừa ra đời đã có chủ và có link thì vào thẳng Cần sửa
    }
    sheet.getRange(targetRow, letterToColIndex(FIELD_MAP["Trạng thái task"].col)).setValue(initialStatus);
    sheet.getRange(targetRow, letterToColIndex(FIELD_MAP["Mức ưu tiên"].col)).setValue(taskData.priority || "");
    sheet.getRange(targetRow, letterToColIndex(FIELD_MAP["Loại Content"].col)).setValue(taskData.type || "");
    sheet.getRange(targetRow, letterToColIndex(FIELD_MAP["Link nộp"].col)).setValue(taskData.link || "");
    sheet.getRange(targetRow, letterToColIndex(FIELD_MAP["Đơn giá"].col)).setValue(taskData.dongia || "");

    // 🤖 TỰ ĐỘNG TÍNH THÀNH TIỀN DỰ ÁN VÀ LƯU NGẦM (CỘT AO)
    let autoProjCharge = calculateProjectCharge(taskData.project, taskData.type);
    sheet.getRange(targetRow, letterToColIndex(FIELD_MAP["Thành tiền"].col)).setValue(autoProjCharge);

    // --- BẮT ĐẦU GHI LOG LỊCH SỬ ---
    var userName = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.name : "Hệ thống";
    var taskInfo = newId + " - " + (taskData.name || "");
    writeLog(userName, "Tạo Task Mới", taskInfo, "(Trống)", "Đã tạo task thành công");
    // --- KẾT THÚC GHI LOG ---

    return { status: "success" };
  } catch (e) {
    return { status: "error", message: e.toString() };
  }
}
// ==========================================
// API 5: XÁC THỰC ĐĂNG NHẬP (TỰ ĐỘNG KHỚP CỘT ĐỘNG 100%)
// ==========================================
function verifyUserLogin(phone, password) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetNS = ss.getSheetByName("Nhân sự");
    if (!sheetNS) return { success: false, message: "Hệ thống lỗi: Không tìm thấy sheet Nhân sự!" };
   
    var data = sheetNS.getDataRange().getDisplayValues();
   
    // 🚀 BỘ PHIÊN DỊCH CHỈ SỐ MẢNG: Tự động tính toán dựa theo USER_FIELD_MAP cấu hình ở đầu file
    var idxPhone  = letterToColIndex(USER_FIELD_MAP["SĐT Zalo"].col) - 1;
    var idxPass   = letterToColIndex(USER_FIELD_MAP["Mật khẩu"].col) - 1;
    var idxName   = letterToColIndex(USER_FIELD_MAP["Tên"].col) - 1;
    var idxRole   = letterToColIndex(USER_FIELD_MAP["Vị trí"].col) - 1;
    var idxAvatar = letterToColIndex(USER_FIELD_MAP["Ảnh Avatar"].col) - 1;
    var idxColor  = letterToColIndex(USER_FIELD_MAP["Màu sắc yêu thích"].col) - 1;
   
    // Quét dữ liệu từ dòng 12 (Index trong mảng là 11)
    for (var i = 11; i < data.length; i++) {
      var row = data[i];
      
      var rowPhone = row[idxPhone] ? row[idxPhone].toString().trim() : "";   
      var rowPass  = row[idxPass] ? row[idxPass].toString().trim() : "";  
     
      // Khớp Số điện thoại và Mật khẩu
      if (rowPhone !== "" && rowPhone === phone.trim() && rowPass === password.trim()) {
        var rowRole = row[idxRole] ? row[idxRole].toString().trim() : "Freelancer"; 
        var name    = row[idxName] || "Nhân sự"; 
        var avatar  = row[idxAvatar] ? row[idxAvatar].toString().trim() : "";
        var color   = row[idxColor] ? row[idxColor].toString().trim() : "";
       
        return {
          success: true,
          user: {
            name: name,
            role: rowRole,
            phone: rowPhone,
            accessPages: "", // Xử lý động qua bộ luật động ROLE_MATRIX ở Frontend
            avatar: avatar,  // 🤖 Đã bốc tách tự động chuẩn xác không lo bỏ sót
            color: color     // 🤖 Đã bốc tách tự động chuẩn xác không lo bỏ sót
          }
        };
      }
    }
    return { success: false, message: "Sai Số điện thoại Zalo hoặc Mật khẩu!" };
  } catch (e) {
    return { success: false, message: "Lỗi Server: " + e.toString() };
  }
}
 
// ==========================================
// API 6: LẤY MA TRẬN QUYỀN EDIT (Từ sheet "Tài khoản")
// ==========================================
// [THAY THẾ HOẶC CẬP NHẬT TRONG FILE Code.gs]
function getEditPermissionsMatrix() {
  let colWidths = {};
  try {
        // Đọc bộ nhớ ngầm của Google Script xem Quản lý đã lưu số đo nào chưa
        let savedWidths = PropertiesService.getScriptProperties().getProperty('GLOBAL_COL_WIDTHS');
        if (savedWidths) colWidths = JSON.parse(savedWidths);
    } catch (e) {}
    // Trả thẳng Object đã khai báo ở đầu file về cho Frontend
    // Không cần quét Google Sheet nữa -> Tiết kiệm 2-3s tải trang
  return {
        permissions: ROLE_MATRIX,
        fieldMap: FIELD_MAP,
        colWidths: colWidths, // 🚀 Bổ sung gửi số đo cột xuống UI
        automationRules: TASK_AUTOMATION_RULES // 🚀 GỬI CỖ MÁY LUẬT XUỐNG FRONTEND
    };
}
// ==========================================
// API 7: QUẢN LÝ LƯU SỐ ĐO ĐỘ RỘNG CỘT
// ==========================================
function saveGlobalColumnWidths(widthsConfig) {
    try {
        PropertiesService.getScriptProperties().setProperty('GLOBAL_COL_WIDTHS', JSON.stringify(widthsConfig));
        return { success: true };
    } catch (e) {
        return { success: false, message: e.toString() };
    }
}
// HÀM TỰ ĐỘNG LẤY OPTIONS DROPDOWN TỪ CÁC SHEET DANH MỤC (Dòng 12 trở xuống)
function getDropdownOptionsData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var options = {
    "Dự án": [],
    "Loại công việc": [],
    "Người thực hiện": [],
    "Trạng thái công việc": []
  };

  // 1. Quét Dự án -> Sheet "Dự án", Cột C (Index trong mảng là 2)
  var shProject = ss.getSheetByName("Dự án");
  if (shProject) {
    var data = shProject.getDataRange().getValues();
    for (var i = 11; i < data.length; i++) {
      var val = String(data[i][2]).trim(); // Cột C
      if (val && val !== "" && options["Dự án"].indexOf(val) === -1) {
        options["Dự án"].push(val);
      }
    }
  }

  // 2. Quét Loại công việc & Trạng thái -> Sheet "Danh mục"
  var shCatalog = ss.getSheetByName("Danh mục");
  if (shCatalog) {
    var data = shCatalog.getDataRange().getValues();
    for (var i = 11; i < data.length; i++) {
      // Loại công việc: Cột F (Index là 5)
      var valType = String(data[i][5]).trim();
      if (valType && valType !== "" && options["Loại công việc"].indexOf(valType) === -1) {
        options["Loại công việc"].push(valType);
      }
      // Trạng thái công việc: Cột B (Index là 1)
      var valStatus = String(data[i][1]).trim();
      if (valStatus && valStatus !== "" && options["Trạng thái công việc"].indexOf(valStatus) === -1) {
        options["Trạng thái công việc"].push(valStatus);
      }
    }
  }

  // 3. Quét Người thực hiện -> Sheet "Nhân sự", Cột C (Index là 2)
  var shPeople = ss.getSheetByName("Nhân sự");
  if (shPeople) {
    var data = shPeople.getDataRange().getValues();
    for (var i = 11; i < data.length; i++) {
      var valAssignee = String(data[i][2]).trim(); // Cột C
      if (valAssignee && valAssignee !== "" && options["Người thực hiện"].indexOf(valAssignee) === -1) {
        options["Người thực hiện"].push(valAssignee);
      }
    }
  }

  return options;
} 
function capQuyenDrive() {
    DriveApp.getFiles();
}
function capQuyenGhiDrive() {
    // Lệnh này ép Google phải hỏi xin bạn quyền Tạo file
    DriveApp.createFile("Test_App_Doc.txt", "Đây là file test để xin quyền");
}
// ==========================================
// API 8: LƯU GÓI DỮ LIỆU AIR TASK (LƯỚI 4x3)
// ==========================================
function saveAirTaskData(payload, currentUser) {
    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName("Công việc");
        var row = payload.row;
        
        // Trạm gác siêu tốc: Chỉ Admin và Quản lý mới được ghi
        var role = currentUser ? currentUser.role : "Khách lạ";
        if (role !== "Admin" && role !== "Quản lý") {
            return { success: false, message: "🚨 Bị chặn: Bạn không có quyền ghi dữ liệu Air Task!" };
        }
        // =======================================================
        // 🚀 [TRẠM GÁC KẾ TOÁN] KHÓA CHẾT GIAO DIỆN LƯỚI AIR TASK
        // =======================================================
        var taskRowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
        // Quét: Nếu giao diện lưới có chỉnh sửa Ngày Air Task (payload.airdate) -> Check khóa!
        if (payload.airdate !== taskRowData[36]) { // 36 là Index cột AK
            if (isTaskFinanciallyLocked(ss, taskRowData)) {
                var taskId = taskRowData[1] ? taskRowData[1].toString() : ("Dòng " + row);
                var taskName = taskRowData[2] ? taskRowData[2].toString() : "";
                
                // 🛑 GHI LOG VÀO SHEET LỊCH SỬ HOẠT ĐỘNG VỚI NOTE LÝ DO KHÔNG HỢP LỆ
                writeLog(currentUser.name, "⚠️ Toan tính sửa Ngày Air", taskId + " - " + taskName, taskRowData[36], "BỊ CHẶN: Thay đổi sang '" + payload.airdate + "' không hợp lệ vì Task đã khóa Kế toán");
                
                return { success: false, message: "🚨 KHÔNG HỢP LỆ: Công việc [" + taskId + "] đã được chốt sổ quyết toán lương hoặc Claim dự án. Hệ thống từ chối đổi Ngày Air và tự động phục hồi dữ liệu gốc!" };
            }
        }

        // Tự động dò chỉ số cột từ FIELD_MAP
        var colAH = letterToColIndex(FIELD_MAP["Trạng thái air"].col);
        var colAK = letterToColIndex(FIELD_MAP["Ngày air task"].col);
        var colAL = letterToColIndex(FIELD_MAP["Loại dịch vụ"].col);
        var colAM = letterToColIndex(FIELD_MAP["Loại content chuyển đổi"].col);
        var colAN = letterToColIndex(FIELD_MAP["Ghi chú Admin"].col);
        
        // Ghi dữ liệu hàng loạt
        sheet.getRange(row, colAH).setValue(payload.airstat);
        sheet.getRange(row, colAK).setValue(payload.airdate);
        sheet.getRange(row, colAL).setValue(payload.servicetype);
        sheet.getRange(row, colAM).setValue(payload.conversetype);
        sheet.getRange(row, colAN).setValue(payload.adminnote);
        
        // 🚀 LUẬT ĐỘNG: TỰ ĐỔI SANG "CẦN SỬA" NẾU NGÀY AIR = HÔM NAY
        let todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy");
        if (payload.airdate === todayStr) {
            let taskRowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
            let statusCol = letterToColIndex(FIELD_MAP["Trạng thái task"].col);
            let assigneeCol = letterToColIndex(FIELD_MAP["Người làm task"].col); // Lấy vị trí cột Người làm task
            let currentStatus = (taskRowData[statusCol - 1] || "").toString().trim().toLowerCase();
            let currentAssignee = (taskRowData[assigneeCol - 1] || "").toString().trim().toLowerCase();
            let allowedStates = ["chưa nhận", "chưa bắt đầu", "đã nhận", "đang làm"];
            let isAssigned = (currentAssignee !== "" && currentAssignee !== "-" && currentAssignee !== "chưa giao");
            // Nếu task đang ở trạng thái sơ khai, ép nó chuyển sang Cần sửa
            if (allowedStates.includes(currentStatus) && isAssigned) {
                sheet.getRange(row, statusCol).setValue("CẦN SỬA");
                writeLog("🤖 Hệ Thống", "Tự động đổi Trạng thái task", "Dòng " + row, currentStatus, "CẦN SỬA");
            }
        }

        writeLog(currentUser.name, "Cập nhật lưới Air Task", "Dòng " + row, "(Nhiều trường)", "Đã chốt lưới Air Task");
        return { success: true };
    } catch (e) {
        return { success: false, message: "Lỗi Server: " + e.toString() };
    }
}

// ==========================================
// API 9: THÊM TIN NHẮN / FILE VÀO ĐÚNG CỘT (NHẬN XÉT HOẶC LINK NỘP)
// ==========================================
function addChatMessage(payload, currentUser) {
    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName("Công việc");
        
        // 🚀 NÂNG CẤP ĐỊNH VỊ: Lấy tên Cột từ Frontend, nếu không có mặc định là Nhận xét
        var fieldName = payload.fieldName || "Nhận xét & sửa task";
        var targetCol = letterToColIndex(FIELD_MAP[fieldName].col);
        var row = payload.row;
        
        // 1. ĐỌC DỮ LIỆU GỐC TỪ SHEET ĐỂ SOÁT LUẬT
        var taskRowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
        var role = currentUser ? currentUser.role : "Khách lạ";
        var userName = currentUser ? currentUser.name : "Khách lạ";

        // =======================================================
        // 🚀 [TRẠM GÁC 1] BỘ LUẬT TĨNH (ROLE_MATRIX)
        // =======================================================
        var matrix = ROLE_MATRIX[role];
        if (!matrix || role === 'Khách lạ' || matrix.readOnly) {
            return { success: false, message: "🚨 Bị chặn: Bạn không có quyền thao tác!" };
        }

        if (matrix.fullAccess !== true) {
            // Kiểm tra cột
            if (matrix.allowedFields && !matrix.allowedFields.includes(fieldName)) {
                return { success: false, message: `🚨 Bị chặn: Vai trò [${role}] không được phép thao tác cột [${fieldName}].` };
            }
            // Kiểm tra đóng băng (Task Hoàn thành/Hủy)
            var currentStatus = (taskRowData[letterToColIndex(FIELD_MAP["Trạng thái task"].col) - 1] || "").toString().trim();
            var lockedStatuses = getLockedStatuses ? getLockedStatuses() : ["Hoàn thành", "Tạm hoãn", "Hủy"];
            if (matrix.checkStatus && lockedStatuses.includes(currentStatus)) {
                return { success: false, message: `🚨 Bị chặn: Task đang ở trạng thái [${currentStatus}].` };
            }
            // Kiểm tra chính chủ
            if (matrix.requireOwnership) {
                var currentAssignee = (taskRowData[letterToColIndex(FIELD_MAP["Người làm task"].col) - 1] || "").toString().trim();
                if (currentAssignee.toLowerCase() !== userName.toLowerCase()) {
                    return { success: false, message: "🚨 Bị chặn: Bạn chỉ được thao tác trong task do chính mình phụ trách." };
                }
            }
        }

        // =======================================================
        // 🚀 [TRẠM GÁC 2] CỖ MÁY LUẬT ĐỘNG - KIỂM TRA KHÓA
        // =======================================================
        for (let rule of TASK_AUTOMATION_RULES) {
            if (!rule.locks) continue;
            let isStateMatch = false;
            let conditionFieldCol = letterToColIndex(FIELD_MAP[rule.stateCondition.field].col);
            let stateFieldValue = (taskRowData[conditionFieldCol - 1] || "").toString().trim();

            if (rule.stateCondition.operator === "==" && stateFieldValue === rule.stateCondition.value) {
                isStateMatch = true;
            } else if (rule.stateCondition.operator === "NOT_EMPTY" && stateFieldValue !== "" && stateFieldValue !== "-") {
                isStateMatch = true;
                if (rule.stateCondition.requireAlso) {
                    let reqCol = letterToColIndex(FIELD_MAP[rule.stateCondition.requireAlso.field].col);
                    let reqVal = (taskRowData[reqCol - 1] || "").toString().trim();
                    if (reqVal !== rule.stateCondition.requireAlso.value) isStateMatch = false;
                }
            }

            if (isStateMatch) {
                for (let lock of rule.locks) {
                    if (lock.roles.includes(role) && lock.fields.includes(fieldName)) {
                        return { success: false, message: `🚨 Khóa tự động: ${rule.ruleName}` };
                    }
                }
            }
        }

        // =======================================================
        // VƯỢT QUA MỌI TRẠM GÁC -> GHI TIN NHẮN / FILE
        // =======================================================
        var currentData = taskRowData[targetCol - 1] ? taskRowData[targetCol - 1].toString().trim() : "";
        var chatHistory = [];
        
        if (currentData !== "") {
            try {
                chatHistory = JSON.parse(currentData);
                if (!Array.isArray(chatHistory)) throw new Error();
                
                // 🚀 CƠ CHẾ TỰ CHỮA LÀNH (SELF-HEALING)
                chatHistory = chatHistory.map(function(msg) {
                    if (msg.hasOwnProperty('avatar')) {
                        delete msg.avatar;
                    }
                    return msg;
                });
                
            } catch (e) {
                // Xử lý Lịch sử cũ (Plain text) của cột Link Nộp: Chuyển nó thành 1 cục tin nhắn duy nhất
                chatHistory = [{ sender: "Hệ thống", role: "Admin", time: "Lịch sử cũ", text: currentData }];
            }
        }
        
        // Rào chắn bảo vệ bổ sung
        if (payload.newMessage.hasOwnProperty('avatar')) {
            delete payload.newMessage.avatar;
        }
// =====================================================================
        // 🚀 ĐỘNG CƠ THẨM ĐỊNH & NHÂN BẢN FILE TỰ ĐỘNG (DÀNH RIÊNG CHO LINK NỘP)
        // =====================================================================
        if (fieldName === 'Link nộp') {
            let submittedText = payload.newMessage.text || "";
            let urlMatch = submittedText.match(/(https?:\/\/[^\s]+)/);
            let submittedUrl = urlMatch ? urlMatch[0] : "";
            
            // Lấy Loại Content ở cột V (Index 22, truy xuất mảng là 21)
            let contentTypeCol = letterToColIndex(FIELD_MAP["Loại Content"].col);
            let contentType = String(taskRowData[contentTypeCol - 1] || "").trim().toLowerCase();
            let isVideoRequired = (contentType === "clip content" || contentType === "clip reel");
            
            let isCloned = false;
            let clonedUrl = "";
            let warningMsg = "";

            if (submittedUrl) {
                // 📂 KỊCH BẢN 1 & 2: Link Google Drive hoặc Google Docs
                if (submittedUrl.includes("drive.google.com") || submittedUrl.includes("docs.google.com")) {
                    let idMatch = submittedUrl.match(/[-\w]{25,}/); // Dùng Regex bóc tách File ID
                    if (idMatch) {
                        try {
                            let file = DriveApp.getFileById(idMatch[0]);
                            let mimeType = file.getMimeType();
                            
                            // Nhân bản vào Thư mục Master của Công ty (ID Thư mục chuẩn)
                            let folder = DriveApp.getFolderById("18RAw9TTU6E1mvbC16FDiUr_ARZ95pMRN");
                            let copy = file.makeCopy("[LƯU TRỮ] " + file.getName(), folder);
                            copy.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
                            clonedUrl = copy.getUrl();
                            isCloned = true;

                            // Thẩm định: Nếu clone thành công nhưng sai định dạng Video
                            if (isVideoRequired && !mimeType.includes("video")) {
                                warningMsg = "Bạn đã nộp file nhưng không phải định dạng Video. Yêu cầu bổ sung đúng định dạng (.mp4).";
                            }
                        } catch(e) {
                            // Lỗi: Bị khóa quyền View hoặc file không tồn tại
                            warningMsg = "Link Google Drive chưa được mở quyền truy cập (Share public). Vui lòng mở quyền 'Bất kỳ ai có liên kết đều có thể xem' và nộp lại link.";
                        }
                    }
                }
                // ⬇️ KỊCH BẢN 3 & 4: Link tải trực tiếp (Chứa đuôi file)
                else if (submittedUrl.match(/\.(mp4|mov|avi|pdf|docx?|xlsx?|zip|rar|png|jpe?g)($|\?)/i)) {
                    try {
                        let response = UrlFetchApp.fetch(submittedUrl, {muteHttpExceptions: true});
                        if (response.getResponseCode() === 200) {
                            let blob = response.getBlob();
                            let folder = DriveApp.getFolderById("18RAw9TTU6E1mvbC16FDiUr_ARZ95pMRN");
                            let newFile = folder.createFile(blob);
                            newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
                            clonedUrl = newFile.getUrl();
                            isCloned = true;
                            
                            if (isVideoRequired && !submittedUrl.match(/\.(mp4|mov|avi)($|\?)/i)) {
                                warningMsg = "Bạn đã nộp file nhưng không phải định dạng Video. Yêu cầu bổ sung đúng định dạng (.mp4).";
                            }
                        } else {
                            if (isVideoRequired) warningMsg = "Bạn đã nộp link không hỗ trợ tải tự động. Yêu cầu bổ sung link Google Drive mở quyền public.";
                        }
                    } catch(e) {
                        // File quá nặng (>50MB) làm sập hệ thống tải của Google
                        warningMsg = "Dung lượng file từ link trực tiếp quá lớn (vượt giới hạn tải tự động 50MB). Vui lòng tự tải file lên Google Drive cá nhân, mở quyền truy cập công khai và nộp lại bằng link Google Drive.";
                    }
                }
                // 🌐 KỊCH BẢN 5: Link gián tiếp (Mediafire, Youtube, TikTok...)
                else {
                    if (isVideoRequired) {
                        warningMsg = `Bạn đã nộp link không hỗ trợ lưu trữ tự động vào Drive. Với Loại content là [${contentType}], yêu cầu nộp đúng định dạng video (.mp4) qua tính năng Upload hoặc bổ sung link Google Drive.`;
                    }
                }
            } 
            // 📎 TRƯỜNG HỢP GỬI FILE UPLOAD ĐÍNH KÈM TỪ APP:
            else if (payload.newMessage.attachment) {
                let attachmentName = payload.newMessage.attachment.name || "";
                if (isVideoRequired && !attachmentName.match(/\.(mp4|mov|avi)$/i) && !payload.newMessage.attachment.isImage) {
                    warningMsg = `Bạn đã nộp thiếu file hợp lệ cho [${contentType}]. Yêu cầu nộp đúng định dạng video (.mp4).`;
                }
            }

            // ✅ NẾU CLONE THÀNH CÔNG: Ghi đè Link bản sao vào tin nhắn nộp bài của User
            if (isCloned && clonedUrl) {
                payload.newMessage.text = payload.newMessage.text.replace(submittedUrl, clonedUrl) + "\n\n(✅ Hệ thống đã tự động sao chép lưu trữ bảo mật)";
            }

            // 🚨 NẾU CÓ CẢNH BÁO LỖI: Tiêm cảnh báo đỏ vào ô Nhận xét & Sửa task
            if (warningMsg !== "") {
                // 🚀 GẮN CỜ BÁO LỖI CHO DỮ LIỆU CỘT LINK NỘP ĐỂ FRONTEND HIỂN THỊ ⚠️
                payload.newMessage.hasWarning = true;
                
                let todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy");
                let fullWarnText = `⚠️ Ngày ${todayStr}: ${warningMsg}`;
                
                let chatColIndex = letterToColIndex(FIELD_MAP["Nhận xét & sửa task"].col);
                let currentChatStr = String(taskRowData[chatColIndex - 1] || "").trim();
                let chatHistoryArr = [];
                
                if (currentChatStr !== "") {
                    try { chatHistoryArr = JSON.parse(currentChatStr); } 
                    catch(e) { chatHistoryArr = [{ sender: "Hệ thống", role: "Admin", time: "Lịch sử cũ", text: currentChatStr }]; }
                }
                
                chatHistoryArr.push({
                    id: "sys_warn_" + Date.now(),
                    sender: "Hệ thống", role: "Admin",
                    time: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm"),
                    text: fullWarnText,
                    isSysMsg: true
                });
                
                // Ghi đè thẳng khung Chat
                sheet.getRange(row, chatColIndex).setValue(JSON.stringify(chatHistoryArr));
                writeLog("🤖 Hệ Thống", "Cảnh báo File nộp", "Dòng " + row, "", "Thiếu file MP4 hoặc lỗi quyền/dung lượng");
            }
        }
        // =====================================================================

        // Vẫn cho phép Nộp Link bất chấp đúng sai
        chatHistory.push(payload.newMessage);
        var newJson = JSON.stringify(chatHistory);
        
        // Ghi xuống đúng tọa độ Cột đang thao tác (Link Nộp hoặc Nhận xét)
        sheet.getRange(row, targetCol).setValue(newJson);
        writeLog(userName, "Cập nhật " + fieldName, "Dòng " + row, "(JSON)", "Thêm 1 mốc lịch sử mới");

        // 🚀 ĐỘNG CƠ LUẬT CHIỀU NGHỊCH: TỰ CHUYỂN TRẠNG THÁI TASK KHI NỘP LINK
        if (fieldName === 'Link nộp') {
            let statusCol = letterToColIndex(FIELD_MAP["Trạng thái task"].col);
            let currentStatus = (taskRowData[statusCol - 1] || "").toString().trim().toLowerCase();
            let allowedStates = ["chưa nhận", "chưa bắt đầu", "đã nhận", "đang làm"];
            if (allowedStates.includes(currentStatus)) {
                sheet.getRange(row, statusCol).setValue("CẦN SỬA");
                writeLog("🤖 Hệ Thống", "Tự động đổi Trạng thái task", "Dòng " + row, currentStatus, "CẦN SỬA");
            }
        }

        return { success: true, newJson: newJson };
    } catch (e) {
        return { success: false, message: "Lỗi Server: " + e.toString() };
    }
}
// // =========================================================================
// 💰 API 1: LẤY RAW DATA THU NHẬP, LỊCH SỬ LƯƠNG & AVATAR (NÂNG CẤP MANAGER VIEW)
// =========================================================================
function getFreelancerIncomeData(currentUser) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetTask = ss.getSheetByName("Công việc");
    var sheetNs = ss.getSheetByName("Nhân sự");
    // 🚀 Sửa consentDatas thành consentData
    if (!sheetTask || !sheetNs) return { tasks: [], adminSalaries: {}, avatars: {}, paymentInfos: {}, consentData: {}, userRoles: {} };

    var dataNs = sheetNs.getDataRange().getDisplayValues();
    var adminSalaries = {};
    var avatars = {};
    var paymentInfos = {};
    var consentData = {}; // 🚀 KHAI BÁO BIẾN SỐ ÍT CHUẨN VỚI FRONTEND
    var paidData = {}; // 🚀 BIẾN LƯU TRẠNG THÁI THANH TOÁN
    var userRoles = {};

    var colNsName = 2;    // Cột C (Index 2)
    var colNsRole = 5;    // Cột F (Index 5)
    var colNsAva = 11;    // Cột L (Index 11)
    var colNsSalary = 13; // Cột N (Index 13)
    var colNsPayment = 14;// Cột O (Index 14)
    var colNsConsent = 15;// Cột P (Index 15)
    var colNsPaid = 16;    // Cột Q (Index 16) - Cột dành riêng lưu JSON Thanh toán

    for (var j = 11; j < dataNs.length; j++) {
        var nName = String(dataNs[j][colNsName]).trim();
        if (nName) {
            avatars[nName] = String(dataNs[j][colNsAva]).trim();
            userRoles[nName] = String(dataNs[j][colNsRole]).trim(); // Bốc luôn Role để Frontend biết ai là Admin

            // 🚀 BỌC THÉP BẢO MẬT: Chỉ bốc data chi tiết nếu là Chính chủ, hoặc người xem là "Quản lý"
            if (nName.toLowerCase() === currentUser.name.toLowerCase() || currentUser.role === 'Quản lý') {
                paymentInfos[nName] = String(dataNs[j][colNsPayment] || "").trim();
                
                // 🚀 ĐÃ FIX BƯỚC 1: Lấy dữ liệu Tick V và gán vào Key là Tên Nhân Sự
                var userConsent = {};
                var rawConsent = String(dataNs[j][colNsConsent] || "").trim();
                if (rawConsent.startsWith("{")) { 
                    try { userConsent = JSON.parse(rawConsent); } catch(e) {} 
                }
                consentData[nName] = userConsent; // Cấu trúc mảng lồng: consentData["ANH THƯ"] = { "2026": ... }
                
                // 🚀 ĐỌC DỮ LIỆU TICK ĐỎ "ĐÃ THANH TOÁN" TỪ CỘT Q
                var userPaid = {};
                var rawPaid = String(dataNs[j][colNsPaid] || "").trim();
                if (rawPaid.startsWith("{")) { 
                    try { userPaid = JSON.parse(rawPaid); } catch(e) {} 
                }
                paidData[nName] = userPaid;

                var rawJson = String(dataNs[j][colNsSalary]).trim();
                if (rawJson.startsWith("{")) { try { adminSalaries[nName] = JSON.parse(rawJson); } catch(e) {} }
            }
        }
    }

    // Lấy Data Task (Khúc này giữ nguyên)
    var dataTask = sheetTask.getDataRange().getDisplayValues();
    var completedTasks = [];
    var colId = letterToColIndex(FIELD_MAP["Mã Task"].col) - 1;
    var colName = letterToColIndex(FIELD_MAP["Chủ đề task"].col) - 1;
    var colProject = letterToColIndex(FIELD_MAP["Dự án"].col) - 1;
    var colAssignee = letterToColIndex(FIELD_MAP["Người làm task"].col) - 1;
    var colComplete = letterToColIndex(FIELD_MAP["Ngày hoàn thành"].col) - 1;
    //var colStatus = letterToColIndex(FIELD_MAP["Trạng thái task"].col) - 1;
    var colPrice = letterToColIndex(FIELD_MAP["Đơn giá"].col) - 1;
    var colKTT = letterToColIndex(FIELD_MAP["Kì thanh toán Freelancer"].col) - 1;
    var colDoiNguoi = letterToColIndex(FIELD_MAP["Đổi người"].col) - 1; // 🚀 NẠP CỘT ĐỔI NGƯỜI

    for (var i = 11; i < dataTask.length; i++) {
      var row = dataTask[i];
      //var status = String(row[colStatus]).trim().toLowerCase();
      var assignee = String(row[colAssignee]).trim();
      var completeDate = String(row[colComplete]).trim();

      // 🚀 LOGIC MỚI: Chỉ cần có Tên người làm (khác rỗng/khác dấu gạch) VÀ có Ngày hoàn thành
      if (assignee && assignee !== "-" && completeDate !== "") {
        var rawPrice = String(row[colPrice]).replace(/[^0-9]/g, '');
        completedTasks.push({
          id: row[colId], 
          name: row[colName], 
          project: row[colProject], 
          assignee: assignee,
          complete: completeDate, 
          price: rawPrice ? parseInt(rawPrice, 10) : 0, 
          ktt: row[colKTT] ? String(row[colKTT]).trim() : "",
          doinguoi: row[colDoiNguoi] ? String(row[colDoiNguoi]).trim() : "" // 🚀 ĐÓNG GÓI JSON ĐỔI NGƯỜI VÀO DATA
        });
      }      
    }

    // Trả về gói Dữ liệu Siêu cấp (Đã gom thành từng từ điển theo Tên user)
    return { tasks: completedTasks, adminSalaries: adminSalaries, avatars: avatars, paymentInfos: paymentInfos, consentData: consentData, userRoles: userRoles, paidData: paidData };    
  } catch (e) {
    return { tasks: [], adminSalaries: {}, avatars: {}, paymentInfos: {}, consentData: {}, userRoles: {} };
  }
}

// =========================================================================
// 💰 API 2: LƯU LƯƠNG ADMIN 4 TRƯỜNG THEO TỪNG ĐỢT
// =========================================================================
function saveAdminSalaryData(userName, year, month, l1, b1, l2, b2) {
    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheetNs = ss.getSheetByName("Nhân sự");
        var dataNs = sheetNs.getDataRange().getDisplayValues();
        var colNsName = 2; var colNsSalary = 14; 
        var targetRow = -1; var currentHistory = {};

        for (var i = 1; i < dataNs.length; i++) {
            if (String(dataNs[i][colNsName]).trim().toLowerCase() === userName.toLowerCase()) {
                targetRow = i + 1; 
                var rawJson = String(dataNs[i][colNsSalary-1]).trim();
                if (rawJson.startsWith("{")) { try { currentHistory = JSON.parse(rawJson); } catch(e) {} }
                break;
            }
        }
        if (targetRow === -1) throw new Error("Không tìm thấy user");

        // Ghi cấu trúc JSON 4 trường
        if (!currentHistory[year]) currentHistory[year] = {};
        currentHistory[year][month] = { 
            l1: parseInt(l1)||0, b1: parseInt(b1)||0, 
            l2: parseInt(l2)||0, b2: parseInt(b2)||0 
        };

        sheetNs.getRange(targetRow, colNsSalary).setValue(JSON.stringify(currentHistory));
        return {success: true};
    } catch(e) { return {success: false, msg: e.toString()}; }
}
// =========================================================================
// 🔔 API 1: LẤY LỊCH SỬ CỔNG THÔNG TIN (HỖ TRỢ GIẤU MẶT & INFO CENTER)
// =========================================================================
function getGlobalChatMessages(currentUser) {
    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName("Cổng thông tin");
        if (!sheet) return [];
        
        var data = sheet.getDataRange().getDisplayValues();
        var messages = [];
        var myRole = currentUser.role;
        var myName = currentUser.name.toLowerCase();
        
        var map = GLOBAL_DB_MAP["Cổng thông tin"];
        var idxId       = letterToColIndex(map["ID"].col) - 1; // 🚀 LẤY ID ĐỂ LÀM KHÓA
        var idxType     = letterToColIndex(map["Loại thông tin"].col) - 1;
        var idxSender   = letterToColIndex(map["Người gửi"].col) - 1;
        var idxReceiver = letterToColIndex(map["Người nhận"].col) - 1;
        var idxContent  = letterToColIndex(map["Nội dung"].col) - 1;
        var idxTime     = letterToColIndex(map["Thời gian"].col) - 1;
        var idxAnon     = letterToColIndex(map["Ẩn danh"].col) - 1;
        var idxReadBy   = letterToColIndex(map["Người đọc"].col) - 1; // 🚀 ĐỌC CỘT J
        
        for (var i = 11; i < data.length; i++) {
            var id = String(data[i][idxId]).trim();
            var type = String(data[i][idxType]).trim();
            var sender = String(data[i][idxSender]).trim();      
            var receiver = String(data[i][idxReceiver]).trim();    
            var isAnon = String(data[i][idxAnon]).trim() === "Có";
            var rawContent = data[i][idxContent]; 
            
            // 🚀 BÓC TÁCH MẢNG NGƯỜI ĐÃ ĐỌC
            var readByStr = String(data[i][idxReadBy] || "").trim();
            var readByArr = [];
            if (readByStr.startsWith("[")) { try { readByArr = JSON.parse(readByStr); } catch(e){} }
            
            var isMe = (sender.toLowerCase() === myName);
            var isToMe = (receiver.toLowerCase().includes(myName));
            var isToAll = (receiver === "TẤT CẢ" || receiver === "Tất cả" || receiver === "");

            if (myRole === "Freelancer") {
                if (!isToAll && !isMe && !isToMe) continue;
            }

            if (sender !== "") {
                messages.push({
                    id: id, // 🚀 TRẢ ID VỀ FRONTEND
                    type: type,
                    sender: sender, 
                    receiver: receiver,
                    text: rawContent,
                    time: data[i][idxTime],
                    isMe: isMe,
                    isAnon: isAnon,
                    readBy: readByArr // 🚀 TRẢ DANH SÁCH ĐÃ ĐỌC VỀ FRONTEND
                });
            }
        }
        return messages;
    } catch (e) { return []; }
}

// =========================================================================
// 🚀 API: ĐÁNH DẤU ĐÃ ĐỌC INFO CENTER (BẢN QUÉT TỌA ĐỘ TOÀN BẢNG)
// =========================================================================
function markGlobalMessageAsRead(msgId, userName) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Cổng thông tin");
        if (!sheet) return { success: false, msg: "Không tìm thấy Sheet Cổng thông tin" };
        
        // 🚀 KÉO TOÀN BỘ BẢNG VỀ ĐỂ DÒ TÌM (Chống mọi rủi ro lệch dòng)
        var data = sheet.getDataRange().getDisplayValues(); 
        var cleanMsgId = String(msgId).trim();
        var isUpdated = false;

        for (var i = 0; i < data.length; i++) {
            var currentId = String(data[i][1]).trim(); // 🚀 Cột B (Mã ID) là Index 1 trong mảng (A=0, B=1)
            
            if (currentId === cleanMsgId) { 
                var rowToWrite = i + 1; // 🚀 Tọa độ dòng thực tế trên Sheet (Mảng bắt đầu từ 0, Sheet bắt đầu từ 1)
                
                var readByStr = String(data[i][9]).trim(); // 🚀 Cột J (Đã Đọc) là Index 9
                var readByArr = [];
                
                if (readByStr.startsWith("[")) { 
                    try { readByArr = JSON.parse(readByStr); } catch(e){} 
                }
                
                // Nếu User chưa đọc Component này -> Nhét vào mảng và Ghi xuống Sheet
                if (!readByArr.includes(userName)) {
                    readByArr.push(userName);
                    // Ghi đè vào tọa độ chính xác: Dòng rowToWrite, Cột 10 (Cột J)
                    sheet.getRange(rowToWrite, 10).setValue(JSON.stringify(readByArr)); 
                    isUpdated = true;
                }
                
                // Ép Google lưu dữ liệu vật lý ngay lập tức
                SpreadsheetApp.flush(); 
                Logger.log("✅ Ghi nhận thành công: " + userName + " tại dòng: " + rowToWrite);
                
                return { success: true }; // Ghi xong hoặc đã tồn tại đều báo Thành công để Frontend xóa nợ
            }
        }
        
        Logger.log("❌ LỖI: Đã quét hết bảng nhưng không tìm thấy ID: [" + cleanMsgId + "]");
        return { success: false, msg: "Không tìm thấy ID" };
    } catch (e) { 
        Logger.log("🚨 Lỗi markGlobalMessageAsRead: " + e.toString());
        return { success: false, error: e.toString() }; 
    }
}

// =========================================================================
// 🔔 API 2: GỬI THÔNG ĐIỆP LÊN CỔNG THÔNG TIN (HỖ TRỢ INFO CENTER)
// =========================================================================
function sendGlobalChatMessage(payload, currentUser) {
    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName("Cổng thông tin");
        
        var now = new Date();
        var dStr = String(now.getDate()).padStart(2, "0");
        var mStr = String(now.getMonth() + 1).padStart(2, "0");
        var yStr = now.getFullYear();
        var hStr = String(now.getHours()).padStart(2, "0");
        var minStr = String(now.getMinutes()).padStart(2, "0");
        var timeStr = dStr + "/" + mStr + "/" + yStr + " " + hStr + ":" + minStr;
        
        var msgId = "INF-" + now.getTime();
        
        var myRole = currentUser.role;
        var realSender = currentUser.name;
        var finalType = payload.type || "Chat Team";
        var finalReceiver = payload.receiver || "TẤT CẢ";

        // Ép buộc Freelancer gửi Góp ý
        if (myRole === "Freelancer") {
            finalType = "Góp ý";
            finalReceiver = "Admin & Quản lý";
        }

        // 🚀 BỌC THÉP MAPPING: Tự định vị tọa độ ghi dữ liệu (Tuyệt đối chống xô lệch cột)
        var map = GLOBAL_DB_MAP["Cổng thông tin"];
        var targetColCount = Math.max(sheet.getLastColumn(), 10); // Đảm bảo mảng đủ dài
        var newRow = new Array(targetColCount).fill(""); // Khởi tạo một mảng trống hoàn toàn
        
        newRow[letterToColIndex(map["ID"].col) - 1] = msgId;
        newRow[letterToColIndex(map["Loại thông tin"].col) - 1] = finalType;
        newRow[letterToColIndex(map["Người gửi"].col) - 1] = realSender;
        newRow[letterToColIndex(map["Người nhận"].col) - 1] = finalReceiver;
        
        // 🚀 BƯỚC CHUẨN BỊ CHO BƯỚC 2: Nếu nội dung Frontend gửi lên là 1 cục Object (Thông báo Info Center) -> Tự động nén thành JSON. Nếu là Text Chat thường -> Giữ nguyên.
        newRow[letterToColIndex(map["Nội dung"].col) - 1] = (typeof payload.text === "object") ? JSON.stringify(payload.text) : payload.text;
        
        newRow[letterToColIndex(map["Thời gian"].col) - 1] = timeStr;
        newRow[letterToColIndex(map["Ẩn danh"].col) - 1] = payload.isAnon ? "Có" : "Không";
        
        // Bắn 1 phát duy nhất xuống Sheet
        sheet.appendRow(newRow);
        
        return {success: true};
    } catch(e) { return {success: false, message: e.toString()}; }
}

// =========================================================================
// 🚚 API LOGISTICS: SIÊU HÀM XỬ LÝ ĐỒNG BỘ HÀNG LOẠT (BATCH SYNC)
// Đã mở rộng bao quát 100% các chức năng Ghi dữ liệu của App
// =========================================================================
// =========================================================================
// 🚚 API LOGISTICS: TRẠM XỬ LÝ HÀNG LOẠT (CÓ TRẢ BIÊN NHẬN ĐỐI SOÁT)
// =========================================================================
// Cập nhật trường hợp xe tải Batch Sync đón nhận cấu hình mảng JSON đa tầng mới của Lương Admin
function processBatchSync(queue, currentUser) {
    try {
        if (!queue || queue.length === 0) return { success: true, processedIds: [] };
        let needTaskRefresh = false; let processedIds = []; let batchErrors = [];

        for (let i = 0; i < queue.length; i++) {
            let item = queue[i]; let actionType = item.actionType; let actionId = item.actionId; 

            if (actionType === "UPDATE_CELL") {
                let res = updateTaskCell(item.row, item.col, item.value, currentUser);
                if (res && res.success) { needTaskRefresh = true; processedIds.push(actionId); } else { needTaskRefresh = true; processedIds.push(actionId); batchErrors.push(res.message || "Lỗi cập nhật ô."); }
            }
            else if (actionType === "CREATE_TASK") { let res = createNewTask(item.payload, currentUser); if (res && res.status === "success") { needTaskRefresh = true; processedIds.push(actionId); } }
            else if (actionType === "ADD_TASK_CHAT") { let res = addChatMessage(item.payload, currentUser); if (res && res.success) { needTaskRefresh = true; processedIds.push(actionId); } }
            else if (actionType === "UPDATE_AIR_TASK") { let res = saveAirTaskData(item.payload, currentUser); if (res && res.success) { needTaskRefresh = true; processedIds.push(actionId); } else { needTaskRefresh = true; processedIds.push(actionId); batchErrors.push(res.message || "Lỗi cập nhật Air Task."); } }
            else if (actionType === "SEND_CHAT") { let res = sendGlobalChatMessage(item.payload, currentUser); if (res && res.success) processedIds.push(actionId); }
            else if (actionType === "UPDATE_PROFILE") { updateUserProfile(item.payload); processedIds.push(actionId); }
            else if (actionType === "MARK_ALERT_READ") { let res = markGlobalMessageAsRead(item.alertId, item.userName); if (res && res.success) processedIds.push(actionId); }
            else if (actionType === "ADD_EXTRA_COST") { let res = saveExtraCostToProject(item.payload, currentUser); if (res && res.success) { needTaskRefresh = true; processedIds.push(actionId); } }
            else if (actionType === "TOGGLE_EXTRA_COST_PAYMENT") { let res = toggleExtraCostPaymentBackend(item.payload, currentUser); if (res && res.success) { needTaskRefresh = true; processedIds.push(actionId); } }
            
            // 🚀 BỌC THÉP XE TẢI: Ghi nhận trọn vẹn cục Object Lịch sử đợt lương Admin mới[cite: 7]
            else if (actionType === "UPDATE_ADMIN_SALARY") {
                try {
                    let payload = item.payload; 
                    let targetUser = String(payload.userName).trim();
                    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Nhân sự");
                    if (sheet) {
                        let data = sheet.getDataRange().getDisplayValues(); 
                        let isUpdated = false;
                        for (let i = 1; i < data.length; i++) {
                            if (String(data[i][2]).trim().toLowerCase() === targetUser.toLowerCase()) { 
                                sheet.getRange(i + 1, 14).setValue(JSON.stringify(payload.salaryHistory)); // Ghi đè cột N (Cột 14)[cite: 7]
                                isUpdated = true; break;
                            }
                        }
                        if (isUpdated) { SpreadsheetApp.flush(); processedIds.push(item.actionId); }
                    }
                } catch(e) { Logger.log("🚨 Lỗi UPDATE_ADMIN_SALARY: " + e.toString()); }
            }
        }

        let latestTasks = null; let extraCostsData = null; let pdfExportData = null;
        if (needTaskRefresh) { var freshData = getTasksList(currentUser); latestTasks = freshData.tasks; extraCostsData = freshData.extraCostsData; pdfExportData = freshData.pdfExportData; }
        return { success: true, latestTasks: latestTasks, extraCostsData: extraCostsData, pdfExportData: pdfExportData, processedIds: processedIds, errors: batchErrors };
    } catch (e) { throw new Error(e.toString()); }
}

//       =========================================================================
    // 💰 API CHUYÊN DỤNG: TỰ ĐỘNG CẬP NHẬT THÔNG TIN TÀI KHOẢN NGÂN HÀNG XUỐNG CỘT O
    // =========================================================================
    function saveUserPaymentInfo(paymentStr, currentUser) {
        try {
            var ss = SpreadsheetApp.getActiveSpreadsheet();
            var sheetNs = ss.getSheetByName("Nhân sự");
            if (!sheetNs) return { success: false, message: "Không tìm thấy sheet Nhân sự!" };
            
            var dataNs = sheetNs.getDataRange().getDisplayValues();
            var colNsName = 2; // Cột C: Tên nhân sự
            var colNsPayment = 15; // Cột O: Thông tin nhận lương (Số thứ tự cột là 15)
            
            var targetRow = -1;
            for (var i = 1; i < dataNs.length; i++) {
                if (String(dataNs[i][colNsName]).trim().toLowerCase() === currentUser.name.toLowerCase()) {
                    targetRow = i + 1;
                    break;
                }
            }
            if (targetRow === -1) return { success: false, message: "Không tìm thấy tài khoản nhân sự phù hợp!" };
            
            // Ghi chuỗi JSON thông tin tài khoản vào ô tương ứng trên cột O
            sheetNs.getRange(targetRow, colNsPayment).setValue(paymentStr);
            return { success: true };
        } catch(e) {
            return { success: false, message: "Lỗi Server Backend: " + e.toString() };
        }
    }

// =========================================================================
// 💰 API CHUYÊN DỤNG: LƯU TRẠNG THÁI TICK ĐỒNG Ý THANH TOÁN XUỐNG CỘT P
// =========================================================================
function saveUserConsent(year, month, batch, isChecked, currentUser) {
    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheetNs = ss.getSheetByName("Nhân sự");
        if (!sheetNs) return { success: false };
        
        var dataNs = sheetNs.getDataRange().getDisplayValues();
        var targetRow = -1;
        for (var i = 1; i < dataNs.length; i++) {
            if (String(dataNs[i][2]).trim().toLowerCase() === currentUser.name.toLowerCase()) {
                targetRow = i + 1;
                break;
            }
        }
        if (targetRow === -1) return { success: false };
        
        var colNsConsent = 16; // Cột P: Cột lưu trữ Checkbox (Vị trí 16)
        var currentConsent = {};
        
        // Đọc dữ liệu cũ để không làm mất các đợt đã tick trước đó
        var rawConsent = String(dataNs[targetRow - 1][colNsConsent - 1] || "").trim();
        if (rawConsent.startsWith("{")) {
            try { currentConsent = JSON.parse(rawConsent); } catch(e) {}
        }
        
        // Tạo cấu trúc JSON: Năm -> Tháng -> Đợt -> true/false
        if (!currentConsent[year]) currentConsent[year] = {};
        if (!currentConsent[year][month]) currentConsent[year][month] = {};
        currentConsent[year][month][batch] = isChecked;
        
        // Ghi xuống Sheet
        sheetNs.getRange(targetRow, colNsConsent).setValue(JSON.stringify(currentConsent));
        return { success: true };
    } catch(e) {
        console.error("Lỗi lưu Consent:", e);
        return { success: false };
    }
}
// 🚀 HÀM LƯU DỮ LIỆU TICK ĐỎ (QUẢN LÝ ONLY)
function saveUserPaidStatus(year, month, batch, value, targetUser) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Nhân sự");
    var data = sheet.getDataRange().getDisplayValues();
    var colName = 2;  // Cột C
    var colPaid = 17; // Cột Q (Thứ tự cột là 17)

    for (var i = 11; i < data.length; i++) {
      if (String(data[i][colName]).trim().toLowerCase() === String(targetUser).trim().toLowerCase()) {
        var rawData = String(data[i][colPaid - 1] || "").trim();
        var paidJson = {};
        if (rawData.startsWith("{")) {
          try { paidJson = JSON.parse(rawData); } catch (e) {}
        }

        if (!paidJson[year]) paidJson[year] = {};
        if (!paidJson[year][month]) paidJson[year][month] = {};
        paidJson[year][month][batch] = value; // value ở đây là chuỗi thời gian hoặc false

        sheet.getRange(i + 1, colPaid).setValue(JSON.stringify(paidJson));
        return true;
      }
    }
  } catch (err) {
    Logger.log("Lỗi lưu trạng thái thanh toán: " + err);
  }
}
// =========================================================================
// 📁 API: UPLOAD FILE ĐÍNH KÈM TỪ CỬA SỔ CHAT LÊN DRIVE
// =========================================================================
function uploadChatAttachment(base64Data, fileName, mimeType) {
    try {
        // ID Thư mục lưu trữ Upload của bạn
        var folderId = "18RAw9TTU6E1mvbC16FDiUr_ARZ95pMRN";
        var folder = DriveApp.getFolderById(folderId);
        
        // Bóc tách phần dữ liệu ròng (Bỏ header 'data:image/png;base64,')
        var data = base64Data;
        if (base64Data.indexOf(",") !== -1) {
            data = base64Data.split(',')[1];
        }
        
        // Nặn lại thành File và đẩy lên Drive
        var blob = Utilities.newBlob(Utilities.base64Decode(data), mimeType, fileName);
        var file = folder.createFile(blob);
        
        // 🚀 CẤP QUYỀN VIEW PUBLIC: Để User xem ảnh nội tuyến và bấm nút là tải được ngay 1-click
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        var fileId = file.getId();
        
        return {
            success: true,
            // Link xem ảnh trực tiếp (Dùng cho thẻ <img src=>)
            viewUrl: "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1000",
            // Link ép tải xuống 1-click (Dùng cho file tài liệu)
            downloadUrl: "https://drive.google.com/uc?export=download&id=" + fileId
        };
    } catch (e) {
        return { success: false, message: e.toString() };
    }
}
// =========================================================================
// 📊 MODULE: QUẢN LÝ CẤU HÌNH DASHBOARD CÁ NHÂN HÓA (SHEET NHÂN SỰ)
// =========================================================================

/**
 * 1. HÀM KÉO CẤU HÌNH DASHBOARD (Chạy khi User mở Modal)
 */
function getUserDashboardConfig(appUser) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Nhân sự");
        if (!sheet) return { success: false, message: "Không tìm thấy Sheet Nhân sự" };

        var lastRow = sheet.getLastRow();
        if (lastRow < 12) return { success: true, config: null }; // Chưa có data

        // Kéo dữ liệu từ dòng 12 đến Cột R (Cột số 18)
        var data = sheet.getRange(12, 1, lastRow - 11, 18).getDisplayValues(); 
        
        // 🚀 Dò tìm tọa độ cột chuẩn xác 100% dựa vào cấu hình có sẵn của App
        var idxPhone = letterToColIndex(USER_FIELD_MAP["SĐT Zalo"].col) - 1; // Cột J (Index 9)
        var idxName = letterToColIndex(USER_FIELD_MAP["Tên"].col) - 1;       // Cột C (Index 2)
        var idxConfig = 17;                                                  // Cột R (Index 17)

        for (var i = 0; i < data.length; i++) {
            var rowPhone = String(data[i][idxPhone]).trim();
            var rowName = String(data[i][idxName]).trim();

            // Khớp chính xác SĐT (Ưu tiên số 1 vì là ID đăng nhập), dự phòng bằng Tên
            if (rowPhone === String(appUser.phone).trim() || rowName.toLowerCase() === String(appUser.name).toLowerCase()) {
                var configJson = data[i][idxConfig];
                
                if (configJson && configJson.toString().trim() !== "") {
                    return { success: true, config: JSON.parse(configJson) }; // Trả về file JSON cấu hình
                } else {
                    return { success: true, config: null }; // User này chưa từng xài Dashboard (Cột R trống)
                }
            }
        }
        return { success: true, config: null }; // Không tìm thấy user
    } catch (e) {
        return { success: false, message: "Lỗi tải cấu hình: " + e.toString() };
    }
}

/**
 * 2. HÀM LƯU NGẦM CẤU HÌNH DASHBOARD (Chạy âm thầm qua AppStore khi User chỉnh sửa)
 */
function saveUserDashboardConfig(appUser, configData) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Nhân sự");
        if (!sheet) return { success: false, message: "Không tìm thấy Sheet Nhân sự" };

        var lastRow = sheet.getLastRow();
        if (lastRow < 12) return { success: false, message: "Sheet Nhân sự rỗng" };

        var data = sheet.getRange(12, 1, lastRow - 11, 18).getDisplayValues();
        var idxPhone = letterToColIndex(USER_FIELD_MAP["SĐT Zalo"].col) - 1; 
        var idxName = letterToColIndex(USER_FIELD_MAP["Tên"].col) - 1;       
        var rowIndex = -1;

        // Quét tìm dòng của user này
        for (var i = 0; i < data.length; i++) {
            var rowPhone = String(data[i][idxPhone]).trim();
            var rowName = String(data[i][idxName]).trim();

            if (rowPhone === String(appUser.phone).trim() || rowName.toLowerCase() === String(appUser.name).toLowerCase()) {
                rowIndex = 12 + i; // Quy đổi index mảng thành số dòng thực tế trên Sheet
                break;
            }
        }

        if (rowIndex !== -1) {
            // 🚀 GHI ĐÈ FILE JSON VÀO CỘT R (Cột số 18)
            sheet.getRange(rowIndex, 18).setValue(JSON.stringify(configData));
            return { success: true };
        } else {
            return { success: false, message: "Không tìm thấy dữ liệu user trên Sheet Nhân sự" };
        }
    } catch (e) {
        return { success: false, message: "Lỗi lưu cấu hình: " + e.toString() };
    }
}
// ==========================================
// API: QUẢN LÝ CHI PHÍ MKT KHÁC (SHEET DỰ ÁN CỘT O)
// ==========================================
function saveExtraCostToProject(payload, currentUser) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dự án");
        var data = sheet.getRange(12, 3, sheet.getLastRow() - 11 || 1, 13).getDisplayValues();
        var targetRow = -1;
        for(var i=0; i<data.length; i++) {
            if(String(data[i][0]).trim() === payload.project.trim()) { targetRow = i + 12; break; }
        }
        if(targetRow === -1) return {success:false};
        
        var currentJsonStr = String(sheet.getRange(targetRow, 15).getValue()).trim();
        var currentJson = {};
        if(currentJsonStr.startsWith("{")) { try { currentJson = JSON.parse(currentJsonStr); } catch(e){} }
        
        // Tạo mảng rỗng nếu đợt này chưa có
        if(!currentJson[payload.claimId]) currentJson[payload.claimId] = [];
        
        // 🚀 BỌC THÉP: Kiểm tra xem cái ID này đã từng được lưu chưa (Chống user spam click)
        let isExists = false;
        for (var k = 0; k < currentJson[payload.claimId].length; k++) {
            if (currentJson[payload.claimId][k].id == payload.costItem.id) {
                isExists = true;
                break;
            }
        }
        
        // Nếu chưa tồn tại thì mới đẩy vào lưu
        if (!isExists) {
            currentJson[payload.claimId].push(payload.costItem);
            sheet.getRange(targetRow, 15).setValue(JSON.stringify(currentJson));
        }
        
        return {success: true};
    } catch(e) { return {success:false}; }
}

function toggleExtraCostPaymentBackend(payload, currentUser) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dự án");
        var data = sheet.getRange(12, 3, sheet.getLastRow() - 11 || 1, 13).getDisplayValues();
        var targetRow = -1;
        for(var i=0; i<data.length; i++) {
            if(String(data[i][0]).trim() === payload.project.trim()) { targetRow = i + 12; break; }
        }
        if(targetRow === -1) return {success:false};
        
        var currentJsonStr = String(sheet.getRange(targetRow, 15).getValue()).trim();
        var currentJson = {};
        if(currentJsonStr.startsWith("{")) { try { currentJson = JSON.parse(currentJsonStr); } catch(e){} }
        
        if(currentJson[payload.claimId]) {
            for(var j=0; j<currentJson[payload.claimId].length; j++) {
                if(currentJson[payload.claimId][j].id == payload.costId) {
                    currentJson[payload.claimId][j].isPaid = payload.isPaid;
                    break;
                }
            }
        }
        sheet.getRange(targetRow, 15).setValue(JSON.stringify(currentJson));
        return {success: true};
    } catch(e) { return {success:false}; }
}

// =========================================================================
// API BỔ SUNG: CẤP TOKEN VÀ PHÂN QUYỀN CHO CHUẨN UPLOAD FILE HẠNG NẶNG (>400MB)
// =========================================================================

// Cấp chìa khóa (Token) tạm thời cho Frontend để tự giao tiếp với Google Drive
function getDriveAccessToken() {
    return ScriptApp.getOAuthToken();
}

// Hàm chốt sổ: Phân quyền Public và xuất Link sau khi Frontend đã bơm xong 400MB
function finalizeDriveFilePermissions(fileId) {
    try {
        let file = DriveApp.getFileById(fileId);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        return {
            success: true,
            viewUrl: "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1000",
            downloadUrl: "https://drive.google.com/uc?export=download&id=" + fileId
        };
    } catch(e) {
        return { success: false, message: e.toString() };
    }
}

// =========================================================================
// 🖨️ API: LƯU FILE PDF THANH TOÁN VÀ CẬP NHẬT SHEET DỰ ÁN (VỊ TRÍ CHUẨN)
// =========================================================================
function savePaymentPdfToDrive(pdfBase64, filename, claimId, projectList) {
    try {
        // 1. LƯU FILE LÊN DRIVE
        var folderId = "10-tzY7UmRDRiuPvxwEZKpSMUoBTNphiY"; // ID Thư mục Kế toán của bạn
        var folder = DriveApp.getFolderById(folderId);
        var base64Data = pdfBase64.split(',')[1];
        var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'application/pdf', filename);
        var file = folder.createFile(blob);
        var fileUrl = file.getUrl();
        
        // 🚀 BỌC THÉP: Xóa bỏ điều kiện claimId === "null" để luồng vẫn chạy xuống vòng lặp ghi Sheet!
        if (!claimId) return { success: true, url: fileUrl };

        // 2. CẬP NHẬT CỘT P (Cột số 16, Index 15) SHEET "DỰ ÁN"
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var projSheet = ss.getSheetByName("Dự án");
        
        if (projSheet) {
            var pData = projSheet.getDataRange().getValues();
            var updates = [];
            
            // 🚀 TỐI ƯU: Quét chính xác từ dòng 12 trở xuống (Dòng 12 tương ứng index 11)
            for (var i = 11; i < pData.length; i++) {
                var pName = String(pData[i][2] || "").trim();
                
                // 🚀 BỌC THÉP CHỐNG XẢ RÁC: Nếu dòng trống (Không có tên Dự án) -> Lập tức bỏ qua!
                if (pName === "") continue; 

                // Nếu chọn "Tất cả" HOẶC tìm thấy tên Dự án khớp trong cột C
                if (projectList.includes("Tất cả") || projectList.includes(pName)) {
                    var currentJsonStr = String(pData[i][15] || "{}").trim();
                    if (currentJsonStr === "" || currentJsonStr === "-") currentJsonStr = "{}";
                    var pdfLinksObj = {};
                    try { pdfLinksObj = JSON.parse(currentJsonStr); } catch(e) { pdfLinksObj = {}; }
                    
                    // 🚀 Lưu JSON với key tự động (Nếu là "null" nó sẽ lưu key "null" để không bị khóa sổ)
                    pdfLinksObj[String(claimId)] = fileUrl; 
                    
                    updates.push({row: i + 1, col: 16, val: JSON.stringify(pdfLinksObj)});
                }
            }
            
            // Thực thi ghi dữ liệu hàng loạt xuống Sheet Dự án
            updates.forEach(function(u) {
                projSheet.getRange(u.row, u.col).setValue(u.val);
            });
        }

        return { success: true, url: fileUrl };
        
    } catch(e) {
        Logger.log("Lỗi savePaymentPdfToDrive: " + e.toString());
        throw new Error(e.toString());
    }
}

// =========================================================================
// 💰 API: LƯU JSON THỰC CHI MKT VÀO CỘT Q SHEET DỰ ÁN
// =========================================================================
function saveMktActualCostToSheet(project, year, month, costDataObj) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dự án");
        var data = sheet.getRange(12, 3, sheet.getLastRow() - 11 || 1, 1).getDisplayValues(); // Quét mỗi Cột C
        var targetRow = -1;
        for(var i=0; i<data.length; i++) {
            if(String(data[i][0]).trim() === project.trim()) { 
                targetRow = i + 12; break; 
            }
        }
        if(targetRow === -1) return {success: false, message: "Không tìm thấy dự án"};
        
        var currentJsonStr = String(sheet.getRange(targetRow, 17).getValue()).trim(); // Ghi Cột Q
        var currentJson = {};
        if(currentJsonStr.startsWith("{")) { try { currentJson = JSON.parse(currentJsonStr); } catch(e){} }
        
        if(!currentJson[year]) currentJson[year] = {};
        currentJson[year][month] = costDataObj; // Đóng gói cục bộ
        
        sheet.getRange(targetRow, 17).setValue(JSON.stringify(currentJson));
        return {success: true};
    } catch(e) { return {success: false, message: e.toString()}; }
}

// =========================================================================
// 🛡️ TRẠM GÁC KẾ TOÁN (BỌC THÉP API): KIỂM TRA ĐIỀU KIỆN BẤT BIẾN
// =========================================================================
function isTaskFinanciallyLocked(ss, taskRowData) {
    // 1. Kiểm tra Khóa từ Thanh toán Dự án (Cột AI - Index 34 trong mảng)
    let isProjPaid = String(taskRowData[34] || "").trim() !== "";
    if (isProjPaid) return true;

    // 2. Kiểm tra Khóa từ Thanh toán Lương (Sheet Nhân sự - Cột Q)
    let assignee = String(taskRowData[7] || "").trim(); // Cột H (Người làm)
    let completeDate = String(taskRowData[13] || "").trim(); // Cột N (Ngày HT)
    
    // Phải có Ngày hoàn thành và Người làm thì mới có cơ sở đối chiếu Lương
    if (assignee !== "" && completeDate !== "" && completeDate.includes('/')) {
        let pts = completeDate.split('/');
        if (pts.length === 3) {
            let d = parseInt(pts[0], 10), m = parseInt(pts[1], 10), y = parseInt(pts[2], 10);
            let batch = "1";
            let targetM = m, targetY = y;
            
            // Dịch ngày hoàn thành ra mã Đợt
            if (d >= 11 && d <= 25) { batch = "2"; } 
            else if (d >= 26) { batch = "1"; targetM = m + 1; if (targetM > 12) { targetM = 1; targetY = y + 1; } }
            
            // Mở lén Sheet Nhân sự ra quét
            let sheetNs = ss.getSheetByName("Nhân sự");
            if (sheetNs) {
                let dataNs = sheetNs.getDataRange().getDisplayValues();
                // Cột C (Index 2) là Tên, Cột Q (Index 16) là chuỗi JSON Thanh toán
                for (let n = 11; n < dataNs.length; n++) {
                    if (String(dataNs[n][2]).trim().toLowerCase() === assignee.toLowerCase()) {
                        let rawPaid = String(dataNs[n][16] || "").trim(); 
                        if (rawPaid.startsWith("{")) {
                            try {
                                let paidObj = JSON.parse(rawPaid);
                                // Kiểm tra xem Đợt đó, Tháng đó đã tick chưa
                                if (paidObj[targetY] && paidObj[targetY][targetM] && paidObj[targetY][targetM][batch]) {
                                    return true; // Đã tick Lương -> KHÓA!
                                }
                            } catch(e){}
                        }
                        break; // Tìm đúng người rồi thì dừng quét cho nhẹ máy
                    }
                }
            }
        }
    }
    return false; // Nếu qua hết trạm mà không có gì -> Thẻ Xanh
}

// =========================================================================
// ☁️ API: QUẢN LÝ KHO MEDIA TƯ LIỆU (DRIVE) - NÂNG CẤP V2
// =========================================================================
const MEDIA_TEAM_FOLDER_ID = "1WgW0-_YiCGkpxhRKgMJQoGd3qbDpopyS"; 

// 1. Kéo File mới nhất theo Thư mục được chọn (Nâng cấp Thumbnail)
function getMediaFolderFiles(folderId) {
    try {
        // Nếu không truyền ID thì mặc định lấy thư mục gốc
        var targetId = folderId || MEDIA_TEAM_FOLDER_ID;
        var folder = DriveApp.getFolderById(targetId);
        var files = folder.getFiles();
        var result = [];
        var count = 0;
        
        // Quét lấy tối đa 40 file mới nhất trong thư mục đó
        while (files.hasNext() && count < 40) {
            var file = files.next();
            var mimeType = file.getMimeType();
            
            result.push({
                id: file.getId(),
                name: file.getName(),
                url: file.getUrl(),
                mimeType: mimeType,
                // 🚀 Tự động kích hoạt API Thumbnail mượt mà của Google Drive
                thumbUrl: "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w200",
                timestamp: file.getDateCreated().getTime()
            });
            count++;
        }
        // Xếp file mới nhất lên đầu danh sách
        result.sort((a,b) => b.timestamp - a.timestamp);
        return {success: true, data: result};
    } catch(e) { return {success: false, message: e.toString()}; }
}

// 2. Thuật toán Đệ quy quét Cây Thư mục (Folder Tree)
function getMediaFolderTree() {
    try {
        var rootFolder = DriveApp.getFolderById(MEDIA_TEAM_FOLDER_ID);
        var tree = [];
        
        // Thêm thư mục gốc lên đầu
        tree.push({ id: MEDIA_TEAM_FOLDER_ID, name: "📂 Kho Media (Thư mục Gốc)", level: 0 });
        
        // Hàm đệ quy quét thư mục con
        function traverse(parent, level) {
            var subFolders = parent.getFolders();
            var fList = [];
            while(subFolders.hasNext()) { fList.push(subFolders.next()); }
            // Xếp theo A-Z cho đẹp
            fList.sort((a, b) => a.getName().localeCompare(b.getName()));
            
            for(var i=0; i<fList.length; i++) {
                tree.push({ id: fList[i].getId(), name: fList[i].getName(), level: level });
                traverse(fList[i], level + 1); // Quét tiếp vào trong
            }
        }
        
        traverse(rootFolder, 1);
        return {success: true, data: tree};
    } catch(e) { return {success: false, message: e.toString()}; }
}

// 3. Tạo thư mục mới
function createNewMediaFolder(parentId, folderName, currentUser) {
    if(currentUser.role !== 'Admin' && currentUser.role !== 'Quản lý') return {success: false, message: "🚨 Bị chặn!"};
    try {
        var parent = DriveApp.getFolderById(parentId);
        parent.createFolder(folderName);
        return {success: true};
    } catch(e) { return {success: false, message: e.toString()}; }
}

// 4. Upload File vào thư mục Đích (Target Folder)
function uploadBatchMediaFiles(filesArray, targetFolderId, currentUser) {
    if(currentUser.role !== 'Admin' && currentUser.role !== 'Quản lý') return {success: false, message: "🚨 Bị chặn!"};
    try {
        var finalFolderId = targetFolderId || MEDIA_TEAM_FOLDER_ID;
        var folder = DriveApp.getFolderById(finalFolderId);
        
        for(var i=0; i < filesArray.length; i++) {
            var data = filesArray[i].base64;
            if (data.indexOf(",") !== -1) data = data.split(',')[1];
            var blob = Utilities.newBlob(Utilities.base64Decode(data), filesArray[i].mimeType, filesArray[i].name);
            var file = folder.createFile(blob);
            file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        }
        return {success: true};
    } catch(e) { return {success: false, message: e.toString()}; }
}

// =========================================================================
// 🗂️ MODULE KHÓA: API MEDIA HUB - XỬ LÝ JSON CỘT R SHEET DỰ ÁN (DÒNG 12+)
// =========================================================================

// 1. Luồng kéo dữ liệu Media Hub & Danh sách Dự án từ cột C và R
function getMediaHubData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Dự án");
    if (!sheet) return { success: false, message: "Không tìm thấy sheet Dự án" };
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 12) return { success: true, projects: [], mediaItems: [] };
    
    // Đọc từ cột C (Cột 3) đến cột R (Cột 18) -> Tổng số cột là 16
    var data = sheet.getRange(12, 3, lastRow - 11, 16).getValues(); 
    var projects = [];
    var mediaItems = [];
    
    for (var i = 0; i < data.length; i++) {
      var pName = String(data[i][0]).trim(); // Cột C (Index 0 trong dải)
      if (pName !== "") {
        projects.push(pName); 
        var rawMedia = String(data[i][15]).trim(); // Cột R (Index 15 trong dải từ C->R)
        if (rawMedia.startsWith("[")) {
          try {
            var items = JSON.parse(rawMedia);
            items.forEach(function(item) {
              item.projectName = pName; // Ghép tên dự án để Frontend render tiêu đề công khai
              mediaItems.push(item);
            });
          } catch(e) {}
        }
      }
    }
    return { success: true, projects: [...new Set(projects)], mediaItems: mediaItems };
  } catch(e) { return { success: false, message: e.toString() }; }
}

// 2. Luồng Admin/Quản lý chốt thêm tư liệu dự án mới xuống cột R
function addMediaHubItem(payload, currentUser) {
  var role = currentUser ? currentUser.role : "Khách lạ";
  if (role !== "Admin" && role !== "Quản lý") return { success: false, message: "🚨 Bị chặn: Bạn không có quyền thao tác!" };
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Dự án");
    var lastRow = sheet.getLastRow();
    if (lastRow < 12) return { success: false, message: "Sheet Dự án hiện tại đang trống!" };
    
    var data = sheet.getRange(12, 3, lastRow - 11, 1).getValues(); // Quét riêng cột C để đối soát tên dự án
    var targetRow = -1;
    
    for (var i = 0; i < data.length; i++) {
      if (String(data[i][0]).trim() === payload.projectName.trim()) { 
        targetRow = i + 12;
        break;
      }
    }
    
    if (targetRow === -1) return { success: false, message: "Không tìm thấy tên Dự án tương ứng trên hệ thống!" };
    
    // Truy cập trực tiếp ô giao thoa tại dòng tìm được và Cột 18 (Cột R)
    var currentJsonStr = String(sheet.getRange(targetRow, 18).getValue()).trim(); 
    var currentArr = [];
    if (currentJsonStr.startsWith("[")) { 
      try { currentArr = JSON.parse(currentJsonStr); } catch(e) {} 
    }
    
    // Đẩy cấu hình tệp tin rút gọn link vào mảng
    currentArr.push({
      id: "MHUB_" + Date.now(),
      category: payload.category,
      link: payload.link,
      logoBase64: payload.logoBase64 // Bản chất lưu Direct Link Drive ảnh của logo hiển thị
    });
    
    sheet.getRange(targetRow, 18).setValue(JSON.stringify(currentArr));
    return { success: true };
  } catch(e) { return { success: false, message: e.toString() }; }
}

// 🗑️ API CHUYÊN DỤNG: XÓA ĐẦU LƯƠNG ADMIN KHỎI MẢNG JSON CỘT N
function deleteAdminSalaryItem(targetUser, year, month, batch, itemId) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetNs = ss.getSheetByName("Nhân sự");
    var dataNs = sheetNs.getDataRange().getDisplayValues();
    var colNsName = 2;   // Cột C (Tên nhân sự)
    var colNsSalary = 14; // Cột N (Lương & Bonus)
    var targetRow = -1;
    var currentHistory = {};

    // Quét tìm dòng của nhân sự tương ứng
    for (var i = 1; i < dataNs.length; i++) {
      if (String(dataNs[i][colNsName]).trim().toLowerCase() === String(targetUser).trim().toLowerCase()) {
        targetRow = i + 1;
        var rawJson = String(dataNs[i][colNsSalary - 1]).trim();
        if (rawJson.startsWith("{")) { 
          try { currentHistory = JSON.parse(rawJson); } catch(e) {} 
        }
        break;
      }
    }
    if (targetRow === -1) return { success: false, message: "Không tìm thấy thông tin nhân sự trên hệ thống!" };

    let batchKey = "batch_" + batch;
    if (currentHistory[year] && currentHistory[year][month] && currentHistory[year][month][batchKey]) {
      // Thuật toán lọc loại trừ hạng mục có ID trùng khớp ra khỏi mảng JSON
      currentHistory[year][month][batchKey] = currentHistory[year][month][batchKey].filter(function(item) { 
        return item.id !== itemId; 
      });
      
      // Ghi đè chuỗi dữ liệu sạch mới ngược lại ô dưới Sheet
      sheetNs.getRange(targetRow, colNsSalary).setValue(JSON.stringify(currentHistory));
      return { success: true };
    }
    return { success: false, message: "Không tìm thấy mục lương yêu cầu cấu hình xóa!" };
  } catch(e) { return { success: false, message: "Lỗi Server: " + e.toString() }; }
}
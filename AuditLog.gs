/**
 * HỆ THỐNG GHI NHẬT KÝ (AUDIT LOG) - PHIÊN BẢN TỐI ƯU REAL-TIME
 * - Luôn tự động chèn hàng mới nhất lên đầu bảng (Dòng 12)
 * - Tự động kiểm tra và giải phóng bộ nhớ, xóa dòng 3000 nếu vượt ngưỡng
 */
function writeLog(userName, action, taskInfo, oldValue, newValue) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const logSheet = ss.getSheetByName("Lịch sử");
        if (!logSheet) return;

        // 🚀 BƯỚC 1: KIỂM TRA GIỚI HẠN (Nếu đạt hoặc vượt quá 3000 hàng thì tự động xóa dòng 3000)
        let lastRow = logSheet.getLastRow();
        if (lastRow >= 3000) {
            logSheet.deleteRow(3000); // Xóa hàng số 3000 (hàng cũ nhất bị đẩy xuống đáy)
        }

        // 🚀 BƯỚC 2: TẠO NGOẠI LỆ ĐẨY LÊN ĐẦU (Chèn 1 dòng trống ngay tại dòng 12)
        const targetRow = 12;
        logSheet.insertRowBefore(targetRow); // Lệnh chèn dòng trống, tự động đẩy toàn bộ log cũ xuống 1 nấc

        const timestamp = new Date();
        
        // Xử lý hiển thị nếu giá trị rỗng để file Lịch sử nhìn chuyên nghiệp hơn
        const safeOld = (oldValue === "" || oldValue === null || oldValue === undefined) ? "(Trống)" : oldValue;
        const safeNew = (newValue === "" || newValue === null || newValue === undefined) ? "(Trống)" : newValue;
        const changeDetail = safeOld + " -> " + safeNew;

        // 🚀 BƯỚC 3: GHI DỮ LIỆU VÀO ĐÚNG DÒNG 12 VỪA TẠO (Từ cột B đến cột F)
        logSheet.getRange(targetRow, 2, 1, 5).setValues([[
            timestamp, 
            userName, 
            action, 
            taskInfo, 
            changeDetail
        ]]);
        
    } catch (e) {
        console.error("Lỗi ghi log: " + e.toString());
    }
}
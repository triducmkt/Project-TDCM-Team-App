# 00-INDEX.md - HQ Dự án Project TDCM Team App

## TRẠNG THÁI HIỆN TẠI
- **Trạng thái:** Đã đọc toàn bộ source code của app (Google Apps Script). App đang vận hành ổn định ở version v.301.180726 tại website `tdcmedia.netlify.app`. 
- **Vừa xong:** Khởi tạo HQ, đọc hiểu cấu trúc dự án (Cơ chế Optimistic UI, Smart Polling, Debounce Batching, Data Mixer), đọc nội dung sơ bộ các file `.gs` (Backend) và `.html` (Frontend). Nạp bối cảnh toàn cục cho các agent khác (dùng qua `/global`).
- **Bước tiếp theo:** Chờ yêu cầu cụ thể của người dùng để sửa lỗi, thêm tính năng, hoặc điều chỉnh giao diện. (Ví dụ: cần fix lỗi cú pháp `startsWith` trong `AA_ReadMe.gs` hoặc các module cụ thể khác).
- **Cập nhật lần cuối:** Antigravity (27/09/2026 11:20 AM)

---

## KIẾN TRÚC & SCHEMATIC TỔNG QUAN

Ứng dụng là một Google Apps Script (GAS) Web App, phục vụ quản lý team, dự án, tài chính kế toán và media. Hệ thống sử dụng một mô hình frontend-backend độc đáo để tối ưu quota của GAS và mang lại trải nghiệm real-time.

### 5 Trụ Cột Kỹ Thuật (Single Source of Truth & Optimistic UI)
1. **Trạm Điều Phối Trung Tâm (Central AppStore):** Single Source of Truth cho toàn bộ ứng dụng. Mọi thao tác trên UI không gọi thẳng lên server mà qua `dispatchAction()`.
2. **Lõi Giao Diện Lạc Quan & Bóng Ma (Optimistic UI & Ghost RAM):** Feedback tức thì (thay đổi màu sắc, hiện trạng thái loading) và lưu dữ liệu vào RAM tạm với Timestamp (khoảng 15s) làm khiên đỡ.
3. **Cỗ Máy Gom Lô & Chờ Đợi (Debounce Batching):** Gom hành động trong 8 giây (nếu có action mới thì reset bộ đếm). Đủ 8 giây không làm gì thì gửi toàn bộ thay đổi (`batch`) lên Server trong 1 lần (`processBatchSync`).
4. **Cảnh Sát Giao Thông & Xe Tuần Tra (Smart Polling):** Tự động fetch data mới từ server định kỳ (mỗi 8s). Chặn tự động nếu user đang gõ (yielding) để tránh trôi UI.
5. **Động Cơ Trộn Dữ Liệu (The Data Mixer):** Kết hợp dữ liệu vừa fetch về từ Server với các batch đang chờ gửi (Pending Queue) trước khi render ra UI.

### Cấu Trúc File Chính

**Backend (.gs files):**
- `Code.gs`: API chính (doGet, doPost), xử lý logic phân quyền, thao tác với sheet, xử lý webhook Zalo (`guiTinNhanZaloBot`), quản lý media (Drive).
- `AA_ReadMe.gs`: Tài liệu kỹ thuật, kiến trúc nội bộ. 
- `AuditLog.gs`: Hệ thống log (lưu vết 3000 dòng để tối ưu dung lượng).
- `Automation.gs`: Các cron job (Trigger ngầm) như dọn dẹp data cũ (`bot_AutoCloseAiredTasks`), setupNightlyTrigger.

**Frontend (.html files):**
- `Index.html`, `Code.html`: Boilerplate cho Web App.
- `Home.html`: Đăng nhập, Leaderboard.
- `Login.html`: Modal/phần Đăng nhập.
- `Task_list.html`: Core giao diện - Bảng công việc, phân quyền edit inline, xuất PDF phiếu chi (kế toán), modal Note/Chat/Air, Filter.
- `Dashboard.html`, `HR_Dashboard.html`: Biểu đồ tổng quan, Gantt, ma trận Eisenhower, phân loại trạng thái.
- `Dashboard_Modal.html`, `Income_Modal.html`, `Media_Hub_Modal.html`, `Media_Uploader.html`, `Global_Chat_Modal.html`: Các module tiện ích (Kế toán, Media, Chat).
- `Javascript.html`: Thư viện JS xài chung.

## LIÊN KẾT
- Quy tắc hệ thống: `D:\My Agents\Global\GLOBAL-RULES.md`
- Danh mục toàn máy: `D:\My Agents\Global\PROJECTS-INDEX.md`

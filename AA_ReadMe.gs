 /* =========================================================================
   TÀI LIỆU DỰ ÁN: QUẢN LÝ FREELANCER (TRÍ ĐỨC CAR MEDIA)
   Cập nhật: 29/05/2026
   =========================================================================

   🗺️ BẢN VẼ LUỒNG DỮ LIỆU TẬP TRUNG (LOGISTICS SCHEMATIC)
   -------------------------------------------------------------------------
   [ GIAO DIỆN NGƯỜI DÙNG / UI COMPONENTS ] 🖥️
    (Bảng Task, Form Thêm Task, Chat Box, Bộ Lọc, Sidebar)
          │                                     ↑
          │ (1) User thao tác (Click/Save)      │ (5) Bản đồ lắng nghe 
          │                                     │     tự động vẽ lại UI
          ↓                                     │
   [ CÁC HÀM HÀNH ĐỘNG (ACTION DISPATCHERS) ] ⚙️
          │ - Cập nhật UI tạm thời 
          │ - Bơm cờ báo hiệu (Vòng xoay, Đám mây)
          │ - Ném Payload vào Trạm chờ
          ↓
   =========================================================
   📦 TỔNG KHO DỮ LIỆU & TRẠM CHỜ (APPSTORE)
      - state.tasks         - state.syncQueue (Trạm chờ)
      - state.isSyncing     - state.hasUnsavedData
   =========================================================
          │                                     ↑
          │ (2) Động cơ đồng bộ ngầm            │ (4) Cập nhật Data mới 
          │     hút hàng từ Trạm chờ (3s/lần)   │     vào Tổng kho
          ↓                                     │
   [ ĐỘNG CƠ GIAO HÀNG HÀNG LOẠT (SYNC ENGINE) ] 🚚
          │ (3) Gọi google.script.run duy nhất
          ↓
   [ GOOGLE SHEETS (BACKEND) ] 🗄️
  --------------------------------------------------------------------------
  Các kỹ thuật áp dụng cho toàn bộ trang:
  - Luồng dữ liệu tập trung kết hợp mô hình Optimistic UI (Giao diện Lạc quan): giao diện frontend phản hồi ngay lập tức và các chốt chặn an toàn (chuyển trang, tắt tab) đã được kích hoạt
  - Debounce/Smart Queueing (Hàng đợi thông minh): cho phép User "Edit đè liên tục" (Overlapping Edits)
  --------------------------------------------------------------------------
  --------------------------------------------------------------------------
                // 🚀 KIỂM TRA ĐIỀU KIỆN 3: CỘT LINK NỘP (Cột số 31) PHẢI CÓ LINK HTTP/HTTPS
                let linkCell = document.querySelector('td[data-row="' + rowNumber + '"][data-col="31"]');
                let hasValidLink = false;
                if (linkCell) {
                    // Hệ thống render Link qua thẻ <a>, ta bốc href ra kiểm tra để chống hàng giả
                    let aTag = linkCell.querySelector('a');
                    if (aTag) {
                        let href = aTag.getAttribute('href') || "";
                        if (href.startsWith("http://") || href.startsWith("https://")) hasValidLink = true;
                  --->> BÁO LỖI SYNTAX ERROR DẤU NGOẶC " ": href.startsWith("http://")
                  --->> KHẮC PHỤC :                              startsWith('http://')

--------------------------------------------------------------------------------
Bản Đặc Tả Kiến Trúc Hệ Thống: Động cơ Logistics & Giao diện Lạc quan V5 (Optimistic UI - Single Source of Truth).

🏛️ TRIẾT LÝ VẬN HÀNH (THE CORE PHILOSOPHY)
Hệ thống được thiết kế để giải quyết 3 bài toán lớn nhất của Google Apps Script (GAS) và Web App nói chung:

Trải nghiệm tức thời (Zero-Latency): Người dùng thao tác là thấy kết quả ngay lập tức (0.001s), không bao giờ phải chờ vòng xoay tải trang của trình duyệt.

Tiết kiệm Quota API: Gom hàng chục thao tác nhỏ lẻ thành 1 gói hàng duy nhất gửi đi, chống "cháy" băng thông của Google.

Chống đụng độ dữ liệu (Data Conflict): Nhiều người dùng cùng lúc, xe tải đi giao và xe tuần tra lấy dữ liệu về chạy song song nhưng không bao giờ ghi đè lên thao tác đang dang dở của user.

⚙️ 5 TRỤ CỘT CỦA "SIÊU HÀM TRUNG TÂM"
1. Trạm Điều Phối Trung Tâm (Central AppStore)
Chức năng: Là nguồn chân lý duy nhất (Single Source of Truth) của ứng dụng. Mọi dữ liệu từ Server kéo về đều phải nhập vào kho này.

Cơ chế Dispatcher: Mọi cửa sổ, mọi nút bấm, mọi ô input khi có thay đổi KHÔNG ĐƯỢC phép tự ý gọi lệnh gửi lên Server. Tất cả phải đóng gói thành một Action (Gồm: Loại hành động, Tọa độ dòng/cột, Dữ liệu mới) và ném vào AppStore.dispatchAction().

2. Lõi Giao Diện Lạc Quan & Bóng Ma (Optimistic UI & Ghost RAM)
Cơ chế Phản hồi thị giác: Khi user thực hiện thao tác (Sửa chữ, Đánh tick, Gửi chat, Thêm chi phí), giao diện lập tức phản hồi (Đổi màu xanh/cam, làm xám mờ, hiện vòng xoay Spinner).

Bộ nhớ Bóng ma (recentEdits): Mọi giá trị user vừa tạo ra sẽ được lưu vào một bộ nhớ RAM tạm thời đi kèm với "Dấu thời gian" (Timestamp).

Vòng đời 12 - 15 giây: Bóng ma này sẽ tồn tại trong khoảng 15 giây. Nhiệm vụ của nó là làm "khiên đỡ đạn", chặn mọi luồng dữ liệu cũ từ Server kéo về có ý định ghi đè lên ô user vừa sửa khi Server chưa kịp cập nhật.

3. Cỗ Máy Gom Lô & Chờ Đợi (Debounce Batching - Xe Tải Chở Hàng)
Thuật toán 8 Giây (Debounce): Khi có một kiện hàng ném vào Trạm chờ (pendingQueue), đồng hồ đếm ngược 8 giây bắt đầu. Nếu trong 8 giây đó user gõ thêm chữ, click thêm nút, kiện hàng mới tiếp tục ném vào, ĐỒNG HỒ BỊ RESET LẠI TỪ 0.

Khởi hành (Flush Queue): Chỉ khi user NGỪNG TAY hoàn toàn đúng 8 giây, "Xe tải" mới đóng nắp thùng, cấp mã vận đơn (ACT_ID) cho từng kiện hàng và đem tất cả (Batch) gửi lên Google Sheet trong 1 lần duy nhất.

Bảo vệ khi rớt mạng: Nếu xe tải đụng ổ gà (Lỗi Server), nó đem nguyên thùng hàng về lại bãi, giữ nguyên trạng thái UI, và hẹn 8 giây sau tự động chạy lại.

4. Cảnh Sát Giao Thông & Xe Tuần Tra (Smart Polling & Auto-Sync)
Nhiệm vụ: Cứ mỗi 8 giây, hệ thống ngầm gọi một chuyến "Xe tuần tra" lên Server để lấy dữ liệu mới nhất (do người khác sửa) về cập nhật màn hình.

Luật Giao Thông (Tránh đụng xe): Xe tuần tra SẼ BỊ CHẶN LẠI (Yielding) nếu rơi vào 1 trong 3 trường hợp:

User đang nhấp chuột vào ô Input/Select để gõ chữ (Đang bận).

User đang mở các Modal nhạy cảm (như Thêm Task, Lọc Task).

Kho bãi đang có hàng chờ gửi, hoặc "Xe tải chở hàng" đang chạy ngoài đường.

Ngoại lệ (Cửa sổ Chat): Riêng việc mở Modal Chat vẫn cho phép Xe tuần tra chạy để rót tin nhắn mới theo thời gian thực.

5. Động Cơ Trộn Dữ Liệu (The Data Mixer)
Vấn đề: Khi Xe tuần tra đem data chuẩn từ Server về, nếu in thẳng ra màn hình thì những kiện hàng "Đang nằm ở bãi chờ xe tải" sẽ bị biến mất.

Giải pháp: Trước khi hàm Render vẽ bảng, Dữ liệu Server phải đi qua DeliveryManager.applyOptimisticUI(). Tại đây, Data gốc sẽ được trộn (Merge) với:

Hàng trong kho chưa gửi (pendingQueue).

Hàng vừa gửi xong đang được bảo vệ (recentEdits).

Kết quả: Bảng HTML xuất ra màn hình luôn là sự kết hợp hoàn hảo giữa Quá khứ (Server) + Hiện tại (Bóng ma) + Tương lai (Đang chờ gửi), đảm bảo không một text nào bị nhấp nháy (Flickering).

🧩 HỆ SINH THÁI ĐÃ TÍCH HỢP (CÓ THỂ SCALE-UP)
Cấu trúc Siêu hàm này hiện đã xử lý mượt mà và trơn tru các loại định dạng dữ liệu phức tạp nhất:

Dữ liệu Cell cơ bản (Text, Number, Date, Select): Chỉnh sửa Inline-edit nhấp đúp trực tiếp ngoài bảng.

Lưới dữ liệu phức hợp (Lịch Air Task 4x3): Quản lý trạng thái đa chiều, tự động ép trạng thái (Ví dụ: Trùng ngày hôm nay -> Ép task sang "Cần sửa").

Dữ liệu dạng Mảng JSON (Khung Chat/Nhận xét): Tự trộn tin nhắn Server với Bóng ma tin nhắn đang gửi đi. Hỗ trợ tự sinh giao diện tạm thời cho Text, Ảnh (Base64) và File đính kèm. Khả năng "Tự chữa lành" (Xóa rác Base64 cũ khỏi JSON).

Dữ liệu dạng Object JSON (Chi phí MKT Kế toán): Sinh ID giao dịch tự động (xxyyzzzz), quản lý Toggle Checkbox hàng loạt, gom nhóm hiển thị song song với bảng Task, trộn Local JSON với Server JSON siêu tốc.

🔌 TIÊU CHUẨN "CẮM PHÍCH" CHO ỨNG DỤNG TƯƠNG LAI
Sau này, khi bạn tạo bất kỳ App nào mới (App Kho bãi, App Nhân sự, App CRM...), kiến trúc sư (AI) chỉ cần tuân thủ đúng 1 dòng lệnh duy nhất để thiết lập mọi tính năng UI.

Bất kỳ khi nào có thao tác thay đổi dữ liệu, UI chỉ việc thu thập Data và "cắm" vào phích này:
AppStore.dispatchAction({
    actionType: "TÊN_HÀNH_ĐỘNG", // Ví dụ: UPDATE_CELL, ADD_COST, CREATE_TASK
    row: 12,                     // Tọa độ dòng (Nếu có)
    col: 5,                      // Tọa độ cột (Nếu có)
    fieldName: "Tên Trường",     // Tên trường định danh để kích hoạt UI Lạc quan
    payload: { ... }             // Cục dữ liệu mang theo
});
---------------------------------------------------------------------------
gửi file mô tả OptiSync V5 (dạng txt) cho các nền tảng AI viết code khi cần áp dụng mô hình này
----------------------------------------------------------------------------
   🗂️ TỪ ĐIỂN PHÂN CẤP HÀM (CẤP 1 & CẤP 2) DÀNH CHO BẢO TRÌ
   -------------------------------------------------------------------------

   LUỒNG 1: KHỞI TẠO & LẮNG NGHE (Initialization Flow)
   Nhiệm vụ: Cắm điện cho hệ thống, kết nối Giao diện với Tổng kho.
   - Hàm Mẹ: initCentralLogistics() (Chạy 1 lần duy nhất khi mở App).
       + Hàm Con: AppStore.subscribe() (Đăng ký hàm vẽ vào biến dữ liệu).
       + Hàm Con: LISTENER_MAP (Bản đồ chứa các hàm Render thực tế).
           -> Cháu đích tôn: applyCurrentFilters() -> renderFilteredView() (Vẽ bảng).
           -> Cháu đích tôn: renderGlobalChatHistory() (Vẽ khung chat).
           -> Cháu đích tôn: populateFormDropdowns() (Vẽ Menu/Filter).

   LUỒNG 2: ĐỌC DỮ LIỆU LẦN ĐẦU (Read Data Flow)
   Nhiệm vụ: Tải data từ Server khi vào trang và ném thẳng vào Tổng kho.
   - Hàm Mẹ: initTask_list() (Hoặc initHome(), initDashboard()).
       + Hàm Con: google.script.run.getTasksList() (Lấy data từ Server).
       + Hàm Con: AppStore.setState({ tasks: response.tasks }) (Nhập kho).
       + (Luồng tự động): Tổng kho nhận hàng -> Tự kích hoạt LISTENER_MAP["tasks"].

   LUỒNG 3: CỔNG NHẬP HÀNG (Write / Action Dispatchers)
   Nhiệm vụ: Hứng sự kiện User bấm nút. TUYỆT ĐỐI KHÔNG chứa google.script.run.
   - Hàm Mẹ: saveModalNoteChanges(row, colIndex) (Lưu note/link).
   - Hàm Mẹ: saveAirModalChanges(row) (Lưu lưới Air).
   - Hàm Mẹ: submitNewTask() (Tạo task mới).
   - Hàm Mẹ: sendChatMessage() (Nhắn tin).
   - Hàm Mẹ: saveChanges() (Nằm trong activateUnifiedCellEditing - Sửa trên ô).
       + Hàm Con (Bắt buộc): AppStore.dispatchAction(payload) (Ném vào Trạm chờ).
       + Hàm Con (Bắt buộc): Bật CSS vòng xoay đồng bộ lên thẻ HTML tương ứng.

   LUỒNG 4: ĐỘNG CƠ GIAO HÀNG NGẦM (Silent Sync Engine)
   Nhiệm vụ: Tài xế xe tải âm thầm gom hàng từ Trạm chờ gửi lên Google.
   - Hàm Mẹ: AppStore.startSyncEngine() (Chạy vòng lặp setInterval 3 giây/lần).
       + Hàm Con: AppStore.flushQueue() (Đóng gói hàng, bật cờ isSyncing: true).
           -> Cháu đích tôn: google.script.run.processBatchSync(queuePayload).
           -> Cháu đích tôn: Xử lý withSuccessHandler -> Tắt cờ isSyncing: false.

   LUỒNG 5: TRẠM GÁC CHUYỂN TRANG (Navigation Guard)
   Nhiệm vụ: Ngăn user phá hỏng dữ liệu khi tắt hoặc chuyển trang sớm.
   - Hàm Mẹ: loadMenuPage(pageName, el)
       + Hàm Con: Kiểm tra AppStore.getState().hasUnsavedData.
       + Hàm Con: AppStore.subscribe('hasUnsavedData', callback).
       + Hàm Con: executePageLoad(pageName, el).
   - Hàm Mẹ: window.addEventListener('beforeunload').

========================================================================= */
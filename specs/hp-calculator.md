# Specs — Trang tính HP

Trạng thái: đang thu thập yêu cầu, chưa triển khai. Các phần chưa xác nhận được đánh dấu bên dưới.

## Mục tiêu

- Chuyển bảng tham chiếu [table-hp.png](./table-hp.png) thành một trang web tĩnh đơn giản, chỉ một page.
- Ưu tiên có thể host miễn phí qua GitHub; GitHub Pages là phương án dự kiến, chưa cần chốt lúc này.
- Tổ chức code rõ ràng, chia component và logic để dễ tìm, đọc và chỉnh sửa dù chỉ có một page.

## Bố cục đã yêu cầu

- Bên trái là khu vực tham số, đa phần tĩnh: ngày kết thúc sự kiện, level bang hiện tại, level bang tối đa và các tham số liên quan theo bảng.
- Dropdown mức hồi HP của account cũng nằm ở bên trái.
- Dropdown hiện có một option: `320`. Người dùng sẽ cung cấp thêm option sau.
- Khu tham số có nút expand/collapse (mở/thu gọn), mặc định mở. Trên desktop, khi thu gọn thì vùng chính mở rộng vào phần diện tích trống.
- Vùng đầu trang có các config được đánh số `[1] [2] … [+]`, cho phép lưu nhiều bộ thông số trong localStorage.
- Khi vào trang, load config đã lưu nếu có.
- Có 5 ô input tương ứng nhóm Input trong ảnh, ngoài các trường tham số ở bên trái.
- Chưa chốt bố cục chi tiết của vùng nhập liệu và kết quả, giao diện, màu sắc, hoặc hành vi trên điện thoại.

## Năm input đã xác nhận

1. Chiến công hiện có (Current Merit).
2. Max HP reset / day.
3. Máu hiện tại (Current HP).
4. Dự trữ (HP backup).
5. Số bình hiện tại (HP bottle).

Các giá trị trong ảnh chỉ là dữ liệu tham chiếu, chưa được coi là giá trị mặc định.

## Lưu nhiều config trên trình duyệt

Đã yêu cầu:

- Lưu các thông số hiện tại vào localStorage.
- Cho phép có nhiều config, chọn qua các nút đánh số ở đầu trang.
- Nút `[+]` tạo thêm config.
- Khi truy cập lại trang, khôi phục dữ liệu đã lưu nếu có.

Chi tiết hành vi đề xuất, chờ review:

- Tự lưu mỗi khi người dùng chỉnh dữ liệu, không cần nút Lưu riêng.
- Mỗi config gồm 5 ô input và các tham số người dùng được phép thay đổi, gồm lv bang hiện tại, lv max và mức hồi HP. Nếu ngày kết thúc được cho phép chỉnh thì cũng lưu theo config.
- Ghi nhớ config đang chọn để mở lại đúng config đó ở lần truy cập sau.
- Khi chưa có dữ liệu lưu: tạo config `[1]` với giá trị mặc định sẽ chốt sau.
- Nhấn `[+]` tạo bản sao của config đang chọn và chuyển sang config mới, giúp thay đổi để so sánh.
- Chuyển config sẽ cập nhật toàn bộ input, tham số và tính lại kết quả.
- Chỉ lưu dữ liệu đầu vào; kết quả tính lại theo thời điểm hiện tại khi mở trang hoặc chuyển config.
- Trạng thái mở/thu gọn là trạng thái giao diện, mặc định mở khi vào trang; không lưu chung vào config.
- Chưa yêu cầu đổi tên, xóa hoặc đồng bộ config giữa các thiết bị. Dữ liệu localStorage thuộc trình duyệt và địa chỉ website đang dùng.

## Tham số đã xác nhận

- Level bang hiện tại: người dùng nhập.
- Level bang tối đa: dropdown chỉ có hai option `27` và `40`.
- Có bảng lookup ánh xạ level bang sang số bình tương ứng; người dùng sẽ cung cấp sau.
- Quy đổi bình sang HP: `1 bình = 500 HP`.
- Sự kiện kết thúc lúc `08:00` của ngày kết thúc. Chưa xác nhận múi giờ và ngày kết thúc có được chỉnh trên giao diện hay không.

## Tham số và dữ liệu tham chiếu khác trong ảnh

Chưa xác nhận trường nào cố định, trường nào được phép chỉnh trên giao diện:

- Ngày chung kết / ngày kết thúc sự kiện.
- Giới hạn dự trữ HP.
- Bình thêm khi bang đạt max level.
- Tốc độ hồi HP (ảnh ghi đơn vị HP/phút; option ban đầu được yêu cầu là `320`).
- Daily.
- Gói 249 (10$ package).

## Các kết quả xuất hiện trong ảnh — chưa chốt phạm vi và công thức

- Số giờ và số ngày còn lại đến ngày kết thúc.
- HP hồi đến ngày kết thúc.
- HP reset.
- Tổng bình không tính level bang.
- Tổng HP từ bình.
- Tổng.
- Thời gian hồi đầy HP dự trữ.
- Thời gian cần xả và lượng HP cần xả.
- So sánh trường hợp bang max level và không mua thêm bình.
- HP và số bình còn thiếu cho mốc 3.5M, 5M.
- Kết quả trường hợp không nạp.

## Công thức đã xác nhận

- `HP từ bình = số bình × 500`.
- `Thời điểm kết thúc = 08:00 của ngày kết thúc sự kiện`.
- `Số giờ còn lại = (thời điểm kết thúc − thời điểm hiện tại) quy đổi sang giờ`.
- `Thời gian cần xả (giờ) = số giờ còn lại − thời gian hồi đầy (giờ) + 2`.
- `Thời gian hồi đầy (giờ) = (giới hạn dự trữ − HP dự trữ hiện tại) / (mức hồi HP mỗi phút × 60)`.
- `Bình thêm khi bang max level = lookup(lv max) − lookup(lv hiện tại)`.

Chưa chốt các công thức còn lại, cách làm tròn và xử lý khi sự kiện đã kết thúc. Chưa suy ra các quy tắc này từ số mẫu.

## Wireframe đề xuất

Xem [wireframe.md](./wireframe.md). Đây là bản đề xuất bố cục để review, chưa phải giao diện đã chốt.

## Định hướng tổ chức code

- Tách khu vực tham số, nhóm input và phần kết quả thành các component có trách nhiệm rõ ràng.
- Tách công thức tính khỏi phần render giao diện.
- Tập trung các hằng số, cấu hình sự kiện và option mức hồi HP để dễ cập nhật.
- Chưa chốt framework hoặc thư viện.

## Cần làm rõ ở lượt tiếp theo

1. Chờ bảng lookup và mô tả các công thức còn lại, phạm vi kết quả cần giữ.
2. Chưa chốt múi giờ, khả năng sửa ngày kết thúc và các tham số khác, cách làm tròn, cách xử lý giá trị âm hoặc sự kiện đã kết thúc.
3. Review hành vi lưu config: tự lưu, khôi phục config được chọn gần nhất và tạo bản sao khi nhấn `[+]`.

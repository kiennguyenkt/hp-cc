# Wireframe — Trang tính HP

Bản đề xuất để review bố cục, chưa triển khai giao diện. Yêu cầu và công thức nằm trong [hp-calculator.md](./hp-calculator.md).

## Cách đọc

- `[ ... ]`: ô người dùng nhập.
- `[ ... v ]`: dropdown.
- Chữ/số không có ngoặc: thông tin chỉ đọc hoặc kết quả tính.
- `—`: chưa có dữ liệu; không phải số 0.
- Các số trong ô nhập dưới đây chỉ minh họa từ ảnh, chưa chốt mặc định.
- Ngày kết thúc tạm hiển thị chỉ đọc, chờ chốt có cho sửa không.

## Desktop

Cột trái hẹp chứa tham số, mặc định mở và có thể thu gọn. Vùng chính bên phải có 5 ô nhập, kết quả nổi bật và bảng chi tiết. Thanh config nằm trên cả hai cột. Đề xuất kết quả cập nhật ngay khi thay đổi input, không cần nút Tính.

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│ TÍNH HP SỰ KIỆN                                                                     │
│ Ước tính tài nguyên đến ngày kết thúc                                               │
│ Config: [1 •] [2] [3] [+]                                  Đã lưu trên trình duyệt │
├─────────────────────────┬──────────────────────────────────────────────────────────┤
│ THAM SỐ       [Thu gọn]  │ DỮ LIỆU ACCOUNT                                          │
│                         │                                                          │
│ Kết thúc sự kiện        │ Chiến công hiện có                [             939,136 ] │
│ DD/MM/YYYY · 08:00      │ Max HP reset / ngày               [             234,910 ] │
│ Còn — ngày · — giờ      │ HP hiện tại                       [                   0 ] │
│                         │ HP dự trữ                         [             374,620 ] │
│ Lv bang hiện tại        │ Số bình hiện tại                  [               3,499 ] │
│ [                  27 ] │                                                          │
│                         ├──────────────────────────────────────────────────────────┤
│ Lv bang tối đa          │ KẾT QUẢ                                                  │
│ [ 27                v ] │                                                          │
│ Options: 27 / 40        │ Tổng dự kiến                                             │
│                         │                         —                                │
│ Hồi HP / phút           │                                                          │
│ [ 320               v ] │ ┌─────────────────────────┬────────────────────────────┐ │
│                         │ │ Hồi đầy dự trữ          │ Thời gian cần xả           │ │
│ Giới hạn dự trữ      —  │ │ — giờ                   │ — giờ                      │ │
│ Bình thêm ở lv max   —  │ └─────────────────────────┴────────────────────────────┘ │
│                         │ HP cần xả                                             —  │
│ THÔNG SỐ KHÁC           │                                                          │
│ 1 bình = 500 HP         ├──────────────────────────────────────────────────────────┤
│ Daily                —  │ CÁC MỐC MỤC TIÊU                                         │
│ Gói 249              —  │                                                          │
│                         │ Mốc       HP còn thiếu   Bình cần thêm  Bình cần thêm     │
│                         │                          (hiện tại)     (bang max lv)     │
│                         │ 3.5M           —              —              —            │
│                         │ 5M             —              —              —            │
│                         │                                                          │
│                         ├──────────────────────────────────────────────────────────┤
│                         │ CHI TIẾT TÍNH TOÁN                                       │
│                         │ HP hồi đến ngày kết thúc                              —  │
│                         │ HP reset                                              —  │
│                         │ Tổng bình chưa tính tăng lv bang                      —  │
│                         │ Tổng HP từ bình                                       —  │
│                         │                                                          │
│                         │ SO SÁNH                                                  │
│                         │ Bang max lv                                           —  │
│                         │ Không mua thêm bình                                   —  │
│                         │ Không nạp                                             —  │
└─────────────────────────┴──────────────────────────────────────────────────────────┘
```

Khi thu gọn tham số, giữ nút mở lại ở đầu vùng nội dung; phần input và kết quả dùng toàn bộ chiều rộng:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ TÍNH HP SỰ KIỆN                                                               │
│ Config: [1 •] [2] [3] [+]                         Đã lưu trên trình duyệt     │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Mở tham số]                                                                 │
│ DỮ LIỆU ACCOUNT                                                              │
│ ... 5 ô input ...                                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ KẾT QUẢ → CÁC MỐC MỤC TIÊU → CHI TIẾT                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Mobile

Chuyển về một cột, thứ tự: tham số → input → kết quả → mục tiêu → chi tiết. Các mốc chuyển thành từng khối để không cần kéo bảng ngang.

```text
┌──────────────────────────────────┐
│ TÍNH HP SỰ KIỆN                  │
│ Config: [1 •] [2] [3] [+]        │
│ Đã lưu trên trình duyệt          │
├──────────────────────────────────┤
│ THAM SỐ              [Thu gọn]   │
│ Kết thúc: DD/MM/YYYY · 08:00      │
│ Còn — ngày · — giờ               │
│                                  │
│ Lv hiện tại    Lv tối đa          │
│ [        27 ]  [ 27           v ]│
│ Hồi HP / phút  [ 320          v ]│
│ Giới hạn dự trữ                — │
│ Bình thêm ở lv max             — │
│ 1 bình = 500 HP                  │
│ Daily — · Gói 249 —              │
├──────────────────────────────────┤
│ DỮ LIỆU ACCOUNT                  │
│ Chiến công       [     939,136 ] │
│ Max HP reset/ngày[     234,910 ] │
│ HP hiện tại      [           0 ] │
│ HP dự trữ        [     374,620 ] │
│ Số bình          [       3,499 ] │
├──────────────────────────────────┤
│ TỔNG DỰ KIẾN                     │
│                —                 │
│ Hồi đầy dự trữ            — giờ │
│ Thời gian cần xả          — giờ │
│ HP cần xả                     — │
├──────────────────────────────────┤
│ MỐC 3.5M                         │
│ HP còn thiếu                  — │
│ Bình cần thêm · hiện tại      — │
│ Bình cần thêm · bang max lv   — │
│                                  │
│ MỐC 5M                           │
│ (cùng bố cục như mốc 3.5M)       │
├──────────────────────────────────┤
│ CHI TIẾT TÍNH TOÁN               │
│ (cùng nội dung bản desktop)      │
│                                  │
│ SO SÁNH                          │
│ (cùng nội dung bản desktop)      │
└──────────────────────────────────┘
```

## Đề xuất hiển thị và tương tác

- Thanh config luôn ở đầu nội dung, phía trên khu tham số và input. `•` minh họa config đang chọn; giao diện thực tế dùng màu/nền để phân biệt.
- Chọn `[1]`, `[2]`… để khôi phục dữ liệu của config tương ứng và tính lại kết quả.
- Nhấn `[+]` đề xuất tạo bản sao config đang chọn và chọn bản mới. Nếu nhiều config trên mobile, thanh config cho phép cuộn ngang.
- Đề xuất tự lưu vào localStorage khi thay đổi dữ liệu; trạng thái “Đã lưu trên trình duyệt” chỉ hiện khi lưu thành công. Truy cập lại sẽ mở config được chọn gần nhất.
- Nút `[Thu gọn]` ẩn nội dung tham số; `[Mở tham số]` hiện lại. Mỗi lần vào trang mặc định mở, cả desktop và mobile.
- Nền sáng, các nhóm có viền nhẹ; ô nhập có nền riêng để phân biệt với số chỉ đọc.
- Tổng dự kiến nổi bật nhất; thời gian cần xả nằm ngay bên dưới để dễ theo dõi.
- Số căn phải, có phân tách hàng nghìn; đơn vị HP, bình, giờ ghi rõ.
- Màu nhấn tập trung vào tổng và thông tin cần xả; ngưỡng đổi màu chờ quy tắc nghiệp vụ.
- Dropdown hồi HP hiện chỉ có `320`; cấu hình sẵn để bổ sung option sau.
- Thiếu dữ liệu để tính thì hiện `—`, không dùng số mẫu làm kết quả.
- Các kết quả phụ được đưa vào bản nháp để review độ đầy đủ; công thức chưa chốt vẫn theo danh sách chờ trong specs.

## Các lựa chọn bố cục cần review

1. Năm input xếp thành 5 hàng để nhãn dễ đọc và giữ vùng chính gọn.
2. Tham số bên trái trên desktop, đưa lên đầu trên mobile; có thể thu/mở, mặc định mở.
3. Tổng và thời gian cần xả hiện trước bảng mục tiêu; chi tiết tính ở cuối.
4. Bảng mục tiêu tạm so sánh số bình cần thêm ở lv hiện tại và lv max. Cách trình bày này cần xác nhận khi chốt toàn bộ công thức so sánh.
5. Thanh config dùng số thứ tự; tự lưu và tạo bản sao khi nhấn `[+]` là hành vi đề xuất để review.

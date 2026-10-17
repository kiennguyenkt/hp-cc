# Wireframe — Trang tính HP

Mô tả bố cục và tương tác của giao diện hiện tại. Yêu cầu nghiệp vụ và công thức nằm trong [hp-calculator.md](./hp-calculator.md).

## Cách đọc

- `[ ... ]`: ô nhập; `[ ... v ]`: dropdown; `[x]`: checkbox đang chọn.
- `—`: kết quả chưa có dữ liệu, không phải số 0.
- `▸`: accordion đóng; `▾`: accordion mở; `[i]`: tooltip giải thích hoặc công thức.
- Các số trong ô nhập chỉ minh họa bố cục. Bộ mặc định nằm trong tài liệu nghiệp vụ.

## Desktop

Thanh đầu trang nằm trên cả hai cột. Cột trái chứa tham số, mặc định mở và có thể thu gọn. Cột phải chứa dữ liệu account và các vùng kết quả xếp dọc.

```text
TÍNH HP SỰ KIỆN · Bộ dự báo tài nguyên
Cấu hình: [Đổi tên] [Lưu] | [1 •] [2] [+]    [VN] [EN] [TH] [ID] [中文]
Trạng thái lưu: Đã lưu trên trình duyệt / Chưa lưu thay đổi / Không thể lưu

CỘT TRÁI                          CỘT PHẢI
THAM SỐ [Thu gọn]                 DỮ LIỆU ACCOUNT                                  01
Kết thúc [DD/MM/YYYY] · 20:00      Chiến công [939136]  Max HP reset/ngày [234910]  Máu hiện tại [0]
Còn — giờ (— ngày)                HP dự trữ [374620]   Số bình [3499] [i]           Giới hạn [912584]
Lv hiện tại [27]
Lv tối đa [27 v]                  DỰ KIẾN ĐẾN CUỐI EVENT                           02
Hồi HP/phút [320 v]                 ▸ CHI TIẾT TÍNH TOÁN
Bình thêm khi bang max —
                                  Level hiện tại — HP      Bang max level — HP [i]
1 bình = 500 HP                   Hồi đầy dự trữ — giờ | Thời gian cần xả — giờ | HP cần xả —
[x] Nạp gói 249
[x] Mua đủ 5 lượt Daily bằng KC    ▸ SO SÁNH KỊCH BẢN                               03
Daily: 60 + 90 × 5 bình/ngày
Gói 249: 200 + 10 bình/ngày        CÁC MỐC MỤC TIÊU                                 04
                                  MỐC 3.5M                         MỐC 5M
                                  Level hiện tại | Bang max       Level hiện tại | Bang max
                                  HP thiếu —     | —              HP thiếu —     | —
                                  Bình thiếu —   | —              Bình thiếu —   | —
```

Khi thu gọn tham số, nút `[Mở tham số]` nằm trước dữ liệu account; vùng chính dùng toàn bộ chiều rộng. Thứ tự các vùng kết quả giữ nguyên.

Sáu ô account xếp ba cột trên màn hình rộng, hai cột ở kích thước trung gian và một cột trên mobile. Khi vùng kết quả hẹp, hai tổng dự kiến và hai mốc mục tiêu chuyển thành các khối xếp dọc. Các thông tin thời gian cũng xếp dọc trên màn hình hẹp.

## Mobile

Bố cục một cột: thanh đầu trang → tham số → dữ liệu account → dự kiến (chứa chi tiết) → so sánh → các mốc mục tiêu.

```text
TÍNH HP SỰ KIỆN
[Đổi tên] [Lưu] | [1 •] [2] [+]
[VN] [EN] [TH] [ID] [中文]
Trạng thái lưu

THAM SỐ [Thu gọn]
Ngày kết thúc [DD/MM/YYYY] · 20:00
Còn — giờ (— ngày)
Lv hiện tại [27] · Lv tối đa [27 v]
Hồi HP/phút [320 v]
Bình thêm khi bang max —
1 bình = 500 HP
[x] Nạp gói 249
[x] Mua đủ 5 lượt Daily bằng KC
Ghi chú nguồn bình

DỮ LIỆU ACCOUNT
Chiến công [939136]
Max HP reset/ngày [234910]
Máu hiện tại [0]
HP dự trữ [374620]
Số bình [3499] [i]
Giới hạn dự trữ [912584]

DỰ KIẾN ĐẾN CUỐI EVENT
  ▸ CHI TIẾT TÍNH TOÁN

Level hiện tại — HP
Bang max level — HP [i]
Hồi đầy dự trữ — giờ
Thời gian cần xả — giờ
HP cần xả —

▸ SO SÁNH KỊCH BẢN

CÁC MỐC MỤC TIÊU
MỐC 3.5M
Level hiện tại        Bang max level
HP thiếu —           HP thiếu —
Bình thiếu —         Bình thiếu —

MỐC 5M
(cùng nội dung như mốc 3.5M)
```

Trên màn hình rất hẹp, hai nhóm level trong mỗi mốc cũng xếp dọc. Thanh cấu hình cho phép cuộn ngang khi có nhiều cấu hình.

## Accordion chi tiết và so sánh

Chi tiết tính toán nằm **ngay dưới tiêu đề Dự kiến đến cuối event**, trước hai tổng dự kiến. Khi mở, nội dung vẫn nằm trong cùng thẻ dự kiến:

```text
DỰ KIẾN ĐẾN CUỐI EVENT
  ▾ CHI TIẾT TÍNH TOÁN
    Tổng bình dự kiến [i]                 —
    Tổng HP từ bình [i]                   —
    HP reset [i]                          —
    Tổng HP hồi tới ngày kết thúc [i]     —

Level hiện tại — HP       Bang max level — HP [i]
Hồi đầy dự trữ — giờ | Thời gian cần xả — giờ | HP cần xả —
```

So sánh kịch bản là một thẻ accordion riêng, ngay sau dự kiến và trước các mốc mục tiêu. Khi mở trên desktop:

```text
▾ SO SÁNH KỊCH BẢN
                                         Level hiện tại    Bang max level [i]
Mua gói 249 + mua Daily 90 × 5 bình [i]           —                 —
Không nạp gói 249 [i]                            —                 —
Không mua Daily bằng KC [i]                      —                 —
Không mua gói 249 và Daily 90 × 5 bình [i]        —                 —
```

Kịch bản khớp hai checkbox được tô nền và gắn nhãn “Đang áp dụng”. Trên vùng kết quả hẹp, tên mỗi kịch bản chiếm một hàng; hai giá trị nằm bên dưới, mỗi giá trị có nhãn level tương ứng. Tooltip cạnh từng kịch bản giữ công thức; tooltip ở tiêu đề bang max thể hiện phần HP/bình tăng thêm.

Cả hai accordion mặc định **thu gọn khi tải trang**, mở/đóng độc lập bằng chuột, cảm ứng, Enter hoặc Space. Mũi tên thể hiện trạng thái, viền focus giúp nhận biết vị trí bàn phím. Thay đổi input, checkbox, cấu hình, ngôn ngữ hoặc thời gian không tự đổi trạng thái accordion. Hai tổng dự kiến và thông tin thời gian luôn hiển thị dù chi tiết đóng.

## Hiển thị và tương tác chung

- Thanh đầu trang có nút đổi tên và lưu cấu hình, các tab cấu hình, nút nhân bản `[+]`, trạng thái lưu và năm lựa chọn ngôn ngữ. Tab dùng tên cấu hình hoặc số thứ tự khi chưa có tên; cấu hình đang chọn có màu nhấn.
- `[+]` sao chép cấu hình đang chọn và chuyển sang bản mới. `[Lưu]` lưu cấu hình hiện tại vào localStorage; trạng thái phản ánh dữ liệu đã lưu, thay đổi chưa lưu hoặc lỗi lưu. Đổi tên dùng hộp thoại có ô tên và nút hủy/xác nhận.
- Ngôn ngữ mặc định là tiếng Việt, được lưu riêng và áp dụng cho toàn bộ giao diện.
- Tham số mặc định mở mỗi lần tải trang trên cả desktop và mobile; thu gọn tham số không ẩn dữ liệu account hoặc kết quả.
- Kết quả tính lại ngay khi thay đổi input. Thời gian cập nhật mỗi 5 giây và khi trở lại tab/cửa sổ.
- Tổng dự kiến dùng nền màu nhấn và số lớn; thời gian cần xả được nhấn riêng. Ô nhập có nền riêng để phân biệt với kết quả chỉ đọc.
- Số kết quả có phân tách hàng nghìn theo ngôn ngữ; số trong ô nhập không có dấu phân tách. Đơn vị HP, bình và giờ thể hiện rõ.
- Tooltip hiển thị khi trỏ chuột hoặc focus vào `[i]`. Tooltip số bình hiện tại giải thích snapshot đã gồm mọi nguồn đã nhận; dự báo chỉ cộng phần tương lai. Tooltip bang max giải thích phần chênh lệch thưởng, tránh cộng lại phần đã nhận.
- Hai checkbox nạp gói 249 và mua Daily bằng kim cương độc lập, tác động đến tổng dự kiến và các mốc mục tiêu. Các nguồn bình và công thức tuân theo tài liệu nghiệp vụ.
- Khi nhập, giữ nguyên chuỗi đang sửa; kết quả phụ thuộc hiện `—` nếu chưa parse được. Khi blur, chuẩn hóa số theo quy tắc nghiệp vụ. HP dự trữ vượt giới hạn được điều chỉnh về giới hạn và có popup giải thích.
- Thiếu dữ liệu thì hiển thị `—`; không dùng số minh họa làm kết quả.

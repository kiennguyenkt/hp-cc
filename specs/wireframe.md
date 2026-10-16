# Wireframe — Trang tính HP

Bản đề xuất để review bố cục, chưa triển khai giao diện. Yêu cầu và công thức nằm trong [hp-calculator.md](./hp-calculator.md).

## Cách đọc

- `[ ... ]`: ô người dùng nhập.
- `[ ... v ]`: dropdown.
- Chữ/số không có ngoặc: thông tin chỉ đọc hoặc kết quả tính.
- `—`: chưa có dữ liệu; không phải số 0.
- Các số trong ô nhập dưới đây chỉ minh họa bố cục; bộ mặc định chính thức nằm trong [hp-calculator.md](./hp-calculator.md).
- Ngày kết thúc là date picker có thể chỉnh sửa.

## Desktop

Cột trái hẹp chứa tham số, mặc định mở và có thể thu gọn. Vùng chính bên phải có 6 ô nhập, kết quả nổi bật và bảng chi tiết. Thanh config nằm trên cả hai cột. Kết quả cập nhật ngay khi thay đổi input và tự cập nhật thời gian mỗi 5 giây, không cần nút Tính.

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│ TÍNH HP SỰ KIỆN                                                                     │
│ Ước tính tài nguyên đến ngày kết thúc                                               │
│ Config: [1 •] [2] [3] [+]               Language: [VN v]   Đã lưu trên trình duyệt │
├─────────────────────────┬──────────────────────────────────────────────────────────┤
│ THAM SỐ       [Thu gọn]  │ DỮ LIỆU ACCOUNT                                          │
│                         │                                                          │
│ Kết thúc sự kiện        │ Chiến công hiện có                [             939,136 ] │
│ [ DD/MM/YYYY ] · 08:00  │ Max HP reset / ngày               [              234910 ] │
│ Còn — ngày · — giờ      │ HP hiện tại                       [                   0 ] │
│                         │ HP dự trữ                         [              374620 ] │
│ Lv bang hiện tại        │ Số bình hiện tại              [i] [                3499 ] │
│ [                  27 ] │                                                          │
│                         │ Giới hạn dự trữ HP                [              912584 ] │
│                         ├──────────────────────────────────────────────────────────┤
│ Lv bang tối đa          │ KẾT QUẢ                                                  │
│ [ 27                v ] │                                                          │
│ Options: 27 / 40        │ Tổng dự kiến đến cuối event — level hiện tại             │
│                         │                         —                                │
│ Hồi HP / phút           │                                                          │
│ [ 320               v ] │ ┌─────────────────────────┬────────────────────────────┐ │
│                         │ │ Hồi đầy dự trữ          │ Thời gian cần xả           │ │
│                         │ │ — giờ                   │ — giờ                      │ │
│ Bình thêm ở lv max   —  │ └─────────────────────────┴────────────────────────────┘ │
│                         │ HP cần xả                                             —  │
│ THÔNG SỐ KHÁC           │                                                          │
│ 1 bình = 500 HP         ├──────────────────────────────────────────────────────────┤
│ [x] Nạp gói 249         │ CÁC MỐC MỤC TIÊU                                        │
│ [x] Mua 5 lượt Daily KC │ Mốc       HP thiếu  Bình thiếu  HP thiếu  Bình thiếu       │
│ Daily: 60 + 90 × 5/ngày │           lv hiện tại           bang max lv               │
│ Gói 249: 200 + 10/ngày  │ 3.5M          —          —          —          —           │
│                         │ 5M            —          —          —          —           │
│                         │                                                          │
│                         ├──────────────────────────────────────────────────────────┤
│                         │ CHI TIẾT TÍNH TOÁN                                       │
│                         │ HP hồi đến ngày kết thúc                              —  │
│                         │ HP reset                                              —  │
│                         │ Tổng bình đến end (chưa cộng tăng lv bang)            —  │
│                         │ Tổng HP từ bình                                       —  │
│                         │                                                          │
│                         │ SO SÁNH                    Level hiện tại    Bang max │
│                         │ Bật cả hai                            —            — │
│                         │ Không nạp gói 249                     —            — │
│                         │ Không mua Daily bằng kim cương        —            — │
│                         │ Tắt cả hai                            —            — │
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
│ ... 6 ô input ...                                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ KẾT QUẢ → CÁC MỐC MỤC TIÊU → CHI TIẾT                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Mobile

Chuyển về một cột, thứ tự: tham số → input → kết quả → mục tiêu → chi tiết. Các mốc chuyển thành từng khối để không cần kéo bảng ngang.

```text
┌──────────────────────────────────┐
│ TÍNH HP SỰ KIỆN                  │
│ Config: [1 •] [2] [3] [+] [VN v] │
│ Đã lưu trên trình duyệt          │
├──────────────────────────────────┤
│ THAM SỐ              [Thu gọn]   │
│ Kết thúc: [DD/MM/YYYY] · 08:00    │
│ Còn — ngày · — giờ               │
│                                  │
│ Lv hiện tại    Lv tối đa          │
│ [        27 ]  [ 27           v ]│
│ Hồi HP / phút  [ 320          v ]│
│ Bình thêm ở lv max             — │
│ 1 bình = 500 HP                  │
│ [x] Nạp gói 249                  │
│ [x] Mua 5 lượt Daily bằng KC     │
│ Daily: 60 + 90 × 5 bình/ngày     │
│ Gói 249: 200 trả phí + 10 free/ngày│
├──────────────────────────────────┤
│ DỮ LIỆU ACCOUNT                  │
│ Chiến công       [      939136 ] │
│ Max HP reset/ngày[      234910 ] │
│ HP hiện tại      [           0 ] │
│ HP dự trữ        [      374620 ] │
│ Số bình       [i] [        3499 ] │
│ Giới hạn dự trữ  [      912584 ] │
├──────────────────────────────────┤
│ DỰ KIẾN ĐẾN END · LEVEL HIỆN TẠI │
│                —                 │
│ Hồi đầy dự trữ            — giờ │
│ Thời gian cần xả          — giờ │
│ HP cần xả                     — │
├──────────────────────────────────┤
│ MỐC 3.5M                         │
│ HP thiếu · level hiện tại      — │
│ Bình thiếu · level hiện tại    — │
│ HP thiếu · bang max lv         — │
│ Bình thiếu · bang max lv       — │
│                                  │
│ MỐC 5M                           │
│ (cùng bố cục như mốc 3.5M)       │
├──────────────────────────────────┤
│ CHI TIẾT TÍNH TOÁN               │
│ (cùng nội dung bản desktop)      │
│                                  │
│ SO SÁNH                          │
│ BẬT CẢ HAI                       │
│ Level hiện tại                 — │
│ Bang max                       — │
│ KHÔNG NẠP GÓI 249                │
│ Level hiện tại                 — │
│ Bang max                       — │
│ KHÔNG MUA DAILY BẰNG KC          │
│ Level hiện tại                 — │
│ Bang max                       — │
│ TẮT CẢ HAI                       │
│ Level hiện tại                 — │
│ Bang max                       — │
└──────────────────────────────────┘
```

## Đề xuất hiển thị và tương tác

- Thanh config luôn ở đầu nội dung, phía trên khu tham số và input. `•` minh họa config đang chọn; giao diện thực tế dùng màu/nền để phân biệt.
- Bộ chọn ngôn ngữ `VN / EN` nằm trên thanh đầu trang. Mặc định là `VN`; lựa chọn được lưu riêng trong localStorage và áp dụng cho toàn bộ giao diện, không theo từng config.
- Chọn `[1]`, `[2]`… để khôi phục dữ liệu của config tương ứng và tính lại kết quả.
- Nhấn `[+]` tạo bản sao config đang chọn và chọn bản mới. Nếu nhiều config trên mobile, thanh config cho phép cuộn ngang.
- Tự lưu config đang chọn vào localStorage sau `2 giây` không có thay đổi mới. Trước khi chuyển/clone config, lưu ngay thay đổi đang chờ. Trạng thái “Đã lưu trên trình duyệt” chỉ hiện khi lưu thành công; truy cập lại sẽ mở config được chọn gần nhất.
- Nút `[Thu gọn]` ẩn nội dung tham số; `[Mở tham số]` hiện lại. Mỗi lần vào trang mặc định mở, cả desktop và mobile.
- Nền sáng, các nhóm có viền nhẹ; ô nhập có nền riêng để phân biệt với số chỉ đọc.
- Tổng dự kiến nổi bật nhất; thời gian cần xả nằm ngay bên dưới để dễ theo dõi.
- Số kết quả căn phải và có phân tách hàng nghìn; số trong ô input dùng chữ số thuần, không có dấu phân tách. Đơn vị HP, bình, giờ ghi rõ.
- Màu nhấn tập trung vào tổng và thông tin cần xả; ngưỡng đổi màu chờ quy tắc nghiệp vụ.
- Dropdown hồi HP hiện chỉ có `320`; cấu hình sẵn để bổ sung option sau.
- Hai checkbox độc lập luôn hiển thị: nạp gói 249 và mua đủ `5` lượt bình bằng kim cương mỗi ngày. Config mới mặc định chọn cả hai. Gói 249 gồm `200` bình trả phí và `10` bình free mỗi ngày; mỗi lượt mua bằng kim cương có `90` bình.
- `60` bình/ngày từ xem quảng cáo luôn được tính và không có checkbox tắt.
- Hai checkbox tác động trực tiếp đến tổng dự kiến chính và HP/bình còn thiếu ở các mốc `3.5M`, `5M` cho cả level hiện tại và bang max.
- Khu so sánh luôn hiển thị đủ bốn scenario: bật cả hai, không nạp gói 249, không mua bình Daily bằng kim cương và tắt cả hai. Mỗi scenario có hai giá trị level hiện tại/bang max; scenario khớp trạng thái checkbox hiện tại là dữ liệu dùng cho kết quả chính.
- Icon `[i]` mở popover giải thích rằng số bình hiện tại đã gồm mọi nguồn đã nhận đến hiện tại; projection chỉ cộng phần tương lai và chênh lệch thưởng khi bang lên max.
- Khi input đang focus, giữ nguyên chuỗi người dùng nhập và không tự sửa. Nếu parse được thì kết quả dùng giá trị đã floor; nếu chưa parse được thì kết quả phụ thuộc hiện `—`. Khi blur mới trim khoảng trắng, làm tròn xuống và clamp số âm về `0`; level hiện tại còn được clamp theo level tối đa. Nếu HP dự trữ vượt giới hạn dự trữ khi blur, clamp HP dự trữ về giới hạn và mở popup lỗi giải thích.
- Thiếu dữ liệu để tính thì hiện `—`, không dùng số mẫu làm kết quả.
- Các kết quả phụ và công thức tuân theo spec nghiệp vụ.

## Các lựa chọn bố cục cần review

1. Sáu input xếp thành 6 hàng để nhãn dễ đọc và giữ vùng chính gọn.
2. Tham số bên trái trên desktop, đưa lên đầu trên mobile; có thể thu/mở, mặc định mở.
3. Tổng và thời gian cần xả hiện trước bảng mục tiêu; chi tiết tính ở cuối.
4. Bảng mục tiêu hiển thị cả HP thiếu và bình thiếu cho level hiện tại lẫn bang max level; khu so sánh hiển thị bốn scenario × hai mức level.
5. Thanh config dùng số thứ tự; tự lưu sau `2 giây` và tạo bản sao khi nhấn `[+]`.

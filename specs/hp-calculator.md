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
- Vùng đầu trang có lựa chọn ngôn ngữ `VN / EN`. Giao diện hỗ trợ đầy đủ tiếng Việt và tiếng Anh.
- Khi vào trang, load config đã lưu nếu có.
- Có 6 ô input account: 5 ô trong nhóm Input của ảnh và `Giới hạn dự trữ HP`.
- Chưa chốt bố cục chi tiết của vùng nhập liệu và kết quả, giao diện, màu sắc, hoặc hành vi trên điện thoại.

## Sáu input đã xác nhận

1. Chiến công hiện có (Current Merit).
2. Max HP reset / day.
3. Máu hiện tại (Current HP).
4. Dự trữ (HP backup).
5. Số bình hiện tại (HP bottle).
6. Giới hạn dự trữ HP (HP recovery limit).

Mọi input là số nguyên không âm. Ô input hiển thị số dạng chữ số thuần, không dùng dấu chấm hoặc dấu phẩy phân tách hàng nghìn. Trong lúc ô đang focus, giữ nguyên chuỗi người dùng đang nhập và không trim, floor, clamp hay tự sửa nội dung. Nếu chuỗi hiện tại parse được thành số, kết quả dùng giá trị đã floor để tính nhưng không ghi ngược giá trị đã chuẩn hóa vào ô; nếu chưa parse được thì các kết quả phụ thuộc hiển thị `—`. Khi blur, trim khoảng trắng, làm tròn xuống nếu có phần thập phân và chuẩn hóa số âm thành `0`. Ô trống hoặc dữ liệu vẫn chưa hợp lệ sau blur chỉ làm các kết quả phụ thuộc vào ô đó hiển thị `—`; các kết quả không phụ thuộc vẫn được tính bình thường.

Default hard-code của config đầu tiên: Current Merit `0`, Max HP reset/day `237300`, Current HP `237469`, HP backup `31842`, số bình hiện tại `2000`, giới hạn dự trữ `949876`, level bang hiện tại `0`, level bang tối đa `27` và ngày kết thúc `18/10/2026`. Các giá trị khác trong ảnh chỉ là dữ liệu đối chiếu công thức, không mặc nhiên là default.

`HP backup` không được lớn hơn `Giới hạn dự trữ HP`. Khi blur, nếu người dùng nhập HP backup lớn hơn giới hạn, hoặc hạ giới hạn xuống thấp hơn HP backup hiện tại, hệ thống clamp HP backup về đúng giới hạn và hiển thị popup lỗi để giải thích việc điều chỉnh.

## Lưu nhiều config trên trình duyệt

Đã yêu cầu:

- Lưu các thông số hiện tại vào localStorage.
- Cho phép có nhiều config, chọn qua các nút đánh số ở đầu trang.
- Nút `[+]` tạo thêm config.
- Khi truy cập lại trang, khôi phục dữ liệu đã lưu nếu có.

Chi tiết hành vi đã xác nhận:

- Lưu thủ công: nút `[Lưu]` ghi config đang chọn vào localStorage. Không tự lưu khi sửa input, đổi tên, chuyển config hoặc clone.
- Mỗi config gồm 6 ô input, ngày kết thúc và các tham số người dùng được phép thay đổi: lv bang hiện tại, lv max, mức hồi HP, lựa chọn mua gói 249 và lựa chọn mua bình Daily bằng kim cương.
- Khi bấm `[Lưu]`, ghi nhớ config đang chọn để mở lại config đó ở lần truy cập sau. Chuyển tab config chỉ cập nhật state trong phiên hiện tại.
- Khi chưa có dữ liệu lưu: tạo config `[1]` với bộ giá trị mặc định đã chốt ở trên.
- Nhấn `[+]` tạo bản sao của config đang chọn và chuyển sang config mới, giúp thay đổi để so sánh.
- Chuyển config giữ nguyên các thay đổi chưa lưu của từng config trong state; quay lại tab vẫn thấy dữ liệu đang sửa. Clone dùng dữ liệu hiện tại, kể cả phần chưa lưu.
- Reload hoặc đóng trang sẽ mất các thay đổi và config mới chưa được lưu. Khi mở lại, khôi phục dữ liệu tại lần lưu gần nhất của từng config; đây là hành vi được chấp nhận.
- Chuyển config sẽ cập nhật toàn bộ input, tham số và tính lại kết quả.
- Chỉ lưu dữ liệu đầu vào; kết quả tính lại theo thời điểm hiện tại khi mở trang hoặc chuyển config.
- Trạng thái mở/thu gọn là trạng thái giao diện, mặc định mở khi vào trang; không lưu chung vào config.
- Ngôn ngữ là tùy chọn giao diện dùng chung, không thuộc từng config; lưu lựa chọn `VN / EN` riêng trong localStorage. Mặc định là `VN` khi chưa có lựa chọn đã lưu.
- Chưa yêu cầu đổi tên, xóa hoặc đồng bộ config giữa các thiết bị. Dữ liệu localStorage thuộc trình duyệt và địa chỉ website đang dùng.

## Tham số đã xác nhận

- Level bang hiện tại: người dùng nhập.
- Level bang tối đa: dropdown chỉ có hai option `27` và `40`.
- Có bảng lookup ánh xạ level bang sang tổng số bình tích lũy tại level đó; xem bảng bên dưới.
- Quy đổi bình sang HP: `1 bình = 500 HP`.
- Sự kiện kết thúc lúc `20:00` của ngày kết thúc theo múi giờ cục bộ của thiết bị/trình duyệt. Ngày kết thúc được chỉnh bằng date picker và lưu theo config.
- Level bang hiện tại là số nguyên không âm và không được lớn hơn level bang tối đa. Khi blur, trim khoảng trắng, làm tròn xuống và clamp vào khoảng từ `0` đến level tối đa. Khi đổi level tối đa xuống thấp hơn level hiện tại, tự clamp level hiện tại về level tối đa mới.

### Lookup bình theo level bang

`Bình thêm` là số bình nhận tại level đó. `Tổng tích lũy` là tổng số bình nhận được từ level 0 đến level tương ứng và là giá trị dùng trong công thức so sánh bang max level.

| Level | Bình thêm | Tổng tích lũy |
| ----: | --------: | ------------: |
|     0 |         0 |             0 |
|     1 |         3 |             3 |
|     2 |         8 |            11 |
|     3 |        13 |            24 |
|     4 |        18 |            42 |
|     5 |        23 |            65 |
|     6 |        28 |            93 |
|     7 |        33 |           126 |
|     8 |        38 |           164 |
|     9 |        43 |           207 |
|    10 |        48 |           255 |
|    11 |        51 |           306 |
|    12 |        54 |           360 |
|    13 |        57 |           417 |
|    14 |        60 |           477 |
|    15 |        63 |           540 |
|    16 |        66 |           606 |
|    17 |        69 |           675 |
|    18 |        72 |           747 |
|    19 |        75 |           822 |
|    20 |        78 |           900 |
|    21 |        81 |           981 |
|    22 |        83 |          1064 |
|    23 |        85 |          1149 |
|    24 |        87 |          1236 |
|    25 |        89 |          1325 |
|    26 |        91 |          1416 |
|    27 |        93 |          1509 |
|    28 |        95 |          1604 |
|    29 |        97 |          1701 |
|    30 |        99 |          1800 |
|    31 |       101 |          1901 |
|    32 |       103 |          2004 |
|    33 |       105 |          2109 |
|    34 |       107 |          2216 |
|    35 |       109 |          2325 |
|    36 |       111 |          2436 |
|    37 |       113 |          2549 |
|    38 |       115 |          2664 |
|    39 |       117 |          2781 |
|    40 |       119 |          2900 |

## Tham số và dữ liệu tham chiếu khác trong ảnh

Các tham số dưới đây đã xác nhận về ý nghĩa:

- Ngày chung kết / ngày kết thúc sự kiện: chỉnh bằng date picker.
- Giới hạn dự trữ HP: input account.
- Bình thêm khi bang đạt max level, tính từ lookup level bang.
- Tốc độ hồi HP (ảnh ghi đơn vị HP/phút; option ban đầu được yêu cầu là `320`).
- Daily: mặc định `510 bình/ngày`, gồm `60` bình bắt buộc từ xem quảng cáo và `90 × 5` bình mua bằng kim cương.
- Nhóm gói 249 có `210 bình/ngày` trong event cố định `3 ngày`: `200 bình/ngày` đến từ phần nạp và `10 bình/ngày` là phần free luôn được nhận. Người dùng có thể bỏ chọn mua gói 249; lựa chọn này chỉ loại `200` bình trả phí, không loại `10` bình free.

Hai checkbox độc lập luôn hiển thị, không có chế độ cơ bản/nâng cao:

1. Nạp/không nạp gói 249.
2. Mua/không mua đủ `90 × 5` bình bằng kim cương mỗi ngày.

Config mới mặc định chọn cả hai checkbox. Phần `60` bình/ngày từ xem quảng cáo là bắt buộc, luôn được tính và không có tùy chọn tắt. Dùng checkbox native thay vì toggle switch.

Trạng thái hiện tại của hai checkbox tác động trực tiếp đến `Tổng bình đến end`, hai tổng dự kiến ở level hiện tại/bang max, và HP/bình còn thiếu ở cả hai mốc `3.5M` và `5M`.

`Số bình hiện tại` là snapshot tổng số bình account đang sở hữu tại thời điểm nhập. Nó đã bao gồm mọi nguồn đã nhận đến hiện tại, trong đó có thưởng level bang hiện tại, phần gói 249 đã nhận và bình mua bằng kim cương đã nhận (nếu có). Không cộng lại các phần quá khứ này vào tổng vì sẽ bị tính trùng.

UI cần có icon thông tin/popover cạnh `Số bình hiện tại`, `Tổng bình` và phần so sánh bang max để giải thích quy tắc snapshot và chống cộng trùng này.

## Các kết quả cần hiển thị

- Số giờ và số ngày còn lại đến ngày kết thúc.
- HP hồi đến ngày kết thúc.
- HP reset.
- Tổng bình đến end, chưa cộng phần chênh lệch khi bang lên max level.
- Tổng HP từ bình.
- Tổng dự kiến đến cuối event — level hiện tại.
- Thời gian hồi đầy HP dự trữ.
- Thời gian cần xả và lượng HP cần xả.
- Tổng dự kiến đến cuối event ở level hiện tại và khi bang đạt max level để tham chiếu.
- Bảng so sánh bốn trường hợp: bật cả hai, không nạp gói 249, không mua bình Daily bằng kim cương và tắt cả hai. Mỗi trường hợp hiển thị hai cột level hiện tại/bang max.
- HP và số bình còn thiếu cho mốc 3.5M, 5M.

## Công thức đã xác nhận

- `HP từ bình = số bình × 500`.
- `Thời điểm kết thúc = 20:00 của ngày kết thúc sự kiện` theo múi giờ cục bộ của thiết bị/trình duyệt.
- `Thời điểm bắt đầu tính = 00:00 của (ngày kết thúc − 2 ngày)` theo múi giờ cục bộ. Event chạy trong cửa sổ cố định `3 ngày` gồm hai ngày trước ngày kết thúc và ngày kết thúc — ví dụ chọn ngày kết thúc `30` thì cửa sổ là các ngày `28–30`; cửa sổ này trùng với thời lượng cố định `3 ngày` của nhóm gói 249. Mọi thời gian trước thời điểm bắt đầu tính không được cộng vào kết quả.
- `Số ngày còn lại = MIN(3, MAX(0, ngày kết thúc − ngày hôm nay))`, tương đương công thức Excel `=MIN(3, MAX(0, H4 - TODAY()))`. `Ngày hôm nay` và ngày kết thúc đều được hiểu theo múi giờ cục bộ của thiết bị/trình duyệt. Đây là chênh lệch ngày lịch, không suy ra từ số giờ còn lại; mỗi ngày còn lại vẫn cộng trọn Daily, HP reset và gói 249, còn ngày kết thúc không cộng thêm các nguồn theo ngày này. Khi event chưa bắt đầu (trước thời điểm bắt đầu tính), số ngày còn lại luôn bằng `3`.
- `Số phút còn lại = MAX(0, ROUNDDOWN((thời điểm kết thúc − MAX(thời điểm hiện tại, thời điểm bắt đầu tính)) quy đổi sang phút, 0))`. Khi event chưa bắt đầu, số phút còn lại luôn bằng `4080` (tức `68` giờ).
- `Số giờ còn lại = MAX(0, ROUND((thời điểm kết thúc − MAX(thời điểm hiện tại, thời điểm bắt đầu tính)) × 24, 0))`, tương đương công thức Excel `=MAX(0, ROUND((H4 + TIME(20, 0, 0) - MAX(NOW(), H4 - 2)) * 24, 0))` với `H4` là ngày kết thúc.
- `HP hồi đến ngày kết thúc = số giờ còn lại × 60 × mức hồi HP mỗi phút`. Số giờ dùng trong công thức là số giờ nguyên đang hiển thị trên giao diện. HP hồi không bị khống chế bởi giới hạn dự trữ.
- `HP reset = số ngày còn lại × Max HP reset / day`.
- `Số bình Daily / ngày = 60 + (mua bình bằng kim cương ? 90 × 5 : 0)`.
- Khi checkbox mua bình bằng kim cương được chọn, `Số bình Daily / ngày = 510`.
- `Bình Daily tương lai = số ngày còn lại × số bình Daily / ngày`.
- `Bình nhóm 249 tương lai = số ngày còn lại × (mua gói 249 ? 210 : 10)`. Số ngày package còn lại chính là số ngày còn lại của event, không cần ngày kích hoạt hoặc bộ đếm package riêng. Trong đó `200` bình/ngày là phần trả phí và `10` bình/ngày là phần free. Phần đã nhận đến hiện tại đã nằm trong `Số bình hiện tại`.
- `Tổng bình đến end = số bình hiện tại + bình Daily tương lai + bình gói 249 còn lại`.
- `Tổng HP từ bình = Tổng bình đến end × 500`.
- `Tổng dự kiến đến cuối event — level hiện tại = Current Merit + Current HP + HP backup + Tổng HP từ bình + HP reset + HP hồi`.
- `Thời gian cần xả (giờ) = số giờ còn lại − thời gian hồi đầy (giờ) + 2`.
- `2 giờ` trong công thức thời gian cần xả là business constant cố định.
- `Thời gian hồi đầy (giờ) = ROUNDDOWN((giới hạn dự trữ − HP dự trữ hiện tại) / (mức hồi HP mỗi phút × 60), 0)`.
- `HP cần xả = thời gian cần xả × mức hồi HP mỗi phút × 60`.
- `Thời gian cần xả` và `HP cần xả` được phép hiển thị số âm; không clamp hai kết quả này về `0`.
- `Bình thêm khi bang max level = lookup(lv max).total − lookup(lv hiện tại).total`.
- `HP thêm khi bang max level = bình thêm khi bang max level × 500`.
- `Tổng dự kiến đến cuối event — bang max level = Tổng dự kiến đến cuối event — level hiện tại + HP thêm khi bang max level`.
- Trong các công thức scenario, `Tổng mặc định` là tổng dự kiến với cả gói 249 và `5` lượt bình Daily bằng kim cương đều bật. Tính riêng một `Tổng mặc định` cho level hiện tại và một `Tổng mặc định` cho bang max.
- Với cả hai cột level hiện tại và bang max: `Tổng không nạp gói 249 = Tổng mặc định cùng cột − (số ngày còn lại × 200 × 500)`. Scenario này chỉ loại phần `200 bình/ngày` trả phí trong những ngày còn lại, không trừ phần đã nhận trong snapshot và vẫn giữ `10 bình free/ngày`. Không nạp gói 249 không đồng nghĩa với không mua bình Daily bằng kim cương.
- Với cả hai cột: `Tổng không mua bình Daily bằng kim cương = Tổng mặc định cùng cột − (số ngày còn lại × 90 × 5 × 500)`; phần `60 bình/ngày` từ quảng cáo vẫn được giữ lại.
- Với cả hai cột: `Tổng tắt cả hai = Tổng mặc định cùng cột − (số ngày còn lại × 200 × 500) − (số ngày còn lại × 90 × 5 × 500)`. Vẫn giữ `10 bình/ngày` free của nhóm 249 và `60 bình/ngày` quảng cáo trong những ngày còn lại.
- Bảng so sánh luôn tính đủ bốn scenario trên, độc lập với trạng thái checkbox đang chọn. Dòng tương ứng với trạng thái checkbox hiện tại là scenario đang được dùng cho kết quả chính và các mốc mục tiêu.
- Với mỗi mốc `3.500.000` và `5.000.000`, tính riêng trên `Tổng dự kiến đến cuối event — level hiện tại` và `Tổng dự kiến đến cuối event — bang max level`.
- `HP còn thiếu ở một mốc = MAX(0, mốc − tổng đang so sánh)`; nếu tổng đã đủ thì trả `0`, không hiển thị số âm.
- `Bình còn thiếu ở một mốc = CEILING(HP còn thiếu / 500)`.

Số bình hiện tại được hiểu là đã bao gồm những phần thưởng bang mà account đã nhận. Vì vậy tổng dự kiến ở level hiện tại không cộng lại toàn bộ `lookup(lv hiện tại)`; tổng dự kiến khi bang max chỉ cộng chênh lệch từ level hiện tại đến level tối đa để tránh tính trùng.

Khi sự kiện đã kết thúc, số ngày, phút và giờ còn lại đều bằng `0`; HP reset, HP hồi, bình Daily tương lai và bình gói 249 tương lai cũng bằng `0`. Không cộng thêm gói 249 sau thời điểm kết thúc.

Calculator tự cập nhật `now` mỗi `5 giây`, đồng thời cập nhật ngay khi tab trở lại trạng thái visible hoặc cửa sổ được focus. Số phút làm tròn xuống; số giờ làm tròn gần nhất như công thức Excel trên.

### Đối chiếu với `table-new.png`

Ảnh minh họa có `2` ngày event còn lại. Input `2.736` là snapshot đã gồm mọi phần thưởng nhận tới hiện tại; projection cộng thêm `2 × 210` bình package và `2 × 510` bình Daily tương lai.

- `Tổng bình đến end = 2.736 + 2 × 510 + 2 × 210 = 4.176`.
- `Tổng HP từ bình = 4.176 × 500 = 2.088.000`.
- `Tổng dự kiến đến cuối event — level hiện tại = 3.932.948`.
- `Tổng dự kiến đến cuối event — bang max = 3.932.948 + 2.294 × 500 = 5.079.948`.
- Bật cả hai: level hiện tại `3.932.948`; bang max `5.079.948`.
- Không nạp gói 249: level hiện tại `3.732.948`; bang max `4.879.948`.
- Không mua bình Daily bằng kim cương: level hiện tại `3.482.948`; bang max `4.629.948`.
- Tắt cả hai: level hiện tại `3.282.948`; bang max `4.429.948`.
- Mốc `3.5M`: current và max đều thiếu `0 HP / 0 bình`.
- Mốc `5M`: current thiếu `1.067.052 HP / 2.135 bình`; max thiếu `0 HP / 0 bình`.

Giá trị `3.617.948` ở dòng không nạp trong file Excel đã trừ `3 × 210 × 500 = 315.000`, tức vừa dùng toàn bộ `3 ngày` thay vì `2 ngày còn lại`, vừa trừ cả `10 bình/ngày` free. Theo quy tắc đã chốt, giá trị đúng là `3.732.948`, chỉ trừ `2 × 200 × 500 = 200.000`. Các số âm ở phần mốc mục tiêu trong file Excel cũ không được giữ trên UI; chúng được chuẩn hóa về `0`. Quy tắc này không áp dụng cho `Thời gian cần xả` và `HP cần xả`, là hai kết quả được phép âm.

## Wireframe

Xem [wireframe.md](./wireframe.md) để theo dõi bố cục desktop/mobile và tương tác của giao diện hiện tại.

## Định hướng tổ chức code

- Tách khu vực tham số, nhóm input và phần kết quả thành các component có trách nhiệm rõ ràng.
- Tách công thức tính khỏi phần render giao diện.
- Tập trung các hằng số, cấu hình sự kiện và option mức hồi HP để dễ cập nhật.
- Tech stack và cấu trúc kỹ thuật được mô tả riêng trong [tech-stack.md](./tech-stack.md).

## Điểm chưa chốt

- Giao diện chi tiết, màu sắc và ngưỡng đổi màu vẫn chờ quyết định khi triển khai.

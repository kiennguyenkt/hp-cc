# Tech stack — Trang tính HP

Tài liệu này ghi lại lựa chọn kỹ thuật đề xuất. Yêu cầu sản phẩm và công thức nghiệp vụ nằm trong [hp-calculator.md](./hp-calculator.md).

## Stack đề xuất

- Vite làm dev server và build static assets.
- React để chia component và quản lý tương tác của form, config và các kết quả dẫn xuất.
- TypeScript ở strict mode để định nghĩa rõ input, config, lookup và kết quả tính toán.
- CSS Modules kết hợp CSS custom properties; không cần UI framework ở scope hiện tại.
- Vitest tập trung kiểm tra công thức nghiệp vụ và quy tắc thời gian ảnh hưởng đến kết quả tính. Test storage và interaction UI không phải yêu cầu bắt buộc ở scope hiện tại.
- ESLint và Prettier để giữ code thống nhất.
- GitHub Actions build và deploy thư mục `dist` lên GitHub Pages.

## Những thứ chưa cần

- Không cần backend hoặc database; dữ liệu được lưu trong localStorage của trình duyệt.
- Không cần Next.js hoặc SSR vì đây là ứng dụng tĩnh một trang.
- Không cần router khi chỉ có một page.
- Không cần Redux, Zustand hoặc form library; `useReducer` và custom hooks đủ cho state hiện tại.
- Không cần Tailwind hoặc component library khi giao diện nhỏ và có bố cục riêng.

## Nguyên tắc tổ chức

- Công thức là pure functions, không phụ thuộc React, DOM hoặc localStorage.
- Truyền `now` vào hàm tính toán để test được các mốc thời gian cố định.
- Ở UI, cập nhật `now` mỗi 5 giây và cập nhật ngay khi tab visible/window focus; interval chỉ kích hoạt render, mọi công thức thời gian vẫn nằm trong pure functions.
- Tách event rules, bảng lookup và option hồi HP khỏi component.
- Chỉ lưu input/config; luôn tính lại output từ input và thời điểm hiện tại.
- Dữ liệu localStorage có `schemaVersion` để có thể migrate khi model thay đổi.
- ID của config độc lập với số thứ tự hiển thị.

## Cấu trúc thư mục dự kiến

```text
src/
  app/
    App.tsx
  components/
    ConfigTabs/
    ParameterPanel/
    AccountInputs/
    ResultSummary/
    TargetTable/
    CalculationDetails/
  domain/
    calculator.ts
    calculator.types.ts
    calculator.test.ts
    event-rules.ts
    guild-levels.ts
  storage/
    config-storage.ts
    use-stored-configs.ts
  utils/
    date-time.ts
    format-number.ts
    validation.ts
  styles/
    globals.css
    tokens.css
```

## State và localStorage

- Dùng `useReducer` cho config đang chọn và các thao tác tạo/chuyển/cập nhật config.
- Nút `[Lưu]` lưu thủ công config đang chọn; không tự lưu khi chỉnh sửa, chuyển hoặc clone config.
- Giữ bản nháp của từng config trong state khi chuyển tab. Reload hoặc đóng trang được phép mất các thay đổi chưa lưu.
- Khi mở trang, khôi phục dữ liệu đã lưu và config được chọn tại lần bấm `[Lưu]` gần nhất.
- Nút `[+]` clone config hiện tại, cấp ID mới và chuyển sang config mới.
- Mỗi config lưu trực tiếp hai boolean mua gói 249 và mua bình Daily bằng kim cương; không có state chế độ cơ bản/nâng cao. Config mới mặc định cả hai boolean là `true`.
- Không lưu calculated results hoặc trạng thái mở/thu gọn sidebar.
- Lưu lựa chọn ngôn ngữ `VN / EN` riêng với config; mặc định `VN`.
- Nếu dữ liệu lưu không hợp lệ, bỏ qua an toàn và tạo config mặc định.

## Kiểm thử công thức nghiệp vụ

Ưu tiên automated test cho tính đúng của công thức và các trường hợp biên dưới đây. Không bắt buộc bổ sung test storage hoặc tương tác UI.

- Lookup level 0, 27 và 40.
- Chênh lệch bình khi current level bằng hoặc nhỏ hơn max level.
- Sự kiện chưa kết thúc, đúng thời điểm kết thúc và đã kết thúc theo múi giờ cục bộ của trình duyệt.
- Số phút còn lại được làm tròn xuống; số ngày còn lại theo chênh lệch ngày lịch cục bộ.
- Số giờ còn lại dùng `ROUND` như công thức Excel; HP hồi dùng số giờ đang hiển thị × 60 × mức hồi HP/phút và không bị giới hạn bởi HP recovery limit.
- Số bình hiện tại đã gồm mọi nguồn quá khứ; tổng projection không cộng lại lookup level hiện tại hoặc phần package/KC đã nhận.
- Tổng dự kiến đến cuối event ở level hiện tại, tổng dự kiến khi bang max và tổng không nạp gói 249.
- Hai lựa chọn mua hàng tác động độc lập đến công thức. Tắt mua bình bằng kim cương vẫn luôn giữ `60` bình quảng cáo mỗi ngày.
- Trường hợp tắt đồng thời gói 249 và bình Daily mua bằng kim cương.
- Mỗi thay đổi checkbox cập nhật kết quả chính và HP/bình còn thiếu ở mốc `3.5M`, `5M` cho cả level hiện tại và bang max.
- Bảng so sánh tính đủ bốn scenario × hai mức level, độc lập với trạng thái checkbox đang chọn.
- Bình nhóm 249 tương lai dùng đúng số ngày còn lại của event; khi không nạp vẫn giữ `10` bình free/ngày. Scenario không nạp chỉ loại `số ngày còn lại × 200` bình trả phí, không sửa snapshot quá khứ.
- Bình còn thiếu cho mốc mục tiêu luôn dùng ceiling.
- Input parse được dùng giá trị đã floor để tính; dữ liệu thiếu hoặc không hợp lệ chỉ làm mất kết quả phụ thuộc, không ảnh hưởng kết quả độc lập.

## Deploy

Ứng dụng build thành static assets bằng Vite và deploy qua GitHub Actions lên GitHub Pages. Khi repository được host dưới `/<repo-name>/`, cần cấu hình đúng `base` của Vite.

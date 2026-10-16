# Tech stack — Trang tính HP

Tài liệu này ghi lại lựa chọn kỹ thuật đề xuất. Yêu cầu sản phẩm và công thức nghiệp vụ nằm trong [hp-calculator.md](./hp-calculator.md).

## Stack đề xuất

- Vite làm dev server và build static assets.
- React để chia component và quản lý tương tác của form, config và các kết quả dẫn xuất.
- TypeScript ở strict mode để định nghĩa rõ input, config, lookup và kết quả tính toán.
- CSS Modules kết hợp CSS custom properties; không cần UI framework ở scope hiện tại.
- Vitest cho unit test công thức, xử lý thời gian và localStorage.
- React Testing Library cho các interaction quan trọng của UI.
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
    config-storage.test.ts
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
- Autosave config đang chọn sau `2 giây` kể từ thay đổi cuối cùng. Flush thay đổi đang chờ trước khi chuyển hoặc clone config.
- Khi mở trang, khôi phục config được chọn gần nhất.
- Nút `[+]` clone config hiện tại, cấp ID mới và chuyển sang config mới.
- Mỗi config lưu trực tiếp hai boolean mua gói 249 và mua bình Daily bằng kim cương; không có state chế độ cơ bản/nâng cao. Config mới mặc định cả hai boolean là `true`.
- Không lưu calculated results hoặc trạng thái mở/thu gọn sidebar.
- Lưu lựa chọn ngôn ngữ `VN / EN` riêng với config; mặc định `VN`.
- Nếu dữ liệu lưu không hợp lệ, bỏ qua an toàn và tạo config mặc định.

## Kiểm thử tối thiểu

- Lookup level 0, 27 và 40.
- Chênh lệch bình khi current level bằng hoặc nhỏ hơn max level.
- Sự kiện chưa kết thúc, đúng thời điểm kết thúc và đã kết thúc theo múi giờ cục bộ của trình duyệt.
- Số giờ còn lại được round down; số ngày còn lại theo chênh lệch ngày lịch cục bộ.
- HP hồi dùng số phút còn lại và không bị giới hạn bởi HP recovery limit.
- Số bình hiện tại đã gồm mọi nguồn quá khứ; tổng projection không cộng lại lookup level hiện tại hoặc phần package/KC đã nhận.
- Auto refresh sau mỗi 5 giây, khi tab visible và khi window focus; dọn interval/listener khi unmount.
- Tổng dự kiến đến cuối event ở level hiện tại, tổng dự kiến khi bang max và tổng không nạp gói 249.
- Hai checkbox mua hàng luôn hiển thị và hoạt động độc lập; config mới mặc định chọn cả hai. Tắt mua bình bằng kim cương vẫn luôn giữ `60` bình quảng cáo mỗi ngày.
- Trường hợp tắt đồng thời gói 249 và bình Daily mua bằng kim cương.
- Mỗi thay đổi checkbox cập nhật kết quả chính và HP/bình còn thiếu ở mốc `3.5M`, `5M` cho cả level hiện tại và bang max.
- Bảng so sánh tính đủ bốn scenario × hai mức level, độc lập với trạng thái checkbox đang chọn.
- Bình nhóm 249 tương lai dùng đúng số ngày còn lại của event; khi không nạp vẫn giữ `10` bình free/ngày. Scenario không nạp chỉ loại `số ngày còn lại × 200` bình trả phí, không sửa snapshot quá khứ.
- Bình còn thiếu cho mốc mục tiêu luôn dùng ceiling.
- Input giữ nguyên raw text trong lúc focus; giá trị parse được dùng bản đã floor để tính mà không sửa nội dung ô, còn giá trị chưa parse được làm các kết quả phụ thuộc hiện `—`. Khi blur mới trim, floor phần thập phân và clamp số âm; level hiện tại clamp theo max level.
- HP backup vượt giới hạn bị clamp về giới hạn và hiển thị popup lỗi.
- Tạo, clone, chuyển và khôi phục config từ localStorage.
- Autosave debounce `2 giây`, flush trước khi chuyển/clone config và khôi phục đúng config được chọn gần nhất.
- Chuyển `VN / EN`, dịch đầy đủ nhãn giao diện và khôi phục ngôn ngữ đã lưu.

## Deploy

Ứng dụng build thành static assets bằng Vite và deploy qua GitHub Actions lên GitHub Pages. Khi repository được host dưới `/<repo-name>/`, cần cấu hình đúng `base` của Vite.

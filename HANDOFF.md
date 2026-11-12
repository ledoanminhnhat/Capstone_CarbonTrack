# CarbonTrack — Handoff / Progress Notes

> Mục đích: ghi lại tiến độ + cách chạy để tiếp tục trên máy khác (vd laptop ở trường).
> Cập nhật: 2026-11-12.

## Tổng quan
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind, trong thư mục `CarbonTrack/`.
- **Backend:** Java 21 + Spring Boot 3.4.1 (Maven), trong thư mục `backend/`.
- **Database:** MongoDB Atlas (cloud, dùng chung giữa các máy). Tên DB: `carbontrack`.

## Chạy dự án (2 terminal)
```bash
# Frontend  (http://localhost:3000)
cd CarbonTrack
npm install          # lần đầu
npm run dev

# Backend  (http://localhost:8080)
cd backend
mvn spring-boot:run
```
Cần cài sẵn: **Java 21+**, **Maven**, **Node.js**.

### ⚠️ File bí mật phải tự tạo lại (KHÔNG có trong git)
Backend cần `backend/.env.properties` (bị .gitignore vì chứa mật khẩu). Trên máy mới:
1. Copy `backend/.env.properties.example` → `backend/.env.properties`.
2. Điền connection string MongoDB Atlas thật vào:
   ```
   spring.data.mongodb.uri=mongodb+srv://<user>:<password>@cluster0.aaetul8.mongodb.net/carbontrack?retryWrites=true&w=majority
   ```
   (Lấy ở Atlas → Connect → Drivers → Java. Nếu mật khẩu có ký tự đặc biệt phải URL-encode, vd `*` → `%2A`.)
3. Nhớ thêm IP máy mới vào Atlas → **Network Access** (hoặc `0.0.0.0/0` khi dev).

## Tài khoản
- **Admin (seed sẵn khi backend khởi động):** `admin@carbontrack.com` / `Admin@123`
- User thường: tự đăng ký ở trang Register.

## Kiến trúc backend (package `com.carbontrack`)
- `model/` — User, Activity, Challenge, UserChallenge (đều implements `HasId`; id là **UUID** do `config/IdGeneratorCallback`).
- `repository/` — Mongo repositories.
- `service/` — AuthService, ActivityService, EmissionService (tính CO₂), UserService, AdminService, ChallengeService.
- `controller/` — Auth, Activity, User, Admin, Challenge.
- `security/` — JWT (JwtService, JwtAuthFilter principal = userId), SecurityConfig (CORS cho localhost:3000, `/api/admin/**` chỉ ADMIN).
- `config/` — AdminSeeder, ChallengeSeeder, IdGeneratorCallback.
- Cấu hình: `application.properties` (port 8080, JWT secret, DB name) + `.env.properties` (URI bí mật).

## Tính năng đã xong (chạy thật, đã test)
- **Auth:** register/login JWT + BCrypt, role USER/ADMIN, logout, Remember me (localStorage vs sessionStorage). Trang auth redesigned (form trái / visual phải).
- **Log Activity + Dashboard:** ghi hoạt động → backend tính CO₂ (EmissionService) → lưu Mongo (gắn userId). Dashboard: 4 stat tiles, biểu đồ Trend (theo ngày) + Sources (pie), bộ lọc tháng, Recent Activities. Modal Log Activity redesigned (4 category 4 màu).
- **History:** bảng + filter (category/status/tháng tự sinh từ data), sort theo ngày thật.
- **Settings:** đổi tên + đổi mật khẩu (Tracking/Reminder còn "coming soon").
- **Admin:** quản lý user (đổi role / xóa, chặn tự thao tác chính mình).
- **Challenges:** auto-đếm tiến độ từ activity (matchType SUBCATEGORY/CATEGORY + target), hoàn thành → cộng `points` vào User → hiện ở thẻ Score. Admin tạo/xóa challenge ngay trong tab Challenges (user tham gia, admin quản lý).
- **Design system:** `tailwind.config.js` (brand color, gradients, shadows), components `Button`/`Card`/`Badge`/`Select`, showcase ở `/design`.

## API chính
- `POST /api/auth/register`, `POST /api/auth/login` → trả {token, id, name, email, role}
- `GET/POST /api/activities`, `DELETE /api/activities/{id}`
- `GET/PUT /api/users/me`, `PUT /api/users/me/password`
- `GET /api/admin/users`, `PUT /api/admin/users/{id}/role`, `DELETE /api/admin/users/{id}`
- `GET /api/challenges`, `POST /api/challenges/{id}/join`
- `GET/POST /api/admin/challenges`, `DELETE /api/admin/challenges/{id}`
- Các request cần đăng nhập: header `Authorization: Bearer <token>`.

## Lưu ý vận hành
- Sau khi sửa code backend phải **restart** `mvn spring-boot:run` (không có hot-reload).
- Sửa `tailwind.config.js` có thể cần **restart `npm run dev`**.
- Frontend gọi API ở `http://localhost:8080` (đổi bằng env `NEXT_PUBLIC_API_URL` nếu cần).

## Việc tiếp theo (chưa làm)
- **Community** (feed + block đơn giản + ảnh qua **Cloudinary** — đã chốt hướng).
- **Recommendations** (gợi ý giảm phát thải từ activity).
- **Google login** (hướng: verify Google ID token ở backend, cấp JWT; có cả liên kết tài khoản — xem chi tiết đã bàn).
- Redesign nốt các trang còn lại (Challenges / History / Settings / Admin) cho đồng bộ hơn.

# CarbonTrack — Handoff / Progress Notes

> Mục đích: ghi lại tiến độ + cách chạy để tiếp tục trên máy khác (vd laptop ở trường).
> Cập nhật: 2026-11-19.

## Tổng quan
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind, trong thư mục `CarbonTrack/`.
- **Backend:** Java 21+ + Spring Boot 3.4.1 (Maven), trong thư mục `backend/`.
- **Database:** MongoDB Atlas (cloud, dùng chung giữa các máy). Tên DB: `carbontrack`.
- **Ảnh:** Cloudinary (signed upload — secret chỉ nằm ở backend).

## Chạy dự án (2 terminal)
```bash
# Frontend  (http://localhost:3000)
cd CarbonTrack
npm install          # lần đầu
npm run dev

# Backend  (http://localhost:8080)  — PHẢI đứng trong thư mục backend/
cd backend
mvn spring-boot:run
```
Cần cài sẵn: **Java 21+** (đã chạy được trên JDK 25), **Maven 3.9.x**, **Node.js**.

### ⚠️ Lỗi môi trường hay gặp
- **`JAVA_HOME` phải trỏ tới thư mục JDK gốc**, KHÔNG có `\bin` ở cuối
  (đúng: `C:\Program Files\Java\jdk-25...`). Sai thì Maven báo "JAVA_HOME not defined correctly".
- **JDK 23+ & Lombok:** `pom.xml` đã nâng Lombok lên 1.18.42 và khai báo `annotationProcessorPaths`.
  Nếu thấy lỗi "cannot find symbol getXxx()" thì kiểm tra lại 2 chỗ này.
- `mvn spring-boot:run` ở thư mục gốc sẽ báo "No plugin found for prefix 'spring-boot'" → phải `cd backend`.
- Kiểm tra TypeScript thủ công: `node node_modules/typescript/bin/tsc --noEmit -p . --ignoreDeprecations 6.0`
  (tsconfig có `baseUrl` bị TS 6 báo deprecated; `npm run dev` không bị ảnh hưởng).

### ⚠️ File bí mật phải tự tạo lại (KHÔNG có trong git)
Backend cần `backend/.env.properties` (bị .gitignore). Trên máy mới:
1. Copy `backend/.env.properties.example` → `backend/.env.properties`.
2. Điền:
   ```
   spring.data.mongodb.uri=mongodb+srv://<user>:<password>@cluster0.aaetul8.mongodb.net/carbontrack?retryWrites=true&w=majority
   cloudinary.cloud-name=...
   cloudinary.api-key=...
   cloudinary.api-secret=...
   ```
   - Mongo: Atlas → Connect → Drivers → Java. **Bỏ hết dấu `< >`** của mẫu. Mật khẩu có ký tự đặc biệt phải URL-encode (`*`→`%2A`, `@`→`%40`).
   - Cloudinary: Console → Settings → API Keys.
3. Thêm IP máy mới vào Atlas → **Network Access** (hoặc `0.0.0.0/0` khi dev).

## Tài khoản
- **Admin (seed sẵn khi backend khởi động):** `admin@carbontrack.com` / `Admin@123`
- User thường: tự đăng ký ở trang Register.

## Kiến trúc backend (package `com.carbontrack`)
- `model/` — User, Activity, Challenge, UserChallenge, Post, Comment (đều implements `HasId`; id là **UUID** do `config/IdGeneratorCallback`).
- `repository/` — Mongo repositories.
- `service/` — AuthService, ActivityService, EmissionService (tính CO₂), UserService, AdminService, ChallengeService, RecommendationService, CommunityService, UploadService (ký Cloudinary).
- `controller/` — Auth, Activity, User, Admin, Challenge, Recommendation, Community.
- `security/` — JWT (principal = userId), SecurityConfig (CORS localhost:3000, `/api/admin/**` chỉ ADMIN).
- `config/` — AdminSeeder, ChallengeSeeder, IdGeneratorCallback.
- Like / đếm comment / share / mute dùng update atomic của MongoTemplate (`$addToSet`, `$pull`, `$inc`).

## Kiến trúc frontend (`CarbonTrack/src`)
Tổ chức **theo tính năng**: mỗi trang có types / services / hooks / components riêng; chỉ thứ dùng chung mới để ở ngoài.
```
app/                      # route Next.js — page.tsx chỉ ghép component, không chứa logic
features/<trang>/         # auth, activities, home, history, challenges, recommendations, community, settings, admin
  types/                  # <trang>.types.ts + index.ts (kiểu dữ liệu của trang)
  services/*.service.ts   # gọi API của trang
  hooks/use*.ts           # state + logic (tải dữ liệu, form, toast/confirm)
  components/*.tsx        # UI của trang
components/ui/            # thư viện component dùng chung (Button, Input, PasswordInput, Select, Modal,
                          #   ConfirmDialog, Toast, Table, Pagination, StatTile, Avatar, Alert, EmptyState…)
components/layout/        # Sidebar
hooks/                    # hook dùng chung: useAsync, useCurrentUser, useRequireAuth, usePagination,
                          #   useClickOutside, useObjectUrl, useShare
services/                 # http.ts (request<T>() + xử lý lỗi), session.ts (token/user), user, upload (Cloudinary)
types/                    # kiểu dùng chung: AuthUser, Role, UserProfile, UploadKind
constants/                # app.ts (giới hạn, API_URL), categories.ts (category/sub-category/màu/emoji)
utils/                    # date (MM/yyyy, timeAgo…), emission (sumCo2…), csv, image, error
providers/AppProviders    # ToastProvider + ConfirmProvider (bọc ở app/layout.tsx)
```
- Thông báo: `useToast()` (success/error/info). Xác nhận: `await useConfirm()({ title, danger })`. **Không dùng `alert`/`confirm`.**
- Gọi API mới: thêm hàm trong `features/<trang>/services/` dùng `request<T>(path, { method, body })`.
- Màu dùng token Tailwind (`text-ink`, `text-muted`, `brand-*`), không viết hex trong className.

## Tính năng đã xong (chạy thật, đã test)
- **Auth:** register/login JWT + BCrypt, role USER/ADMIN, logout, Remember me. Login trả thêm `avatarUrl`.
- **Log Activity + Dashboard:** EmissionService tính CO₂, 4 stat tiles, biểu đồ Trend + Sources, lọc tháng, Recent Activities.
- **History:** 4 stat tiles theo bộ lọc, bảng + filter (category/status/tháng), phân trang, **Export CSV** (đúng các dòng đang lọc).
- **Challenges:** auto-đếm tiến độ từ activity, hoàn thành → cộng `points`. Admin tạo/xóa trong cùng tab.
- **Recommendations:** rule-based (12 luật "đang làm X → đổi sang Y"), lượng tiết kiệm tính từ hệ số trong EmissionService × dữ liệu thật của user. Lọc This month / All time, sort. Nút **Start Challenge** biến gợi ý thành challenge (dùng lại challenge có sẵn cùng matchValue, không có thì tạo) rồi join.
- **Community:**
  - Bài đăng: chữ ≤ 5000 ký tự, ≤ 3 ảnh (Cloudinary), feed phân trang 10 bài, "See more", xem ảnh lớn.
  - Like bài, comment, **like comment**, share bài (copy link `/community?post=<id>` hoặc share sheet trên mobile, có đếm).
  - **Hide user (mute):** không thấy bài + comment của người đó; danh sách + Unhide ở sidebar.
  - Xóa: tác giả xóa bài mình; admin xóa mọi bài; comment xóa được bởi người viết / chủ bài / admin.
  - Leaderboard top 5 (role USER, theo points).
  - Admin xóa user → dọn luôn bài, comment, like, mute của user đó.
  - Dưới mỗi bài: AvatarGroup 3 người like gần nhất + "You and N others" (backend trả `recentLikers`).
- **Avatar:** upload ở Settings, có **crop** (kéo + zoom, `features/settings/components/AvatarCropper.tsx`), xóa được. Hiện ở sidebar, Community, Leaderboard, Admin.
- **Đang online:** backend ghi `User.lastActiveAt` mỗi request đã đăng nhập (`PresenceService`, tối đa 1 lần/phút). Online = hoạt động trong 5 phút. Chấm xanh (`PresenceAvatar`) ở bảng Admin (+ cột Last active), Leaderboard, Hidden users; các danh sách này tự làm mới mỗi 60s.
- **Daily Tip (Dashboard):** 8 mẹo kèm ảnh Unsplash (có credit tác giả), đổi theo ngày + nút "Another tip". Dữ liệu ở `features/home/constants/dailyTips.ts`.
- **History / Recent Activities:** cột Activity = icon Font Awesome + tên; cột Category = badge màu category; Status = badge outline có icon.
- **Settings:** đổi tên, avatar, đổi mật khẩu, **Tracking = mục tiêu phát thải năm** (mặc định 1800 kg). Reminder đang "Coming soon".
- **Mục tiêu:** Dashboard lấy mục tiêu năm ÷ 12 làm mục tiêu tháng (thẻ Remaining goal, đỏ khi vượt; đường nét đứt trên Trend = tháng ÷ 30).
- **Admin (User Management):** 4 stat tiles, tìm tên/email + lọc role, phân trang 10; bảng có avatar, role, điểm, số activity, **ngày tham gia**; đổi role / xóa (chặn tự thao tác chính mình).
  - Ngày tham gia = `User.createdAt` (set khi đăng ký). Account cũ không có: nếu id là Mongo ObjectId thì suy ra từ id, id UUID thì hiện "—".
- **Design system:** `tailwind.config.js` (brand, gradients, shadows) + `components/ui/*`. Showcase `/design`.
  - `Badge`: tone (success/danger/warning/info/neutral/brand) hoặc `color` hex tùy chỉnh; variant soft/solid/outline; size sm/md; `icon`, `dot`.
  - `Avatar` (+ `status` dot), `AvatarGroup` (+N), `PresenceAvatar` (chấm online).
  - Icon: **Font Awesome 6 qua `react-icons/fa6`** cho category/sub-category (`constants/categoryIcons.ts`); Material (`react-icons/md`) cho icon giao diện chung.
  - Màu category: `constants/categories.ts` (`CATEGORY_COLORS` cho biểu đồ, `CATEGORY_TEXT_COLORS` đậm hơn cho chữ trong badge).

## Ảnh (Cloudinary)
| Loại | Folder | Biến đổi (nằm trong chữ ký) |
|---|---|---|
| Bài đăng | `carbontrack/community` | `c_limit,w_1200,h_1200` |
| Avatar | `carbontrack/avatars` | `c_fill,g_face,w_256,h_256` |
- Chỉ nhận `jpg,png,webp`; giới hạn 5MB kiểm ở frontend.
- Luồng: FE `POST /api/uploads/signature?type=post|avatar` → upload thẳng lên Cloudinary → gửi `secure_url` về backend. Backend chỉ nhận URL thuộc cloud + đúng folder.

## API chính
- `POST /api/auth/register`, `POST /api/auth/login` → {token, id, name, email, role, avatarUrl}
- `GET/POST /api/activities`, `DELETE /api/activities/{id}`
- `GET/PUT /api/users/me`, `PUT /api/users/me/password`, `PUT /api/users/me/avatar` {avatarUrl | null}, `PUT /api/users/me/tracking` {yearlyGoalKg} (100–100000)
- `GET /api/challenges`, `POST /api/challenges/{id}/join`
- `GET /api/recommendations?month=MM/yyyy` (bỏ month = all time), `POST /api/recommendations/{ruleId}/apply`
- Community:
  - `GET /api/posts?page=0`, `GET /api/posts/{id}`, `POST /api/posts` {content, imageUrls}, `DELETE /api/posts/{id}`
  - `POST /api/posts/{id}/like` (toggle), `POST /api/posts/{id}/share`
  - `GET/POST /api/posts/{id}/comments`, `DELETE /api/comments/{id}`, `POST /api/comments/{id}/like` (toggle)
  - `GET /api/users/me/muted`, `POST/DELETE /api/users/me/muted/{userId}`
  - `GET /api/community/leaderboard`
  - `POST /api/uploads/signature?type=post|avatar`
- Admin: `GET /api/admin/users`, `PUT /api/admin/users/{id}/role`, `DELETE /api/admin/users/{id}`, `GET/POST /api/admin/challenges`, `DELETE /api/admin/challenges/{id}`
- Các request cần đăng nhập: header `Authorization: Bearer <token>`.

## Lưu ý vận hành
- Sửa code backend phải **restart** `mvn spring-boot:run` (không có hot-reload).
- Muốn test API mà không đụng backend đang chạy: `mvn spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"`.
- Sửa `tailwind.config.js` có thể cần **restart `npm run dev`**.
- Frontend gọi API ở `http://localhost:8080` (đổi bằng env `NEXT_PUBLIC_API_URL`).
- DB đang có account `UuidTest` (test cũ) — xóa ở trang Admin nếu không cần.

## Việc tiếp theo (chưa làm)
- **Google login** (verify Google ID token ở backend, cấp JWT; liên kết tài khoản theo email).
- Settings: **Reminder**.
- History: export PDF (hiện mới có CSV).

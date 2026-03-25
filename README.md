# TeenCare API

Mini LMS API quản lý Học sinh – Phụ huynh – Lớp học – Đăng ký – Gói học.

**Tech Stack:** Node.js, Express 5, Sequelize ORM, MySQL

---

## 🚀 Cách chạy project

### Chạy với Docker (khuyến nghị)

```bash
docker-compose up --build
```

API sẽ chạy tại: `http://localhost:8080`

### Chạy local (không Docker)

```bash
# 1. Cài dependencies
npm install

# 2. Tạo database MySQL tên "teencare"
# 3. Cấu hình DB tại app/configs/mysql.config.js

# 4. Chạy seed data
npm run seed

# 5. Chạy dev server
npm run dev
```

---

## 📊 Database Schema

```
Parents (id, name, phone, email)
   │
   └──< Students (id, name, dob, gender, current_grade, parent_id)
           │
           ├──< ClassRegistrations (id, class_id, student_id, registered_at)
           │         │
           │         └──> Classes (id, name, subject, day_of_week, time_slot, teacher_name, max_students)
           │
           └──< Subscriptions (id, student_id, package_name, start_date, end_date, total_sessions, used_sessions)
```

---

## 📡 API Endpoints

Base URL: `/api/v1`

### Parents

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/parents` | Tạo phụ huynh |
| GET | `/parents` | Danh sách phụ huynh (hỗ trợ phân trang `?page=1&limit=10`) |
| GET | `/parents/:id` | Xem chi tiết phụ huynh |

### Students

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/students` | Tạo học sinh (kèm parent_id) |
| GET | `/students` | Danh sách học sinh (có thể lọc theo parent `?parent_id=1` và phân trang) |
| GET | `/students/:id` | Xem chi tiết học sinh (bao gồm thông tin parent) |

### Classes

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/classes` | Tạo lớp mới |
| GET | `/classes?day=Monday` | Danh sách lớp theo ngày |
| POST | `/classes/:class_id/register` | Đăng ký học sinh vào lớp |

**Business Rules khi đăng ký:**
- Kiểm tra sĩ số: không cho phép nếu lớp đã đạt `max_students`
- Kiểm tra trùng lịch: không cho phép nếu student đã có lớp cùng `day_of_week` + `time_slot`
- Kiểm tra gói học: chỉ cho phép nếu có subscription còn hiệu lực và `used_sessions < total_sessions`

### Registrations

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| DELETE | `/registrations/:id` | Hủy đăng ký lớp học |

**Logic hủy:**
- Hủy trước giờ học > 24h → hoàn trả 1 buổi (`used_sessions - 1`)
- Hủy sát giờ < 24h → xóa đăng ký, không hoàn buổi

### Subscriptions

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/subscriptions` | Khởi tạo gói học |
| PATCH | `/subscriptions/:id/use` | Đánh dấu đã dùng 1 buổi |
| GET | `/subscriptions/:id` | Xem trạng thái gói (tổng vs. đã dùng) |

---

## 📝 Ví dụ truy vấn

```bash
# Tạo phụ huynh
curl -X POST http://localhost:8080/api/v1/parents \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyen Van A","phone":"0901234567","email":"parent_a@test.com"}'

# Tạo học sinh
curl -X POST http://localhost:8080/api/v1/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyen Van B","dob":"2010-05-15","gender":"male","current_grade":"10","parent_id":1}'

# Tạo lớp học
curl -X POST http://localhost:8080/api/v1/classes \
  -H "Content-Type: application/json" \
  -d '{"name":"Math 101","subject":"Math","day_of_week":"Monday","time_slot":"08:00-09:30","teacher_name":"Mr. Tran","max_students":5}'

# Tạo gói học
curl -X POST http://localhost:8080/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"student_id":1,"package_name":"Basic","start_date":"2026-01-01","end_date":"2026-12-31","total_sessions":20}'

# Đăng ký lớp
curl -X POST http://localhost:8080/api/v1/classes/1/register \
  -H "Content-Type: application/json" \
  -d '{"student_id":1}'

# Xem danh sách phụ huynh
curl http://localhost:8080/api/v1/parents?page=1&limit=10

# Xem danh sách học sinh
curl "http://localhost:8080/api/v1/students?page=1&limit=10"

# Xem danh sách lớp ngày Monday
curl "http://localhost:8080/api/v1/classes?day=Monday"

# Hủy đăng ký
curl -X DELETE http://localhost:8080/api/v1/registrations/1
```

---

## 📁 Cấu trúc Project

```
test_api/
├── app/
│   ├── bootstraps/        # Khởi tạo Express & DB
│   ├── configs/            # Cấu hình app & MySQL
│   ├── controllers/        # Xử lý request/response
│   ├── models/             # Sequelize models
│   ├── routes/             # Định tuyến API
│   ├── services/           # Business logic
│   ├── utils/              # Tiện ích (logger, APIError, common)
│   └── server.js           # Entry point
├── script/
│   └── seed.js             # Dữ liệu mẫu
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🌱 Seed Data

Chạy `npm run seed` để tạo dữ liệu mẫu:
- 2 Parents
- 3 Students
- 3 Classes (Toán, Tiếng Anh, Vật lý)
- 3 Subscriptions
- 2 Class Registrations

const router = require("express").Router();
const { studentsController } = require("../controllers/index.controller");

// POST /api/v1/students – tạo học sinh (đính kèm parent_id)
router.post("/", studentsController.createStudent);

// GET /api/v1/students – lấy danh sách học sinh
router.get("/", studentsController.listStudents);

// GET /api/v1/students/:id – xem chi tiết, bao gồm thông tin parent
router.get("/:id", studentsController.getStudentById);

module.exports = router;

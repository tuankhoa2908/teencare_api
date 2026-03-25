const router = require("express").Router();
const { classesController } = require("../controllers/index.controller");

// POST /api/v1/classes – tạo lớp mới
router.post("/", classesController.createClass);

// GET /api/v1/classes?day={weekday} – danh sách lớp theo ngày
router.get("/", classesController.listClasses);

// POST /api/v1/classes/:class_id/register – đăng ký học sinh vào lớp
router.post("/:class_id/register", classesController.registerStudent);

module.exports = router;

const router = require("express").Router();
const { parentsController } = require("../controllers/index.controller");

// POST /api/v1/parents – tạo phụ huynh
router.post("/", parentsController.createParent);

// GET /api/v1/parents – lấy danh sách phụ huynh
router.get("/", parentsController.listParents);

// GET /api/v1/parents/:id – xem chi tiết
router.get("/:id", parentsController.getParentById);

module.exports = router;

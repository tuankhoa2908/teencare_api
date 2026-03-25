const router = require("express").Router();
const {
  subscriptionsController,
} = require("../controllers/index.controller");

// POST /api/v1/subscriptions – khởi tạo gói học
router.post("/", subscriptionsController.createSubscription);

// PATCH /api/v1/subscriptions/:id/use – đánh dấu đã dùng 1 buổi
router.patch("/:id/use", subscriptionsController.useSession);

// GET /api/v1/subscriptions/:id – xem trạng thái gói
router.get("/:id", subscriptionsController.getSubscriptionById);

module.exports = router;

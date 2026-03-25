const router = require("express").Router();
const {
  registrationsController,
} = require("../controllers/index.controller");

// DELETE /api/v1/registrations/:id – hủy đăng ký (có điều kiện 24h)
router.delete("/:id", registrationsController.cancelRegistration);

module.exports = router;

const router = require("express").Router();

const parentsRoutes = require("./parents.route");
const studentsRoutes = require("./students.route");
const classesRoutes = require("./classes.route");
const registrationsRoutes = require("./registrations.route");
const subscriptionsRoutes = require("./subscriptions.route");

router.use("/parents", parentsRoutes);
router.use("/students", studentsRoutes);
router.use("/classes", classesRoutes);
router.use("/registrations", registrationsRoutes);
router.use("/subscriptions", subscriptionsRoutes);

module.exports = router;

const { returnSuccess } = require("../utils/common");
const db = require("../models/index.model");
const APIError = require("../utils/APIError");
const moment = require("moment");

module.exports = {
  cancelRegistration,
};

/**
 * Hủy đăng ký lớp học
 * - Nếu hủy trước giờ học > 24h: hoàn trả 1 buổi (used_sessions - 1)
 * - Nếu hủy sát giờ (< 24h): xóa đăng ký nhưng không hoàn buổi
 */
async function cancelRegistration(registrationId) {
  const registration = await db.class_registrations.findOne({
    where: { id: registrationId },
    include: [
      {
        model: db.classes,
        as: "class",
      },
    ],
  });

  if (!registration) {
    throw new APIError("Registration not found", 404);
  }

  // Tính thời gian buổi học tiếp theo
  const classInfo = registration.class;
  const dayMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
  };

  const targetDay = dayMap[classInfo.day_of_week];
  const [startTime] = classInfo.time_slot.split("-");
  const [hours, minutes] = startTime.split(":").map(Number);

  // Tìm ngày tiếp theo có day_of_week tương ứng
  let nextClassDate = moment();
  const currentDay = nextClassDate.day();
  let daysUntilClass = targetDay - currentDay;
  if (daysUntilClass <= 0) {
    daysUntilClass += 7;
  }
  nextClassDate = nextClassDate
    .add(daysUntilClass, "days")
    .set({ hour: hours, minute: minutes, second: 0 });

  const hoursUntilClass = nextClassDate.diff(moment(), "hours", true);

  const transaction = await db.sequelize.transaction();
  try {
    // Xóa đăng ký
    await db.class_registrations.destroy({
      where: { id: registrationId },
      transaction,
    });

    let refunded = false;

    // Nếu hủy trước > 24h: hoàn buổi
    if (hoursUntilClass > 24) {
      const activeSubscription = await db.subscriptions.findOne({
        where: {
          student_id: registration.student_id,
          used_sessions: { [db.Sequelize.Op.gt]: 0 },
        },
        order: [["created_at", "DESC"]],
      });

      if (activeSubscription) {
        await db.subscriptions.update(
          { used_sessions: activeSubscription.used_sessions - 1 },
          { where: { id: activeSubscription.id }, transaction },
        );
        refunded = true;
      }
    }

    await transaction.commit();

    return returnSuccess(200, "Registration cancelled successfully", {
      refunded,
      hours_until_class: Math.round(hoursUntilClass * 100) / 100,
      message: refunded
        ? "Cancelled > 24h before class. 1 session refunded."
        : "Cancelled < 24h before class. No session refunded.",
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

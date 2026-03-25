const { returnSuccess } = require("../utils/common");
const db = require("../models/index.model");
const APIError = require("../utils/APIError");

module.exports = {
  createSubscription,
  useSession,
  getSubscriptionById,
};

async function createSubscription(data) {
  const { student_id, package_name, start_date, end_date, total_sessions } =
    data;

  if (!student_id || !package_name || !start_date || !end_date || !total_sessions) {
    throw new APIError(
      "student_id, package_name, start_date, end_date, total_sessions are required",
      400,
    );
  }

  // Kiểm tra student tồn tại
  const student = await db.students.findOne({ where: { id: student_id } });
  if (!student) {
    throw new APIError("Student not found", 404);
  }

  const newSubscription = await db.subscriptions.create({
    student_id,
    package_name,
    start_date,
    end_date,
    total_sessions,
    used_sessions: 0,
    created_at: Math.floor(Date.now() / 1000),
  });

  return returnSuccess(201, "Subscription created successfully", newSubscription);
}

async function useSession(id) {
  const subscription = await db.subscriptions.findOne({ where: { id } });

  if (!subscription) {
    throw new APIError("Subscription not found", 404);
  }

  if (subscription.used_sessions >= subscription.total_sessions) {
    throw new APIError("All sessions have been used", 400);
  }

  await db.subscriptions.update(
    {
      used_sessions: subscription.used_sessions + 1,
      updated_at: Math.floor(Date.now() / 1000),
    },
    { where: { id } },
  );

  return returnSuccess(200, "Session marked as used", {
    id: subscription.id,
    used_sessions: subscription.used_sessions + 1,
    total_sessions: subscription.total_sessions,
    remaining: subscription.total_sessions - subscription.used_sessions - 1,
  });
}

async function getSubscriptionById(id) {
  const subscription = await db.subscriptions.findOne({
    where: { id },
    include: [
      {
        model: db.students,
        as: "student",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!subscription) {
    throw new APIError("Subscription not found", 404);
  }

  const result = subscription.toJSON();
  result.remaining_sessions =
    subscription.total_sessions - subscription.used_sessions;

  return returnSuccess(200, "Subscription fetched successfully", result);
}

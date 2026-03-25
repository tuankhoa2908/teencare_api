const { returnSuccess } = require("../utils/common");
const db = require("../models/index.model");
const APIError = require("../utils/APIError");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  createClass,
  listClasses,
  registerStudent,
};

async function createClass(data) {
  const { name, subject, day_of_week, time_slot, teacher_name, max_students } =
    data;

  if (!name || !day_of_week || !time_slot) {
    throw new APIError("Name, day_of_week and time_slot are required", 400);
  }

  const newClass = await db.classes.create({
    name,
    subject,
    day_of_week,
    time_slot,
    teacher_name,
    max_students: max_students || 30,
    created_at: Math.floor(Date.now() / 1000),
  });

  return returnSuccess(201, "Class created successfully", newClass);
}

async function listClasses(query) {
  const where = {};
  if (query.day) {
    where.day_of_week = query.day;
  }

  const classes = await db.classes.findAll({
    where,
    include: [
      {
        model: db.class_registrations,
        as: "registrations",
        attributes: ["id", "student_id", "registered_at"],
        include: [
          {
            model: db.students,
            as: "student",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
    order: [["day_of_week", "ASC"], ["time_slot", "ASC"]],
  });

  return returnSuccess(200, "Classes fetched successfully", classes);
}

async function registerStudent(class_id, data) {
  const { student_id } = data;

  if (!student_id) {
    throw new APIError("student_id is required", 400);
  }

  // 1. Kiểm tra lớp tồn tại
  const classInfo = await db.classes.findOne({ where: { id: class_id } });
  if (!classInfo) {
    throw new APIError("Class not found", 404);
  }

  // 2. Kiểm tra học sinh tồn tại
  const student = await db.students.findOne({ where: { id: student_id } });
  if (!student) {
    throw new APIError("Student not found", 404);
  }

  // 3. Kiểm tra sĩ số (max_students)
  const currentCount = await db.class_registrations.count({
    where: { class_id },
  });
  if (currentCount >= classInfo.max_students) {
    throw new APIError(
      `Class is full (max: ${classInfo.max_students})`,
      400,
    );
  }

  // 4. Kiểm tra trùng lịch: student đã đăng ký lớp khác cùng day_of_week & time_slot
  const conflictingRegistrations = await db.class_registrations.findAll({
    where: { student_id },
    include: [
      {
        model: db.classes,
        as: "class",
        where: {
          day_of_week: classInfo.day_of_week,
          time_slot: classInfo.time_slot,
        },
      },
    ],
  });
  if (conflictingRegistrations.length > 0) {
    throw new APIError(
      `Student already has a class on ${classInfo.day_of_week} at ${classInfo.time_slot}`,
      400,
    );
  }

  // 5. Kiểm tra gói học còn hiệu lực
  const today = moment().format("YYYY-MM-DD");
  const activeSubscription = await db.subscriptions.findOne({
    where: {
      student_id,
      end_date: { [Op.gte]: today },
      used_sessions: {
        [Op.lt]: db.sequelize.col("total_sessions"),
      },
    },
  });
  if (!activeSubscription) {
    throw new APIError(
      "Student has no active subscription or all sessions are used",
      400,
    );
  }

  // 6. Tạo đăng ký + tăng used_sessions
  const transaction = await db.sequelize.transaction();
  try {
    const registration = await db.class_registrations.create(
      {
        class_id,
        student_id,
        registered_at: new Date(),
      },
      { transaction },
    );

    await db.subscriptions.update(
      { used_sessions: activeSubscription.used_sessions + 1 },
      { where: { id: activeSubscription.id }, transaction },
    );

    await transaction.commit();

    return returnSuccess(201, "Student registered to class successfully", {
      registration,
      subscription: {
        id: activeSubscription.id,
        used_sessions: activeSubscription.used_sessions + 1,
        total_sessions: activeSubscription.total_sessions,
        remaining: activeSubscription.total_sessions - activeSubscription.used_sessions - 1,
      },
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

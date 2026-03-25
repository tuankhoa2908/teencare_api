const { returnSuccess } = require("../utils/common");
const db = require("../models/index.model");
const APIError = require("../utils/APIError");

module.exports = {
  createStudent,
  getStudentById,
  listStudents,
};

async function createStudent(data) {
  const { name, dob, gender, current_grade, parent_id } = data;

  if (!name || !parent_id) {
    throw new APIError("Name and parent_id are required", 400);
  }

  // Kiểm tra parent tồn tại
  const parent = await db.parents.findOne({ where: { id: parent_id } });
  if (!parent) {
    throw new APIError("Parent not found", 404);
  }

  const newStudent = await db.students.create({
    name,
    dob,
    gender,
    current_grade,
    parent_id,
    created_at: Math.floor(Date.now() / 1000),
  });

  return returnSuccess(201, "Student created successfully", newStudent);
}

async function getStudentById(id) {
  const student = await db.students.findOne({
    where: { id },
    include: [
      {
        model: db.parents,
        as: "parent",
        attributes: ["id", "name", "phone", "email"],
      },
      {
        model: db.subscriptions,
        as: "subscriptions",
        attributes: [
          "id",
          "package_name",
          "start_date",
          "end_date",
          "total_sessions",
          "used_sessions",
        ],
      },
    ],
  });

  if (!student) {
    throw new APIError("Student not found", 404);
  }

  return returnSuccess(200, "Student fetched successfully", student);
}

async function listStudents(query) {
  const { page = 1, limit = 10, parent_id } = query;
  const offset = (page - 1) * limit;

  const where = {};
  if (parent_id) {
    where.parent_id = parent_id;
  }

  const students = await db.students.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [
      {
        model: db.parents,
        as: "parent",
        attributes: ["id", "name", "phone"],
      },
    ],
    order: [["id", "DESC"]],
  });

  return returnSuccess(200, "Students fetched successfully", {
    total: students.count,
    page: parseInt(page),
    limit: parseInt(limit),
    data: students.rows,
  });
}

const { returnSuccess } = require("../utils/common");
const db = require("../models/index.model");
const APIError = require("../utils/APIError");

module.exports = {
  createParent,
  getParentById,
  listParents,
};

async function createParent(data) {
  const { name, phone, email } = data;

  if (!name || !phone) {
    throw new APIError("Name and phone are required", 400);
  }

  const newParent = await db.parents.create({
    name,
    phone,
    email,
    created_at: Math.floor(Date.now() / 1000),
  });

  return returnSuccess(201, "Parent created successfully", newParent);
}

async function getParentById(id) {
  const parent = await db.parents.findOne({
    where: { id },
    include: [
      {
        model: db.students,
        as: "students",
        attributes: ["id", "name", "dob", "gender", "current_grade"],
      },
    ],
  });

  if (!parent) {
    throw new APIError("Parent not found", 404);
  }

  return returnSuccess(200, "Parent fetched successfully", parent);
}

async function listParents(query) {
  const { page = 1, limit = 10 } = query;
  const offset = (page - 1) * limit;

  const parents = await db.parents.findAndCountAll({
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["id", "DESC"]],
  });

  return returnSuccess(200, "Parents fetched successfully", {
    total: parents.count,
    page: parseInt(page),
    limit: parseInt(limit),
    data: parents.rows,
  });
}

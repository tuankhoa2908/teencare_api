const studentsService = require("../services/students.service");

module.exports = {
  createStudent: async (req, res, next) => {
    try {
      const result = await studentsService.createStudent(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  getStudentById: async (req, res, next) => {
    try {
      const result = await studentsService.getStudentById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  listStudents: async (req, res, next) => {
    try {
      const result = await studentsService.listStudents(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

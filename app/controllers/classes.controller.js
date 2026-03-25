const classesService = require("../services/classes.service");

module.exports = {
  createClass: async (req, res, next) => {
    try {
      const result = await classesService.createClass(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  listClasses: async (req, res, next) => {
    try {
      const result = await classesService.listClasses(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  registerStudent: async (req, res, next) => {
    try {
      const result = await classesService.registerStudent(
        req.params.class_id,
        req.body,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
};

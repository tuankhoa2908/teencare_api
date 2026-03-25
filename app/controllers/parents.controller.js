const parentsService = require("../services/parents.service");

module.exports = {
  createParent: async (req, res, next) => {
    try {
      const result = await parentsService.createParent(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  getParentById: async (req, res, next) => {
    try {
      const result = await parentsService.getParentById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  listParents: async (req, res, next) => {
    try {
      const result = await parentsService.listParents(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

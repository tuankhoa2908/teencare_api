const registrationsService = require("../services/registrations.service");

module.exports = {
  cancelRegistration: async (req, res, next) => {
    try {
      const result = await registrationsService.cancelRegistration(
        req.params.id,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

const subscriptionsService = require("../services/subscriptions.service");

module.exports = {
  createSubscription: async (req, res, next) => {
    try {
      const result = await subscriptionsService.createSubscription(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  useSession: async (req, res, next) => {
    try {
      const result = await subscriptionsService.useSession(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  getSubscriptionById: async (req, res, next) => {
    try {
      const result = await subscriptionsService.getSubscriptionById(
        req.params.id,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

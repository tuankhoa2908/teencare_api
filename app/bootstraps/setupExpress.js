const cors = require("cors");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");
const Sequelize = require("sequelize");

const config = require("../configs/app.config");
const indexRouter = require("../routes/index.route");
const logger = require("../utils/logger");
const APIError = require("../utils/APIError");

const setupExpress = (app) => {
  app.use(
    cors({
      origin: "*",
      maxAge: 86400,
      methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
      exposedHeaders: ["Content-Disposition"],
    }),
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: "10mb" }));
  app.use(compression());
  app.use(helmet());

  const { ENV: env = "production" } = config.SERVER;
  if (env === "development" || env === "local") {
    app.use(morgan("dev"));
  }

  app.use(`/api/${config.SERVER.VERSION}`, indexRouter);

  // 404 not found
  app.use((req, __, next) => {
    const error = new APIError(
      `API not found [${req.method}] [${req.originalUrl}]`,
      404,
    );
    return next(error);
  });

  // handle error from NextFunction
  app.use((err, req, __, next) => {
    const metadata = {
      method: req.method,
      url: req.url,
    };
    // Xử lý tất cả lỗi của Sequelize
    if (err instanceof Sequelize.BaseError) {
      if (err instanceof Sequelize.ValidationError) {
        const errorMessages = err.errors.map((e) => e.message);
        return next(
          new APIError(
            "Sequelize Validation Failed",
            400,
            errorMessages,
            metadata,
            err?.stack,
          ),
        );
      }
      if (err instanceof Sequelize.UniqueConstraintError) {
        const errorMessages = err.errors.map((e) => e.message);
        return next(
          new APIError(
            "Unique Constraint Violation",
            409,
            errorMessages,
            metadata,
            err?.stack,
          ),
        );
      }
      if (err instanceof Sequelize.ForeignKeyConstraintError) {
        return next(
          new APIError(
            `Foreign Key Constraint Failed: ${err.message}`,
            400,
            "",
            metadata,
            err?.stack,
          ),
        );
      }
      if (err instanceof Sequelize.DatabaseError) {
        return next(
          new APIError(
            `Database Error: ${err.message}`,
            500,
            "",
            metadata,
            err?.stack,
          ),
        );
      }
      return next(
        new APIError("Sequelize Error", 500, err.message, metadata, err?.stack),
      );
    }
    // Xử lý tất cả các lỗi khác
    if (!(err instanceof APIError)) {
      const error = new APIError(err.message, 500, "", metadata, err.stack);
      return next(error);
    }
    return next(err);
  });

  app.use((err, req, res, __) => {
    const result = {
      success: false,
      code: err.status,
      msg: err.message,
    };
    if (env === "development" || env === "local") {
      result.error = err.error;
      result.stack = err.stack;
      result.metadata = err.metadata;
    }
    logger.error(err);
    return res.status(err.status).json(result);
  });
};

module.exports = setupExpress;

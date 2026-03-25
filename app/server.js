const http = require("http");
const app = require("express")();

const setupExpress = require("./bootstraps/setupExpress");
const initDB = require("./bootstraps/initDB");
const config = require("./configs/app.config");
const logger = require("./utils/logger");

const setupServer = () => {
  try {
    const dbPools = initDB(config.DB_MYSQL);

    if (!dbPools) {
      throw new Error("Database pools initialization failed");
    }

    setupExpress(app);

    http
      .createServer(app)
      .listen(config.SERVER.PORT, () => {
        logger.info(`Started TeenCare API on port ${config.SERVER.PORT}`);
      })
      .on("error", (error) => {
        logger.error(error);
        process.exit(1);
      });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

setupServer();

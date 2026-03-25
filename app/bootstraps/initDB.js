const Sequelize = require("sequelize");
const logger = require("../utils/logger");

const initDb = (config_db) => {
  const mysqlPools = {};

  const properties = Object.keys(config_db);

  if (!properties.length) {
    throw new Error("No database configurations found");
  }
  properties.forEach((property) => {
    const dbOpts = config_db[property];

    if (!dbOpts) {
      throw new Error(
        `Database configuration for [${property}] is undefined or null`,
      );
    }
    const connection = new Sequelize(
      dbOpts.database,
      dbOpts.username,
      dbOpts.password,
      dbOpts,
    );
    connection
      .authenticate()
      .then(() => {
        logger.info(
          `Database [${property}] connection has been established successfully.`,
        );
      })
      .catch((err) => {
        logger.error(`Database [${property}] connection failed:`, err);
        process.exit(1);
      });
    mysqlPools[property] = connection;
  });
  return mysqlPools;
};

module.exports = initDb;

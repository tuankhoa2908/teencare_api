const config = {};

config.DB_MYSQL = require("./mysql.config");

config.SERVER = {
  PORT: 8080,
  ENV: "development",
  VERSION: "v1",
};

module.exports = config;

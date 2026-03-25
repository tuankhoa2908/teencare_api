const db = {
  teencare: {
    database: process.env.DB_NAME || "teencare",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "tuankhoa2908",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: process.env.DB_PORT || "3306",
    logging: false,
  },
};

module.exports = db;

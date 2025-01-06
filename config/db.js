const { Pool } = require("pg");

const pool = new Pool({
  user: "lords_user",
  host: "localhost",
  database: "lords_and_alliances",
  password: "securepassword",
  port: 5432, // Puerto por defecto de PostgreSQL
});

module.exports = pool;

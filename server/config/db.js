const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'yamanote.proxy.rlwy.net', 
  port: process.env.DB_PORT || 18763, 
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'nnNuPCVGjUbasqaAsbRlwDDHxxrHOBna',
  database: process.env.DB_NAME || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true,
  },
});

module.exports = db;

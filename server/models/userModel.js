const db = require('../config/db');

const createUser = (name, email, password, callback) => {
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], callback);
};

const getUserByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

const blockUser = (email, callback) => {
  db.query(
    'UPDATE users SET is_blocked = TRUE WHERE email = ?',
    [email],
    callback,
  );
};

const deleteUser = (email, callback) => {
  db.query('DELETE FROM users WHERE email = ?', [email], callback);
};

const unblockUser = (email, callback) => {
  db.query(
    'UPDATE users SET is_blocked = FALSE WHERE email = ?',
    [email],
    callback,
  );
};

module.exports = {
  createUser,
  getUserByEmail,
  blockUser,
  deleteUser,
  unblockUser,
};

const db = require('./config/db');

db.query('SELECT 1 + 1 AS solution', (error, results) => {
  if (error) {
    console.error('Ошибка подключения к БД:', error);
  } else {
    console.log('Результат запроса:', results[0].solution);
  }
  process.exit(0);
});
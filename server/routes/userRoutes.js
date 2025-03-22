const express = require('express');
const db = require('../config/db');
const { blockUser, deleteUser, unblockUser } = require('../models/userModel');

const router = express.Router();

const messages = {
  en: {
    noEmail: 'No email provided',
    errorGettingUsers: 'Error retrieving users',
    errorBlockingUser: 'Error blocking user',
    errorUnblockingUser: 'Error unblocking user',
    errorDeletingUser: 'Error deleting user',
    userBlocked: 'User blocked',
    userUnblocked: 'User unblocked',
    userDeleted: 'User deleted',
  },
  ru: {
    noEmail: 'Не указан email',
    errorGettingUsers: 'Ошибка получения пользователей',
    errorBlockingUser: 'Ошибка блокировки пользователя',
    errorUnblockingUser: 'Ошибка разблокировки пользователя',
    errorDeletingUser: 'Ошибка удаления пользователя',
    userBlocked: 'Пользователь заблокирован',
    userUnblocked: 'Пользователь разблокирован',
    userDeleted: 'Пользователь удалён',
  },
};

const getLang = (req) => {
  const langHeader = req.headers['accept-language'];
  if (!langHeader) {
    return 'ru';
  }
  const lang = langHeader.split(',')[0].split('-')[0];
  return messages[lang] ? lang : 'ru';
};

router.get('/users', (req, res) => {
  const lang = getLang(req);
  db.query('SELECT id, name, email, is_blocked, created_at FROM users', (err, results) => {
    if (err)
      return res.status(500).json({ error: messages[lang].errorGettingUsers });
    res.json(results);
  });
});

router.put('/users/block', (req, res) => {
  const lang = getLang(req);
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: messages[lang].noEmail });

  blockUser(email, (err, result) => {
    if (err)
      return res.status(500).json({ error: messages[lang].errorBlockingUser });
    res.json({ message: messages[lang].userBlocked });
  });
});

router.put('/users/unblock', (req, res) => {
  const lang = getLang(req);
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: messages[lang].noEmail });

  unblockUser(email, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: messages[lang].errorUnblockingUser });
    res.json({ message: messages[lang].userUnblocked });
  });
});

router.delete('/users/delete', (req, res) => {
  const lang = getLang(req);
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: messages[lang].noEmail });

  deleteUser(email, (err, result) => {
    if (err)
      return res.status(500).json({ error: messages[lang].errorDeletingUser });
    res.json({ message: messages[lang].userDeleted });
  });
});

module.exports = router;

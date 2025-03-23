const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');

const router = express.Router();

const messages = {
  en: {
    fillFields: 'Please fill all fields',
    serverError: 'Server error',
    registrationError: 'Registration error',
    registrationSuccess: 'User registered successfully',
    invalidCredentials: 'Invalid email or password',
    accountBlocked: 'Your account is blocked',
    loginSuccess: 'Login successful',
  },
  ru: {
    fillFields: 'Заполните все поля',
    serverError: 'Ошибка сервера',
    registrationError: 'Ошибка регистрации',
    registrationSuccess: 'Пользователь зарегистрирован',
    invalidCredentials: 'Неверный email или пароль',
    accountBlocked: 'Ваш аккаунт заблокирован',
    loginSuccess: 'Успешный вход',
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

router.post('/register', async (req, res) => {
  const lang = getLang(req);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: messages[lang].fillFields });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    createUser(name, email, hashedPassword, (err) => {
      if (err) {
        return res.status(500).json({ error: messages[lang].registrationError });
      }

      getUserByEmail(email, async (err2, results) => {
        if (err2 || !results || results.length === 0) {
          return res.status(500).json({ error: messages[lang].serverError });
        }

        const user = results[0];
        if (user.is_blocked) {
          return res.status(403).json({ error: messages[lang].accountBlocked });
        }
        const token = jwt.sign(
          { userId: user.id, name: user.name },
          'SECRET_KEY',
          { expiresIn: '1h' },
        );
        res.status(201).json({
          message: messages[lang].registrationSuccess,
          token,
          name: user.name,
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: messages[lang].serverError });
  }
});

router.post('/login', (req, res) => {
  const lang = getLang(req);
  const { email, password } = req.body;

  getUserByEmail(email, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: messages[lang].invalidCredentials });
    }

    const user = results[0];
    if (user.is_blocked) {
      return res.status(403).json({ error: messages[lang].accountBlocked });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: messages[lang].invalidCredentials });
    }

    const token = jwt.sign({ userId: user.id, name: user.name }, 'SECRET_KEY', {
      expiresIn: '1h',
    });
    res.json({ message: messages[lang].loginSuccess, token, name: user.name });
  });
});

module.exports = router;
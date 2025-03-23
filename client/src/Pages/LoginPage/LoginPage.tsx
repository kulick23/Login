import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';
import background from '../../Assets/Img/login.jpg';

export const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';
    const payload = isRegistering ? { name, email, password } : { email, password };

    try {
      const response = await fetch(
        `https://login-production-7aff.up.railway.app/api/auth/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': i18n.language,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(isRegistering ? t('login.success-reg') : t('login.success-log'));
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email); 
        navigate('/users');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert(t('login.server-error'));
    }
  };

  return (
    <div className="LoginPage">
      <div className="LoginPage__container">
        <h2>{isRegistering ? t('login.title-reg') : t('login.title')}</h2>
        <p>{isRegistering ? t('login.subtitle-reg') : t('login.subtitle')}</p>
        <form className="LoginPage__container--form" onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <label className="Login__form--title">{t('login.name')}</label>
              <input
                type="text"
                placeholder={t('login.your-name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="login__input"
              />
            </>
          )}
          <label className="Login__form--title">{t('login.email')}</label>
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login__input"
          />
          <label className="Login__form--title">{t('login.password')}</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login__input"
          />
          {!isRegistering && (
            <div className="login__options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                {t('login.remember')}
              </label>
              <a href="#" className="forgot-password">
                {t('login.forgot')}
              </a>
            </div>
          )}
          <button type="submit">
            {isRegistering ? t('login.button-reg') : t('login.button')}
          </button>
          <a onClick={() => setIsRegistering(!isRegistering)} className="toggle-auth">
            {isRegistering ? t('login.login') : t('login.register')}
          </a>
        </form>
      </div>
      <img src={background} alt="background" />
    </div>
  );
};

export default LoginPage;
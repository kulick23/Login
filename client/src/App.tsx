import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage, UserTable } from './Pages';
import './Styles/App.scss';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (
    lng: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <a
        href="#"
        onClick={(e) => handleLanguageChange('en', e)}
        className={i18n.language === 'en' ? 'active' : ''}
      >
        English
      </a>
      <a
        href="#"
        onClick={(e) => handleLanguageChange('ru', e)}
        className={i18n.language === 'ru' ? 'active' : ''}
      >
        Русский
      </a>
    </div>
  );
};

function App() {
  return (
    <Router>
      <LanguageSwitcher />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/users" element={<UserTable />} />
      </Routes>
    </Router>
  );
}

export default App;

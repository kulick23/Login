import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './UserTable.scss';

export const UserTable: React.FC = () => {
  const [users, setUsers] = useState<
    { name: string; email: string; is_blocked: boolean; created_at: string }[]
  >([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const userName = localStorage.getItem('userName');

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const response = await fetch('http://localhost:5000/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': i18n.language,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    } else {
      alert(t('table.loading-error'));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [i18n.language]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const toggleSelection = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleBlockSelected = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    for (const email of selectedEmails) {
      const response = await fetch(`http://localhost:5000/api/users/block`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Language': i18n.language,
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        alert(t('table.loading-error'));
        return;
      }
    }
    alert(t('table.block-success'));
    setSelectedEmails([]);
    fetchUsers();
  };

  const handleUnblockSelected = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    for (const email of selectedEmails) {
      const response = await fetch(`http://localhost:5000/api/users/unblock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Language': i18n.language,
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        alert(t('table.loading-error'));
        return;
      }
    }
    alert(t('table.unblock-success'));
    setSelectedEmails([]);
    fetchUsers();
  };

  const handleDeleteSelected = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    for (const email of selectedEmails) {
      const response = await fetch(`http://localhost:5000/api/users/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Language': i18n.language,
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        alert(t('table.loading-error'));
        return;
      }
    }
    alert(t('table.delete-success'));
    setSelectedEmails([]);
    fetchUsers();
  };

  return (
    <div className="userTable">
      <div className="userTable__header">
        <h2>{t('table.list')}</h2>
        {userName && (
          <p>
            {t('table.hello')}, {userName}!
          </p>
        )}
        <button onClick={handleLogout}>
          {t('table.logout')}
        </button>
      </div>

      <div className="userTable__actions">
        <button onClick={handleBlockSelected}>{t('table.block')}</button>
        <button onClick={handleUnblockSelected}>{t('table.unblock')}</button>
        <button onClick={handleDeleteSelected}>{t('table.delete')}</button>
      </div>

      <table className="userTable__table">
        <thead>
          <tr>
            <th>{t('table.select')}</th>
            <th>{t('table.name')}</th>
            <th>Email</th>
            <th>{t('table.status')}</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.email}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(user.email)}
                    onChange={() => toggleSelection(user.email)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.is_blocked ? t('table.blocked') : t('table.active')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>{t('table.found')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

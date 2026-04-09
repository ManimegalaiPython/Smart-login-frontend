import { useState } from 'react';
import api from '../service/api';

const SettingsView = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/api/change-password/', { old_password: oldPassword, new_password: newPassword });
      setMessage('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    }
  };

  return (
    <div>
      <h3>Account Settings</h3>
      <form onSubmit={handleChangePassword}>
        <div className="input-group">
          <label>Current Password</label>
          <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>New Password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary">Change Password</button>
        {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </form>
    </div>
  );
};

export default SettingsView;
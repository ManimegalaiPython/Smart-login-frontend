import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../service/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/password-reset/', { email });
      setMessage('Password reset link sent to your email.');
      setError('');
    } catch (err) {
      setError('Email not found or error sending email.');
      setMessage('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a reset link.</p>
        {message && <div style={{ color: 'green' }}>{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="signin-btn">Send Reset Link</button>
          <div className="footer-links">
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
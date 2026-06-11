import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Save token to localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Call success callback
      onLoginSuccess(response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      // Save token to localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Call success callback
      onLoginSuccess(response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🎨 Paint & Chemicals QR System</h1>
            <p>{isRegistering ? 'Create Admin Account' : 'Admin Login'}</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter admin username"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password (min 6 characters)"
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            {isRegistering && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>
            )}

            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Login')}
            </button>
          </form>

          <div className="form-footer">
            <p>
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                type="button"
                className="toggle-btn"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                  setFormData({ email: '', password: '', confirmPassword: '', username: '' });
                }}
                disabled={loading}
              >
                {isRegistering ? 'Login here' : 'Register here'}
              </button>
            </p>
          </div>

          <div className="login-info">
            <p>👤 Admin access only</p>
            <p>🔒 Your data is secure with JWT authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

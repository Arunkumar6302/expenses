import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.jpg';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) {
      alert("Please accept the Terms & Conditions and Privacy Policy.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        if (data.user.role === 'manager') navigate('/manager');
        else navigate('/employee');
      } else {
        alert(data.error);
        setIsLoading(false);
      }
    } catch (err) {
      alert('Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ position: 'relative' }}>
        <Link to="/" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--yellow)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} title="Back to Home">
          <ArrowLeft size={24} />
        </Link>
        <div className="auth-header">
          <Link to="/" className="logo">
            <img src={logo} alt="Shnoor Logo" className="auth-logo-img" />
            <span className="auth-logo-text">SHNOOR EXPENSE</span>
          </Link>
          <h2>Welcome Back</h2>
          <p>Sign in to manage your expenses</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="accept-terms" 
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--yellow)' }}
            />
            <label htmlFor="accept-terms" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              I accept the <Link to="/terms" style={{ color: 'var(--yellow-hover)' }}>Terms & Conditions</Link> and <Link to="/privacy-policy" style={{ color: 'var(--yellow-hover)' }}>Privacy Policy</Link>
            </label>
          </div>
          <button type="submit" className="btn-auth" disabled={isLoading} style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

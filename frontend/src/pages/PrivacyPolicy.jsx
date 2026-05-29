import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import logo from '../assets/logo.jpg';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--light-bg)', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--white)', padding: '3rem', borderRadius: '16px', position: 'relative', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        <button 
          onClick={() => navigate(-1)} 
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          aria-label="Close"
        >
          <X size={28} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <img src={logo} alt="Logo" style={{ width: '40px', borderRadius: '4px' }} />
          <h2 style={{ fontSize: '1.5rem', color: 'var(--dark-navy)', margin: 0 }}>SHNOOR EXPENSE</h2>
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>Privacy Policy</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Last updated: {new Date().getFullYear()}</p>
        
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
          At SHNOOR EXPENSE LLC, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our expense tracking application.
        </p>
        <h3 style={{ fontSize: '1.5rem', margin: '2rem 0 1rem', color: 'var(--dark-navy)' }}>Information We Collect</h3>
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
          We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products, or otherwise contact us.
          This includes names, email addresses, job titles, and financial receipts uploaded for approval.
        </p>
        <h3 style={{ fontSize: '1.5rem', margin: '2rem 0 1rem', color: 'var(--dark-navy)' }}>How We Use Your Information</h3>
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
          We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

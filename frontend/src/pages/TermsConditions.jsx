import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import logo from '../assets/logo.jpg';

const TermsConditions = () => {
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

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>Terms & Conditions</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Last updated: {new Date().getFullYear()}</p>
        
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
          Welcome to SHNOOR EXPENSE. These terms and conditions outline the rules and regulations for the use of SHNOOR EXPENSE LLC's Application.
        </p>
        <h3 style={{ fontSize: '1.5rem', margin: '2rem 0 1rem', color: 'var(--dark-navy)' }}>1. Acceptance of Terms</h3>
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
          By accessing this application we assume you accept these terms and conditions. Do not continue to use SHNOOR EXPENSE if you do not agree to take all of the terms and conditions stated on this page.
        </p>
        <h3 style={{ fontSize: '1.5rem', margin: '2rem 0 1rem', color: 'var(--dark-navy)' }}>2. License</h3>
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
          Unless otherwise stated, SHNOOR EXPENSE LLC and/or its licensors own the intellectual property rights for all material on SHNOOR EXPENSE. All intellectual property rights are reserved. You may access this from SHNOOR EXPENSE for your own personal use subjected to restrictions set in these terms and conditions.
        </p>
        <h3 style={{ fontSize: '1.5rem', margin: '2rem 0 1rem', color: 'var(--dark-navy)' }}>3. User Responsibilities</h3>
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
          Users are solely responsible for the accuracy of the expense reports and receipts uploaded to the system. Fraudulent uploads may result in account termination and legal action.
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;

import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MessageSquare, PhoneCall, MapPin } from 'lucide-react';
import logo from '../assets/logo.jpg';
import './LandingPage.css';

const Contact = () => {
  return (
    <div className="landing-page">
      {/* Dark Navbar */}
      <nav className="shnoor-navbar">
        <div className="container nav-container">
          <Link to="/" className="logo-section" style={{ textDecoration: 'none' }}>
            <div className="logo-icon-box" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={logo} alt="Shnoor Logo" style={{ width: '40px', height: 'auto', display: 'block' }} />
            </div>
            <div className="logo-text">
              <h2>SHNOOR EXPENSE</h2>
              <span>FINANCIAL SOLUTIONS LLC</span>
            </div>
          </Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
      </nav>

      <section style={{ padding: '6rem 0', backgroundColor: 'var(--light-bg)', minHeight: '70vh' }}>
        <div className="container" style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--dark-navy)', marginBottom: '1rem', fontWeight: 800 }}>Get in Touch</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Have questions about SHNOOR EXPENSE? Our team is here to help you set up your automated workflows and manage your financial tracking efficiently.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--white)', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <Mail color="var(--yellow)" size={24} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--dark-navy)' }}>General Inquiries</strong>
                  <span style={{ color: 'var(--text-muted)' }}>info@shnoor.com</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--white)', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <PhoneCall color="var(--yellow)" size={24} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--dark-navy)' }}>Sales & Support</strong>
                  <span style={{ color: 'var(--text-muted)' }}>proc@shnoor.com</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--white)', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <MapPin color="var(--yellow)" size={24} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--dark-navy)' }}>Headquarters</strong>
                  <span style={{ color: 'var(--text-muted)' }}>10009 Mount Tabor Road, Odessa Missouri</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, backgroundColor: 'var(--white)', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--dark-navy)' }}>Send us a Message</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Your Name</label>
                <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'var(--light-bg)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Email Address</label>
                <input type="email" placeholder="name@company.com" style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'var(--light-bg)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Message</label>
                <textarea rows="4" placeholder="How can we help?" style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'var(--light-bg)', fontFamily: 'inherit' }}></textarea>
              </div>
              <button type="button" style={{ backgroundColor: 'var(--yellow)', color: 'var(--dark-navy)', padding: '1rem', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
                SUBMIT MESSAGE
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Dark Footer */}
      <footer className="shnoor-footer">
        <div className="container footer-grid">
          <div className="footer-col brand-col">
            <h3>SHNOOR EXPENSE LLC</h3>
            <p className="copyright">©Copyrights {new Date().getFullYear()}. All Rights Reserved.</p>
            <div className="footer-links-stacked">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms">Terms & Conditions</Link>
              <a href="#">Company Profile</a>
            </div>
            <div className="social-icons">
              <Globe size={20} />
              <Mail size={20} />
              <MessageSquare size={20} />
              <PhoneCall size={20} />
            </div>
          </div>
          <div className="footer-col">
            <h4>Contacts</h4>
            <ul className="contact-list">
              <li><Mail size={16} /> info@shnoor.com (General)</li>
              <li><Mail size={16} /> proc@shnoor.com (Sales)</li>
            </ul>
            <h4 className="mt-4">Location</h4>
            <p className="location-text">
              10009 Mount Tabor Road, Odessa Missouri,<br />
              United States
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;

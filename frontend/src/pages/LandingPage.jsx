import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MessageSquare, PhoneCall, ChevronDown, Menu, X } from 'lucide-react';
import logo from '../assets/logo.jpg';
import './LandingPage.css';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#benefits">Benefits</a></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>

          <button className="mobile-menu-btn" aria-label="Toggle navigation menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-dropdown">
            <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#benefits" onClick={() => setIsMobileMenuOpen(false)}>Benefits</a>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="shnoor-hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>
              Bridging Efficiency and Tracking with Expert IT Solutions and <span className="highlight-yellow">Global Reach</span>
            </h1>
            <p>
              SHNOOR EXPENSE works progressively in various financial tracking needs,
              focusing primarily on Expense Reporting, Manager Approvals, Receipt Uploads, and Automated Budgets.
            </p>
            <p>
              Headquartered in your workspace, beyond basic tracking, we also specialize in 
              providing secure enterprise-grade analytics—building strong financial bridges and lasting transparency worldwide.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-yellow">DISCOVER SOLUTIONS</Link>
              <Link to="/contact" className="btn-white">CONTACT US</Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800" 
              alt="Team working on finances" 
              className="hero-image"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '5rem 0', backgroundColor: 'var(--white)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--dark-navy)', marginBottom: '1.5rem', fontWeight: 800 }}>About SHNOOR EXPENSE</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
            SHNOOR EXPENSE is a comprehensive financial tracking solution designed to streamline the way 
            businesses manage their expenses. By bringing together intuitive receipt uploads, seamless manager approvals, 
            and real-time financial reporting, we empower organizations to maintain complete transparency over their budgets.
          </p>
        </div>
      </section>

      {/* Latest News / Insights */}
      <section id="benefits" className="shnoor-insights">
        <div className="container">
          <div className="insights-header">
            <span className="insights-subtitle">INSIGHTS</span>
            <h2>Latest News</h2>
          </div>
          <div className="insights-grid">
            {/* Card 1 */}
            <div className="insight-card">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" alt="News 1" loading="lazy" />
              <div className="insight-content">
                <h3>Automated Approvals: A Comprehensive Overview, Features, and Business Benefits</h3>
                <p>Learn how SHNOOR EXPENSE helps businesses manage receipts, budgets, and vendor processes efficiently.</p>
                <div className="insight-footer">
                  <span className="date">12/16/2025</span>
                  <span className="read-time">2 min read</span>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="insight-card">
              <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=600" alt="News 2" loading="lazy" />
              <div className="insight-content">
                <h3>Receipt Tracking Solutions for Employees: Simplifying Expense Operations</h3>
                <p>Discover reliable expense tracking solutions for your team. Learn about submission processes, documentation, and manager clearance.</p>
                <div className="insight-footer">
                  <span className="date">12/15/2025</span>
                  <span className="read-time">3 min read</span>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="insight-card">
              <img src="https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?auto=format&fit=crop&q=80&w=600" alt="News 3" loading="lazy" />
              <div className="insight-content">
                <h3>Building Trust and Security Through Reliable Financial Analytics Services</h3>
                <p>Protect your organization with our professional budget verification solutions. We help you validate employee expenses instantly.</p>
                <div className="insight-footer">
                  <span className="date">10/14/2025</span>
                  <span className="read-time">2 min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="shnoor-testimonial">
        <div className="container">
          <div className="testimonial-box">
            <div className="stars center">
              <span style={{ color: '#f59e0b', fontSize: '24px' }}>★</span>
              <span style={{ color: '#f59e0b', fontSize: '24px' }}>★</span>
              <span style={{ color: '#f59e0b', fontSize: '24px' }}>★</span>
              <span style={{ color: '#f59e0b', fontSize: '24px' }}>★</span>
              <span style={{ color: '#f59e0b', fontSize: '24px' }}>★</span>
            </div>
            <p>
              "Working with SHNOOR EXPENSE LLC has been a game-changer for our business. Their IT consulting team understood our requirements perfectly and delivered a custom solution that improved our efficiency by leaps and bounds. On top of that, their expense services were smooth, reliable, and hassle-free. It's rare to find a partner who excels in both technology and finances—SHNOOR EXPENSE does it effortlessly."
            </p>
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

export default LandingPage;

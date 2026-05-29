import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, X } from 'lucide-react';
import toast from 'react-hot-toast';

const UserProfileDropdown = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
        setUser(payload);
        setSettingsForm({ name: payload.name || '', email: payload.email || '', password: '' });
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setShowSettings(false);
        setIsOpen(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  // Get first letter of name
  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--yellow)', color: 'var(--dark-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
      >
        {firstLetter}
      </button>

      {isOpen && (
        <div style={{ position: 'absolute', top: '50px', right: '0', backgroundColor: 'var(--white)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', minWidth: '250px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 100 }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--dark-navy)' }}>{user.name}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => { setShowSettings(true); setIsOpen(false); }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--light-bg)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--dark-navy)', fontSize: '0.85rem' }}
            >
              <Settings size={14} /> Profile Setting
            </button>
            <button 
              onClick={handleLogout}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', color: '#dc2626', fontSize: '0.85rem' }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: 'var(--dark-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User /> Profile Settings</h2>
              <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Full Name</label>
                <input type="text" value={settingsForm.name} onChange={e => setSettingsForm({...settingsForm, name: e.target.value})} required style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '6px' }} />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Email Address</label>
                <input type="email" value={settingsForm.email} onChange={e => setSettingsForm({...settingsForm, email: e.target.value})} required style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '6px' }} />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark-navy)' }}>New Password (Optional)</label>
                <input type="password" placeholder="Leave blank to keep current" value={settingsForm.password} onChange={e => setSettingsForm({...settingsForm, password: e.target.value})} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '6px' }} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--yellow)', color: 'var(--dark-navy)', border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '1rem', marginTop: '1rem', cursor: 'pointer' }}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;

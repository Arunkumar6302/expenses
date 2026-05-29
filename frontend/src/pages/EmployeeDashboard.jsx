import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Upload, DollarSign, CheckCircle, Clock, CreditCard } from 'lucide-react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import PaidExpensesCard from '../components/PaidExpensesCard';
import UserProfileDropdown from '../components/UserProfileDropdown';
import logo from '../assets/logo.jpg';
import './Dashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '', amount: '', datetime: '', reference_number: '', notes: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const user = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));

      if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }

      const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");
      socket.emit('join', user);

      socket.on('expense_status_update', (data) => {
        toast.success(data.message, { icon: '🔔' });
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Expense Update', { body: data.message });
        }
        fetchExpenses();
      });

      fetchExpenses();

      return () => socket.disconnect();
    }
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (file) data.append('bill', file);

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/expenses`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({ category: '', amount: '', datetime: '', reference_number: '', notes: '' });
        setFile(null);
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = (status) => {
    return expenses
      .filter(e => status ? e.status === status : true)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0)
      .toFixed(2);
  };

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <div className="dash-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} alt="Shnoor" style={{ height: '30px' }} />
          <h2>SHNOOR EXPENSE</h2>
        </div>
        <UserProfileDropdown />
      </nav>

      <div className="dashboard-content">
        <div className="dash-header">
          <h1>Employee Dashboard</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-yellow">
            <Plus size={18} /> Add New Expense
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: 'var(--dark-navy)' }}><DollarSign /></div>
            <div className="stat-info">
              <span>Total Expenses</span>
              <h3>${calculateTotal()}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: 'var(--yellow)' }}><Clock /></div>
            <div className="stat-info">
              <span>Pending</span>
              <h3>${calculateTotal('Pending')}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}><CheckCircle /></div>
            <div className="stat-info">
              <span>Approved</span>
              <h3>${calculateTotal('Approved')}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#6366f1' }}><CreditCard /></div>
            <div className="stat-info">
              <span>Paid</span>
              <h3>${calculateTotal('Paid')}</h3>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="expense-form-card">
            <h2>Add New Expense</h2>
            <form onSubmit={handleSubmit} className="expense-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    className="form-input" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    required
                  >
                    <option value="">Select Category...</option>
                    <option value="Travel">Travel</option>
                    <option value="Meals">Meals</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Software & Subscriptions">Software & Subscriptions</option>
                    <option value="Client Entertainment">Client Entertainment</option>
                    <option value="Transportation">Transportation & Mileage</option>
                    <option value="Internet & Phone">Internet & Phone</option>
                    <option value="Accommodation">Accommodation / Hotel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input" 
                    value={formData.amount} 
                    onChange={e => setFormData({...formData, amount: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date & Time</label>
                  <input 
                    type="datetime-local" 
                    className="form-input" 
                    value={formData.datetime} 
                    onChange={e => setFormData({...formData, datetime: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Reference Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.reference_number} 
                    onChange={e => setFormData({...formData, reference_number: e.target.value})} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Expense Bill / Receipt</label>
                <div className="file-upload-box">
                  <Upload size={24} className="icon-yellow" />
                  <input 
                    type="file" 
                    onChange={e => setFile(e.target.files[0])} 
                    className="file-input"
                  />
                  <span>Click to upload receipt</span>
                </div>
                {file && <span className="file-name">{file.name}</span>}
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})} 
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-yellow" disabled={isSubmitting} style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'SUBMITTING...' : 'Submit Expense'}
                </button>
              </div>
            </form>
          </div>
        )}

        <PaidExpensesCard expenses={expenses} />

        <div className="table-container">
          <h2>Expense History</h2>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td>{new Date(exp.datetime).toLocaleString()}</td>
                  <td>{exp.category}</td>
                  <td>${parseFloat(exp.amount).toFixed(2)}</td>
                  <td>{exp.reference_number || '-'}</td>
                  <td><span className={`status-badge ${exp.status.toLowerCase()}`}>{exp.status}</span></td>
                  <td>
                    {exp.bill_url ? <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${exp.bill_url}`} target="_blank" rel="noreferrer">View</a> : '-'}
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">No expenses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

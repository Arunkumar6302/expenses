import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, DollarSign, Filter, Check, X, CreditCard, Clock, CheckCircle, Edit, Trash } from 'lucide-react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import UserProfileDropdown from '../components/UserProfileDropdown';
import logo from '../assets/logo.jpg';
import './Dashboard.css';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('All');
  
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    category: '', amount: '', datetime: '', reference_number: '', notes: ''
  });

  const [payingExpenseId, setPayingExpenseId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    method: 'Credit Card', card: '', expiry: '', cvv: '', name: ''
  });

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

      socket.on('new_expense', (data) => {
        toast(data.message, { icon: '📝' });
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Expense', { body: data.message });
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/expenses/all`, {
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

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/expenses/${id}/status`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExpense = async (id) => {
    if(!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (exp) => {
    setEditingExpense(exp.id);
    const dateStr = new Date(exp.datetime).toISOString().slice(0, 16);
    setEditForm({
      category: exp.category,
      amount: exp.amount,
      datetime: dateStr,
      reference_number: exp.reference_number || '',
      notes: exp.notes || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/expenses/${editingExpense}`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setEditingExpense(null);
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate real-world payment processing delay
    setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/expenses/${payingExpenseId}/pay`, {
          method: 'PUT',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ paymentDetails })
        });
        
        if (res.ok) {
          toast.success("Payment processed successfully!");
          setPayingExpenseId(null);
          setPaymentDetails({ method: 'Credit Card', card: '', expiry: '', cvv: '', name: '' });
          fetchExpenses();
        }
      } catch (err) {
        console.error(err);
        toast.error("Payment failed.");
      } finally {
        setIsProcessing(false);
      }
    }, 1500); // 1.5s simulated checkout delay
  };

  const filteredExpenses = expenses.filter(e => filter === 'All' ? true : e.status === filter);

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

      <main className="dashboard-content">
        <div className="dash-header">
          <h1>Manager Dashboard</h1>
          <div className="filter-box">
            <Filter size={18} className="icon-yellow" />
            <select aria-label="Filter expenses by status" value={filter} onChange={e => setFilter(e.target.value)} className="form-input" style={{ width: 'auto', padding: '0.4rem 1rem' }}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: 'var(--dark-navy)' }}><DollarSign /></div>
            <div className="stat-info">
              <span>Total Team Expenses</span>
              <h2>${calculateTotal()}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: 'var(--yellow)' }}><Clock /></div>
            <div className="stat-info">
              <span>Pending Review</span>
              <h2>${calculateTotal('Pending')}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}><CheckCircle /></div>
            <div className="stat-info">
              <span>Total Approved</span>
              <h2>${calculateTotal('Approved')}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#6366f1' }}><CreditCard /></div>
            <div className="stat-info">
              <span>Total Paid</span>
              <h2>${calculateTotal('Paid')}</h2>
            </div>
          </div>
        </div>

        {editingExpense && (
          <div className="expense-form-card" style={{ marginBottom: '2rem' }}>
            <h2>Edit Expense</h2>
            <form onSubmit={handleEditSubmit} className="expense-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} required>
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
                  <input type="number" step="0.01" className="form-input" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date & Time</label>
                  <input type="datetime-local" className="form-input" value={editForm.datetime} onChange={e => setEditForm({...editForm, datetime: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Reference Number</label>
                  <input type="text" className="form-input" value={editForm.reference_number} onChange={e => setEditForm({...editForm, reference_number: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea className="form-input" rows="3" value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})}></textarea>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setEditingExpense(null)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-yellow" disabled={isSaving} style={{ cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1 }}>
                  {isSaving ? 'SAVING...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-container">
          <h2>Team Expenses</h2>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Receipt</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(exp => (
                <tr key={exp.id}>
                  <td>
                    <strong>{exp.employee_name}</strong><br/>
                    <small style={{ color: 'var(--text-muted)' }}>{exp.employee_email}</small>
                  </td>
                  <td>{new Date(exp.datetime).toLocaleString()}</td>
                  <td>{exp.category}</td>
                  <td>${parseFloat(exp.amount).toFixed(2)}</td>
                  <td>
                    {exp.bill_url ? <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${exp.bill_url}`} target="_blank" rel="noreferrer">View</a> : '-'}
                  </td>
                  <td><span className={`status-badge ${exp.status.toLowerCase()}`}>{exp.status}</span></td>
                  <td>
                    <div className="action-buttons">
                      {/* Status Buttons */}
                      {exp.status === 'Pending' && (
                        <>
                          <button onClick={() => updateStatus(exp.id, 'Approved')} className="btn-action approve" title="Approve">
                            <Check size={16} />
                          </button>
                          <button onClick={() => updateStatus(exp.id, 'Rejected')} className="btn-action reject" title="Reject">
                            <X size={16} />
                          </button>
                        </>
                      )}
                      {exp.status === 'Approved' && (
                        <button onClick={() => setPayingExpenseId(exp.id)} className="btn-action pay" title="Process Payment">
                          <CreditCard size={16} /> Pay
                        </button>
                      )}
                      
                      {/* Edit and Delete Buttons */}
                      <button onClick={() => openEditModal(exp)} className="btn-action" style={{ backgroundColor: 'var(--yellow)', color: 'var(--dark-navy)' }} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteExpense(exp.id)} className="btn-action" style={{ backgroundColor: '#64748b' }} title="Delete">
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">No expenses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Payment Modal */}
        {payingExpenseId && (
          <div className="payment-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <div className="payment-modal" style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, color: 'var(--dark-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CreditCard /> Checkout Payment</h2>
                <button onClick={() => setPayingExpenseId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>
              
              <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Payment Method</label>
                  <select className="form-input" value={paymentDetails.method} onChange={e => setPaymentDetails({...paymentDetails, method: e.target.value})}>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Card Number</label>
                  <input type="text" className="form-input" placeholder="0000 0000 0000 0000" maxLength="19" required value={paymentDetails.card} onChange={e => setPaymentDetails({...paymentDetails, card: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Expiry Date</label>
                    <input type="text" className="form-input" placeholder="MM/YY" maxLength="5" required value={paymentDetails.expiry} onChange={e => setPaymentDetails({...paymentDetails, expiry: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark-navy)' }}>CVV</label>
                    <input type="text" className="form-input" placeholder="123" maxLength="4" required value={paymentDetails.cvv} onChange={e => setPaymentDetails({...paymentDetails, cvv: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Cardholder Name</label>
                  <input type="text" className="form-input" placeholder="John Doe" required value={paymentDetails.name} onChange={e => setPaymentDetails({...paymentDetails, name: e.target.value})} />
                </div>
                <button type="submit" disabled={isProcessing} style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--dark-navy)', color: 'var(--yellow)', border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '1rem', marginTop: '1rem', cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                  {isProcessing ? 'PROCESSING...' : 'PAY NOW'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;

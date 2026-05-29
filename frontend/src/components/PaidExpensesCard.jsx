import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, CheckCircle, FileText } from 'lucide-react';
import logo from '../assets/logo.jpg';

const PaidExpensesCard = ({ expenses }) => {
  const paidExpenses = expenses.filter(e => e.status === 'Paid');

  const generatePDF = (expense) => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(22);
      doc.setTextColor(11, 17, 32); // var(--dark-navy)
      doc.text('SHNOOR EXPENSE', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text('FINANCIAL SOLUTIONS LLC', 14, 26);
      
      doc.setFontSize(16);
      doc.setTextColor(245, 158, 11); // var(--yellow)
      doc.text('Payment Receipt', 14, 40);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Receipt ID: RE-${expense.id}-${Date.now().toString().slice(-4)}`, 14, 50);
      doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 14, 55);

      // Parse Payment Details from notes if present
      let rawNotes = expense.notes || 'None';
      let paymentInfo = null;
      
      if (rawNotes.includes('[PAYMENT DETAILS]')) {
        const parts = rawNotes.split('[PAYMENT DETAILS]');
        rawNotes = parts[0].trim() || 'None';
        paymentInfo = parts[1].trim();
      }

      // Table Data
      const tableData = [
        ['Expense Category', expense.category],
        ['Date Incurred', new Date(expense.datetime).toLocaleString()],
        ['Reference Number', expense.reference_number || 'N/A'],
        ['Status', 'PAID IN FULL'],
        ['Notes', rawNotes]
      ];

      autoTable(doc, {
        startY: 65,
        head: [['Description', 'Details']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [11, 17, 32], textColor: [255, 255, 255] },
        styles: { fontSize: 10 }
      });

      let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 120;
      doc.setFontSize(14);
      doc.setTextColor(11, 17, 32);
      doc.text(`Total Amount Paid: $${parseFloat(expense.amount).toFixed(2)}`, 14, finalY + 15);
      finalY += 15;

      if (paymentInfo) {
        doc.setFontSize(12);
        doc.setTextColor(245, 158, 11);
        doc.text('Payment Processing Details:', 14, finalY + 15);
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        const paymentLines = paymentInfo.split('\n');
        paymentLines.forEach((line, index) => {
          doc.text(line, 14, finalY + 22 + (index * 6));
        });
        finalY += 22 + (paymentLines.length * 6);
      } else {
        finalY += 15;
      }

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text('Thank you for using SHNOOR EXPENSE.', 14, finalY + 15);
      doc.text('This is an automatically generated receipt.', 14, finalY + 20);

      doc.save(`Shnoor_Receipt_${expense.id}.pdf`);
    } catch (err) {
      console.error("PDF Generation Error:", err);
    }
  };

  if (paidExpenses.length === 0) return null;

  return (
    <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--dark-navy)' }}>
        <CheckCircle color="#10b981" size={24} />
        <h2 style={{ margin: 0 }}>Available Paid Receipts</h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        The following expenses have been fully paid. You can download the official PDF receipt for your records.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {paidExpenses.map(exp => (
          <div key={exp.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--dark-navy)' }}>{exp.category}</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(exp.datetime).toLocaleDateString()}</span>
              </div>
              <h3 style={{ margin: 0, color: 'var(--yellow)', fontSize: '1.25rem' }}>${parseFloat(exp.amount).toFixed(2)}</h3>
            </div>
            
            <button 
              onClick={() => generatePDF(exp)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', backgroundColor: 'var(--light-bg)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--dark-navy)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--yellow)'; e.currentTarget.style.borderColor = 'var(--yellow)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--light-bg)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <Download size={16} /> Download Receipt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaidExpensesCard;

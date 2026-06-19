import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other'];

export default function ExpenseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', amount: '', category: 'Shopping', date: '', description: '' });
  const [error, setError] = useState('');
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/expenses/${id}`)
        .then(({ data }) => {
          setForm({
            title: data.title,
            amount: data.amount,
            category: data.category,
            date: data.date ? data.date.slice(0, 10) : '',
            description: data.description || '',
          });
        })
        .catch(() => navigate('/'));
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, amount:Number(form.amount) };
      if (isEdit) {
        await axios.put(`/api/expenses/${id}`, payload);
      } else {
        await axios.post('/api/expenses', payload);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 500 }}>
      <h2>{isEdit ? 'Edit Expense' : 'Add Expense'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input type="number" step="0.01" className="form-control" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Add'} Expense</button>
        {/* <button type='submit' className='btn btn-primary'>{isEdit ? 'update' :'Add'}Expense</button> */}
      </form>
    </div>
  );
}

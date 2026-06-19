import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other'];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('All');

  const fetchExpenses = async () => {
    const params = {};
    if (category !== 'All') params.category = category;
    const { data } = await axios.get('/api/expenses', { params });
    setExpenses(data);
  };

  useEffect(() => { fetchExpenses(); }, [category]);

 

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await axios.delete(`/api/expenses/${id}`);
    fetchExpenses();
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Expenses</h5>
              <h3>${total.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
       
        </div>
        <div className="col-md-3">
          <select className='form-select' value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-md-3 text-end">
          <Link to="/expenses/new" className="btn btn-success">Add Expense</Link>
        </div>
      </div>

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
          
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr><td colSpan="5" className="text-center">No expenses found</td></tr>
          ) : (
            expenses.map((exp) => (
              <tr key={exp._id}>
                <td>{exp.title}</td>
                <td>${exp.amount.toFixed(2)}</td>
                <td><span className="badge bg-info">{exp.category}</span></td>
                <td>{new Date(exp.date).toLocaleDateString()}</td>
                <td>
                  <Link to={`/expenses/edit/${exp._id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

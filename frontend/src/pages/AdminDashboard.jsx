import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
import { getAllCategory, updateSubCategoryAmount } from '../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Update Modal State
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    name: '',
    amount: '',
    categoryName: ''
  });
  const [updateError, setUpdateError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError('');
    try {
      const data = await getAllCategory();
      setCategoryData(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    removeToken();
    navigate('/login', { replace: true });
  }

  function openUpdateModal(subCat, categoryName) {
    setUpdateForm({
      name: subCat.name,
      amount: String(subCat.amount),
      categoryName: categoryName
    });
    setUpdateError('');
    setSuccessMessage('');
    setShowUpdateModal(true);
  }

  function handleUpdateChange(e) {
    setUpdateForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setUpdateError('');
  }

  async function handleUpdateSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(updateForm.amount);
    if (updateForm.amount === '' || isNaN(amount)) {
      setUpdateError('Please enter a valid amount.');
      return;
    }

    setUpdateLoading(true);
    try {
      await updateSubCategoryAmount({
        name: updateForm.name,
        amount: amount,
        categoryName: updateForm.categoryName
      });
      setShowUpdateModal(false);
      setSuccessMessage(`Amount updated for "${updateForm.name}".`);
      fetchData();
    } catch (err) {
      setUpdateError(err.message || 'Failed to updateDTO amount.');
    } finally {
      setUpdateLoading(false);
    }
  }

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <header className="dashboard-header">
        <div className="brand-name">HERO<span className="brand-highlight">CYCLE</span></div>
        <button className="btn-secondary" onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="panel-title">Admin Dashboard</h1>
          <p className="panel-subtitle">View categories and updateDTO subcategory prices</p>
        </div>

        {successMessage && (
          <div className="alert-success" style={{ marginBottom: '1rem' }}>
            {successMessage}
          </div>
        )}

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : categoryData.length === 0 ? (
          <div className="table-wrapper">
            <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              No categories have been assigned to you yet.
            </p>
          </div>
        ) : (
          <div className="tables-layout">
            {categoryData.map((catResponse, catIdx) => {
              const cat = catResponse.categoryDTO;
              const subs = catResponse.subCategoryDTOS || [];
              return (
                <div key={catIdx}>
                  {/* Category Header Row */}
                  <div className="category-header-row">
                    <span className="category-header-name">{cat.name}</span>
                    <span className="category-header-amount">
                      Total Amount: <strong>₹{cat.totalAmount?.toFixed(2) ?? '0.00'}</strong>
                    </span>
                  </div>

                  {/* SubCategory Table */}
                  <div className="table-wrapper">
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>Sub Category</th>
                          <th>Amount</th>
                          <th style={{ width: '120px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subs.length === 0 ? (
                          <tr>
                            <td colSpan="3" style={{ textAlign: 'center', color: '#6b7280', padding: '1.5rem' }}>
                              No subcategories under this category.
                            </td>
                          </tr>
                        ) : (
                          subs.map((sub, subIdx) => (
                            <tr key={subIdx}>
                              <td style={{ fontWeight: 'bold' }}>{sub.name}</td>
                              <td>₹{sub.amount?.toFixed(2) ?? '0.00'}</td>
                              <td>
                                <button
                                  className="btn-updateDTO"
                                  onClick={() => openUpdateModal(sub, cat.name)}
                                >
                                  Update
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Update Amount Modal */}
      {showUpdateModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Update Amount</h2>
              <button className="btn-close" onClick={() => setShowUpdateModal(false)}>×</button>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
              Updating price for sub category: <strong>{updateForm.name}</strong>
              <br />
              Under category: <strong>{updateForm.categoryName}</strong>
            </p>

            {updateError && <div className="alert-error">{updateError}</div>}

            <form onSubmit={handleUpdateSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label>New Amount</label>
                <div className="input-wrapper">
                  <input
                    name="amount"
                    type="text"
                    placeholder="Enter new amount"
                    value={updateForm.amount}
                    onChange={handleUpdateChange}
                    autoFocus
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowUpdateModal(false)}
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={updateLoading}>
                  {updateLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

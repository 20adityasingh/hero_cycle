import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
import { getAllCategory } from '../utils/api';

export default function SalespersonDashboard() {
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError('');
    try {
      let data = await getAllCategory();
      data = data || [];
      data.sort((a, b) => a.categoryDTO.name.localeCompare(b.categoryDTO.name));
      data.forEach(cat => {
        if (cat.subCategoryDTOS) {
          cat.subCategoryDTOS.sort((a, b) => a.name.localeCompare(b.name));
        }
      });
      setCategoryData(data);
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

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <header className="dashboard-header">
        <div className="brand-name">HERO<span className="brand-highlight">CYCLE</span></div>
        <button className="btn-secondary" onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="panel-title">Salesperson Dashboard</h1>
          <p className="panel-subtitle">View your assigned categories and current subcategory prices</p>
        </div>

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
                        </tr>
                      </thead>
                      <tbody>
                        {subs.length === 0 ? (
                          <tr>
                            <td colSpan="2" style={{ textAlign: 'center', color: '#6b7280', padding: '1.5rem' }}>
                              No subcategories under this category.
                            </td>
                          </tr>
                        ) : (
                          subs.map((sub, subIdx) => (
                            <tr key={subIdx}>
                              <td style={{ fontWeight: 'bold' }}>{sub.name}</td>
                              <td>₹{sub.amount?.toFixed(2) ?? '0.00'}</td>
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
    </div>
  );
}

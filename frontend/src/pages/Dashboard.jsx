import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
import {
  getAllAssignment,
  createAdminOrSalesperson,
  getAllCategoryNames,
  getAllSubCategoryNames,
  createCategory,
  createSubCategory
} from '../utils/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Assignment Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: '',
    username: '',
    password: '',
    role: 'ADMIN',
    category: '',
    subCategory: ''
  });
  const [adminErrors, setAdminErrors] = useState({});
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminServerError, setAdminServerError] = useState('');

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [categoryErrors, setCategoryErrors] = useState({});
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryServerError, setCategoryServerError] = useState('');

  // SubCategory Modal State
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: '',
    amount: '',
    categoryName: ''
  });
  const [subCategoryErrors, setSubCategoryErrors] = useState({});
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);
  const [subCategoryServerError, setSubCategoryServerError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    setError('');
    try {
      const [assignmentData, catNames, subCatNames] = await Promise.all([
        getAllAssignment(),
        getAllCategoryNames(),
        getAllSubCategoryNames()
      ]);
      setAssignments(assignmentData || []);
      setCategories(catNames || []);
      setSubCategories(subCatNames || []);

      const defaultCat = catNames[0]?.name || '';
      const availableSubs = (subCatNames || []).filter((s) => s.categoryName === defaultCat);
      const defaultSub = availableSubs[0]?.name || '';

      setAdminForm((prev) => ({
        ...prev,
        category: defaultCat,
        subCategory: defaultSub
      }));

      setSubCategoryForm((prev) => ({
        ...prev,
        categoryName: defaultCat
      }));
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    removeToken();
    navigate('/login', { replace: true });
  }

  function handleOpenAdminModal() {
    const defaultCat = categories[0]?.name || '';
    const availableSubs = subCategories.filter((s) => s.categoryName === defaultCat);
    const defaultSub = availableSubs[0]?.name || '';

    setAdminForm({
      name: '',
      username: '',
      password: '',
      role: 'ADMIN',
      category: defaultCat,
      subCategory: defaultSub
    });
    setAdminErrors({});
    setAdminServerError('');
    setShowAdminModal(true);
  }

  // ─── ADMIN FORM HANDLERS ───
  function handleAdminChange(e) {
    const { name, value } = e.target;
    setAdminErrors((prev) => ({ ...prev, [name]: '' }));
    setAdminServerError('');

    if (name === 'category') {
      const availableSubs = subCategories.filter((s) => s.categoryName === value);
      const firstSub = availableSubs[0]?.name || '';
      setAdminForm((prev) => ({
        ...prev,
        category: value,
        subCategory: firstSub
      }));
    } else {
      setAdminForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validateAdmin() {
    const e = {};
    if (!adminForm.name.trim()) e.name = 'Name is required.';
    if (!adminForm.username.trim()) e.username = 'Username is required.';
    if (!adminForm.password) e.password = 'Password is required.';
    if (!adminForm.role) e.role = 'Role is required.';
    if (!adminForm.category) e.category = 'Category is required.';
    if (!adminForm.subCategory) e.subCategory = 'Subcategory is required.';
    return e;
  }

  async function handleAdminSubmit(e) {
    e.preventDefault();
    const validationErrors = validateAdmin();
    if (Object.keys(validationErrors).length > 0) {
      setAdminErrors(validationErrors);
      return;
    }

    setAdminLoading(true);
    setAdminServerError('');
    try {
      await createAdminOrSalesperson(adminForm);
      setShowAdminModal(false);
      fetchDashboardData();
    } catch (err) {
      setAdminServerError(err.message || 'Failed to assign role.');
    } finally {
      setAdminLoading(false);
    }
  }

  // ─── CATEGORY FORM HANDLERS ───
  function handleCategoryChange(e) {
    setCategoryForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setCategoryErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setCategoryServerError('');
  }

  function validateCategory() {
    const e = {};
    const name = categoryForm.name.trim();
    if (!name) {
      e.name = 'Category name cannot be empty.';
    } else if (name.length < 1 || name.length > 15) {
      e.name = 'Category name must be between 1 and 15 characters.';
    }
    return e;
  }

  async function handleCategorySubmit(e) {
    e.preventDefault();
    const validationErrors = validateCategory();
    if (Object.keys(validationErrors).length > 0) {
      setCategoryErrors(validationErrors);
      return;
    }

    setCategoryLoading(true);
    setCategoryServerError('');
    try {
      await createCategory({
        name: categoryForm.name.trim(),
        totalAmount: 0
      });
      setCategoryForm({ name: '' });
      setShowCategoryModal(false);
      fetchDashboardData();
    } catch (err) {
      setCategoryServerError(err.message || 'Failed to create category.');
    } finally {
      setCategoryLoading(false);
    }
  }

  // ─── SUBCATEGORY FORM HANDLERS ───
  function handleSubCategoryChange(e) {
    setSubCategoryForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSubCategoryErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setSubCategoryServerError('');
  }

  function validateSubCategory() {
    const e = {};
    const name = subCategoryForm.name.trim();
    if (!name) {
      e.name = 'SubCategory name cannot be empty.';
    } else if (name.length < 1 || name.length > 15) {
      e.name = 'SubCategory name must be between 1 and 15 characters.';
    }

    if (subCategoryForm.amount === '') {
      e.amount = 'Price is required.';
    } else if (isNaN(parseFloat(subCategoryForm.amount))) {
      e.amount = 'Price must be a valid number.';
    }

    if (!subCategoryForm.categoryName) {
      e.categoryName = 'Please select a parent category.';
    }
    return e;
  }

  async function handleSubCategorySubmit(e) {
    e.preventDefault();
    const validationErrors = validateSubCategory();
    if (Object.keys(validationErrors).length > 0) {
      setSubCategoryErrors(validationErrors);
      return;
    }

    setSubCategoryLoading(true);
    setSubCategoryServerError('');
    try {
      await createSubCategory({
        name: subCategoryForm.name.trim(),
        amount: parseFloat(subCategoryForm.amount),
        categoryName: subCategoryForm.categoryName
      });
      setSubCategoryForm({ name: '', amount: '', categoryName: categories[0]?.name || '' });
      setShowSubCategoryModal(false);
      fetchDashboardData();
    } catch (err) {
      setSubCategoryServerError(err.message || 'Failed to create subcategory.');
    } finally {
      setSubCategoryLoading(false);
    }
  }

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="dashboard-header">
        <div className="brand-name">HERO<span className="brand-highlight">CYCLE</span></div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-content">
        <div className="panel-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <h1 className="panel-title">Super Admin Dashboard</h1>
            <p className="panel-subtitle">Manage categories, subcategories, and user assignments</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={handleOpenAdminModal}>
              Create Admin / Salesperson
            </button>
            <button className="btn-secondary" onClick={() => setShowCategoryModal(true)}>
              Create Category
            </button>
            <button className="btn-secondary" onClick={() => setShowSubCategoryModal(true)}>
              Create Sub Category
            </button>
          </div>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <div className="tables-layout">
            {/* Assignments Table */}
            <div>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                User Assignments ({assignments.length})
              </h2>
              <div className="table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Sub Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                          No assignments found. Use the buttons above to build categories and assign users.
                        </td>
                      </tr>
                    ) : (
                      assignments.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 'bold' }}>{item.adminName}</td>
                          <td>{item.categoryName}</td>
                          <td>{item.subCategoryName}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side-by-side Categories and SubCategories Tables */}
            <div className="sub-tables-grid">
              {/* Categories Table */}
              <div>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Available Categories ({categories.length})
                </h2>
                <div className="table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Category Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td style={{ textAlign: 'center', color: '#6b7280', padding: '1.5rem' }}>
                            No categories created yet.
                          </td>
                        </tr>
                      ) : (
                        categories.map((cat, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 'bold' }}>{cat.name}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SubCategories Table */}
              <div>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Available Sub Categories ({subCategories.length})
                </h2>
                <div className="table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Sub Category Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subCategories.length === 0 ? (
                        <tr>
                          <td style={{ textAlign: 'center', color: '#6b7280', padding: '1.5rem' }}>
                            No subcategories created yet.
                          </td>
                        </tr>
                      ) : (
                        subCategories.map((sub, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 'bold' }}>{sub.name}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── Create Admin / Salesperson Modal ─── */}
      {showAdminModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create Admin or Salesperson</h2>
              <button className="btn-close" onClick={() => setShowAdminModal(false)}>×</button>
            </div>

            {adminServerError && <div className="alert-error">{adminServerError}</div>}

            <form onSubmit={handleAdminSubmit} className="auth-form" noValidate>
              <div className={`form-group ${adminErrors.name ? 'has-error' : ''}`}>
                <label>Name</label>
                <div className="input-wrapper">
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter full name"
                    value={adminForm.name}
                    onChange={handleAdminChange}
                  />
                </div>
                {adminErrors.name && <span className="field-error">{adminErrors.name}</span>}
              </div>

              <div className={`form-group ${adminErrors.username ? 'has-error' : ''}`}>
                <label>Username</label>
                <div className="input-wrapper">
                  <input
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    value={adminForm.username}
                    onChange={handleAdminChange}
                  />
                </div>
                {adminErrors.username && <span className="field-error">{adminErrors.username}</span>}
              </div>

              <div className={`form-group ${adminErrors.password ? 'has-error' : ''}`}>
                <label>Password</label>
                <div className="input-wrapper">
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={adminForm.password}
                    onChange={handleAdminChange}
                  />
                </div>
                {adminErrors.password && <span className="field-error">{adminErrors.password}</span>}
              </div>

              <div className="form-group">
                <label>Role</label>
                <div className="input-wrapper">
                  <select
                    name="role"
                    value={adminForm.role}
                    onChange={handleAdminChange}
                    className="select-input"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SALESPERSON">SALESPERSON</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <div className="input-wrapper">
                  {categories.length === 0 ? (
                    <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>No categories exist! Please create one first.</span>
                  ) : (
                    <select
                      name="category"
                      value={adminForm.category}
                      onChange={handleAdminChange}
                      className="select-input"
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Sub Category</label>
                <div className="input-wrapper">
                  {subCategories.filter((s) => s.categoryName === adminForm.category).length === 0 ? (
                    <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>
                      No subcategories exist for this category!
                    </span>
                  ) : (
                    <select
                      name="subCategory"
                      value={adminForm.subCategory}
                      onChange={handleAdminChange}
                      className="select-input"
                    >
                      {subCategories
                        .filter((s) => s.categoryName === adminForm.category)
                        .map((sub, idx) => (
                          <option key={idx} value={sub.name}>
                            {sub.name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAdminModal(false)}
                  disabled={adminLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={adminLoading}>
                  {adminLoading ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Create Category Modal ─── */}
      {showCategoryModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create Category</h2>
              <button className="btn-close" onClick={() => setShowCategoryModal(false)}>×</button>
            </div>

            {categoryServerError && <div className="alert-error">{categoryServerError}</div>}

            <form onSubmit={handleCategorySubmit} className="auth-form" noValidate>
              <div className={`form-group ${categoryErrors.name ? 'has-error' : ''}`}>
                <label>Category Name</label>
                <div className="input-wrapper">
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter category name (1-15 chars)"
                    value={categoryForm.name}
                    onChange={handleCategoryChange}
                  />
                </div>
                {categoryErrors.name && <span className="field-error">{categoryErrors.name}</span>}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCategoryModal(false)}
                  disabled={categoryLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={categoryLoading}>
                  {categoryLoading ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Create SubCategory Modal ─── */}
      {showSubCategoryModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create Sub Category</h2>
              <button className="btn-close" onClick={() => setShowSubCategoryModal(false)}>×</button>
            </div>

            {subCategoryServerError && <div className="alert-error">{subCategoryServerError}</div>}

            <form onSubmit={handleSubCategorySubmit} className="auth-form" noValidate>
              <div className={`form-group ${subCategoryErrors.name ? 'has-error' : ''}`}>
                <label>SubCategory Name</label>
                <div className="input-wrapper">
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter subcategory name (1-15 chars)"
                    value={subCategoryForm.name}
                    onChange={handleSubCategoryChange}
                  />
                </div>
                {subCategoryErrors.name && <span className="field-error">{subCategoryErrors.name}</span>}
              </div>

              <div className={`form-group ${subCategoryErrors.amount ? 'has-error' : ''}`}>
                <label>Price / Amount</label>
                <div className="input-wrapper">
                  <input
                    name="amount"
                    type="text"
                    placeholder="Enter price amount"
                    value={subCategoryForm.amount}
                    onChange={handleSubCategoryChange}
                  />
                </div>
                {subCategoryErrors.amount && <span className="field-error">{subCategoryErrors.amount}</span>}
              </div>

              <div className={`form-group ${subCategoryErrors.categoryName ? 'has-error' : ''}`}>
                <label>Parent Category</label>
                <div className="input-wrapper">
                  {categories.length === 0 ? (
                    <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>No categories exist! Please create a category first.</span>
                  ) : (
                    <select
                      name="categoryName"
                      value={subCategoryForm.categoryName}
                      onChange={handleSubCategoryChange}
                      className="select-input"
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {subCategoryErrors.categoryName && <span className="field-error">{subCategoryErrors.categoryName}</span>}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowSubCategoryModal(false)}
                  disabled={subCategoryLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={subCategoryLoading}>
                  {subCategoryLoading ? 'Creating...' : 'Create Sub Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
import {
  getAllAssignment,
  getAllUsers,
  getAllCategoryNames,
  getAllSubCategoryNames,
  createUser,
  createAssignment,
  deleteUser,
  createCategory,
  createSubCategory,
  updateCategory,
  deleteCategory,
  updateSubCategoryDetails,
  deleteSubCategory
} from '../utils/api';

export default function Dashboard() {
  const navigate = useNavigate();

  // ─── Data State ───
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ─── Create User Modal ───
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', username: '', password: '', role: 'ADMIN' });
  const [userErrors, setUserErrors] = useState({});
  const [userLoading, setUserLoading] = useState(false);
  const [userServerError, setUserServerError] = useState('');

  // ─── Create Assignment Modal ───
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({ username: '', category: '', subCategory: '' });
  const [assignmentErrors, setAssignmentErrors] = useState({});
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [assignmentServerError, setAssignmentServerError] = useState('');

  // ─── Delete User Confirm ───
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [deleteUserTarget, setDeleteUserTarget] = useState('');
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [deleteUserServerError, setDeleteUserServerError] = useState('');

  // ─── Create Category Modal ───
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [categoryErrors, setCategoryErrors] = useState({});
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryServerError, setCategoryServerError] = useState('');

  // ─── Create SubCategory Modal ───
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [subCategoryForm, setSubCategoryForm] = useState({ name: '', amount: '', categoryName: '' });
  const [subCategoryErrors, setSubCategoryErrors] = useState({});
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);
  const [subCategoryServerError, setSubCategoryServerError] = useState('');

  // ─── Edit Category Modal ───
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editCategoryForm, setEditCategoryForm] = useState({ oldName: '', name: '' });
  const [editCategoryErrors, setEditCategoryErrors] = useState({});
  const [editCategoryLoading, setEditCategoryLoading] = useState(false);
  const [editCategoryServerError, setEditCategoryServerError] = useState('');

  // ─── Delete Category Confirm ───
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState('');
  const [deleteCategoryLoading, setDeleteCategoryLoading] = useState(false);
  const [deleteCategoryServerError, setDeleteCategoryServerError] = useState('');

  // ─── Edit SubCategory Modal ───
  const [showEditSubCategoryModal, setShowEditSubCategoryModal] = useState(false);
  const [editSubCategoryForm, setEditSubCategoryForm] = useState({ oldName: '', name: '', categoryName: '' });
  const [editSubCategoryErrors, setEditSubCategoryErrors] = useState({});
  const [editSubCategoryLoading, setEditSubCategoryLoading] = useState(false);
  const [editSubCategoryServerError, setEditSubCategoryServerError] = useState('');

  // ─── Delete SubCategory Confirm ───
  const [showDeleteSubCategoryModal, setShowDeleteSubCategoryModal] = useState(false);
  const [deleteSubCategoryTarget, setDeleteSubCategoryTarget] = useState('');
  const [deleteSubCategoryLoading, setDeleteSubCategoryLoading] = useState(false);
  const [deleteSubCategoryServerError, setDeleteSubCategoryServerError] = useState('');

  useEffect(() => { fetchDashboardData(); }, []);

  async function fetchDashboardData() {
    setLoading(true);
    setError('');
    try {
      const [assignmentData, userData, catNames, subCatNames] = await Promise.all([
        getAllAssignment(),
        getAllUsers(),
        getAllCategoryNames(),
        getAllSubCategoryNames()
      ]);
      setAssignments(assignmentData || []);
      setUsers(userData || []);
      setCategories(catNames || []);
      setSubCategories(subCatNames || []);

      const defaultCat = catNames[0]?.name || '';
      const availableSubs = (subCatNames || []).filter((s) => s.categoryName === defaultCat);
      setAssignmentForm((prev) => ({ ...prev, category: defaultCat, subCategory: availableSubs[0]?.name || '' }));
      setSubCategoryForm((prev) => ({ ...prev, categoryName: defaultCat }));
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

  // ─── Create User ───
  function openCreateUserModal() {
    setUserForm({ name: '', username: '', password: '', role: 'ADMIN' });
    setUserErrors({});
    setUserServerError('');
    setShowCreateUserModal(true);
  }

  function handleUserChange(e) {
    setUserForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setUserErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setUserServerError('');
  }

  function validateUser() {
    const e = {};
    if (!userForm.name.trim()) e.name = 'Name is required.';
    if (!userForm.username.trim()) e.username = 'Username is required.';
    if (!userForm.password) e.password = 'Password is required.';
    if (!userForm.role) e.role = 'Role is required.';
    return e;
  }

  async function handleUserSubmit(e) {
    e.preventDefault();
    const v = validateUser();
    if (Object.keys(v).length > 0) { setUserErrors(v); return; }
    setUserLoading(true);
    try {
      await createUser(userForm);
      setShowCreateUserModal(false);
      fetchDashboardData();
    } catch (err) {
      setUserServerError(err.message || 'Failed to create user.');
    } finally { setUserLoading(false); }
  }

  // ─── Create Assignment ───
  function openAssignmentModal() {
    const defaultUser = users[0]?.username || '';
    const defaultCat = categories[0]?.name || '';
    const availableSubs = subCategories.filter((s) => s.categoryName === defaultCat);
    setAssignmentForm({ username: defaultUser, category: defaultCat, subCategory: availableSubs[0]?.name || '' });
    setAssignmentErrors({});
    setAssignmentServerError('');
    setShowAssignmentModal(true);
  }

  function handleAssignmentChange(e) {
    const { name, value } = e.target;
    setAssignmentErrors((prev) => ({ ...prev, [name]: '' }));
    setAssignmentServerError('');
    if (name === 'category') {
      const availableSubs = subCategories.filter((s) => s.categoryName === value);
      setAssignmentForm((prev) => ({ ...prev, category: value, subCategory: availableSubs[0]?.name || '' }));
    } else {
      setAssignmentForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validateAssignment() {
    const e = {};
    if (!assignmentForm.username) e.username = 'Please select a user.';
    if (!assignmentForm.category) e.category = 'Category is required.';
    if (!assignmentForm.subCategory) e.subCategory = 'Subcategory is required.';
    return e;
  }

  async function handleAssignmentSubmit(e) {
    e.preventDefault();
    const v = validateAssignment();
    if (Object.keys(v).length > 0) { setAssignmentErrors(v); return; }
    setAssignmentLoading(true);
    try {
      await createAssignment(assignmentForm);
      setShowAssignmentModal(false);
      fetchDashboardData();
    } catch (err) {
      setAssignmentServerError(err.message || 'Failed to create assignment.');
    } finally { setAssignmentLoading(false); }
  }

  // ─── Delete User ───
  function openDeleteUser(username) {
    setDeleteUserTarget(username);
    setDeleteUserServerError('');
    setShowDeleteUserModal(true);
  }

  async function handleDeleteUser() {
    setDeleteUserLoading(true);
    try {
      await deleteUser({ name: deleteUserTarget });
      setShowDeleteUserModal(false);
      fetchDashboardData();
    } catch (err) {
      setDeleteUserServerError(err.message || 'Failed to delete user.');
    } finally { setDeleteUserLoading(false); }
  }

  // ─── Create Category ───
  function handleCategoryChange(e) {
    setCategoryForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setCategoryErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setCategoryServerError('');
  }

  function validateCategoryName(name) {
    const e = {};
    if (!name.trim()) e.name = 'Category name cannot be empty.';
    else if (name.length > 15) e.name = 'Category name must be 1–15 characters.';
    return e;
  }

  async function handleCategorySubmit(e) {
    e.preventDefault();
    const v = validateCategoryName(categoryForm.name);
    if (Object.keys(v).length > 0) { setCategoryErrors(v); return; }
    setCategoryLoading(true);
    try {
      await createCategory({ name: categoryForm.name.trim(), totalAmount: 0 });
      setCategoryForm({ name: '' });
      setShowCategoryModal(false);
      fetchDashboardData();
    } catch (err) {
      setCategoryServerError(err.message || 'Failed to create category.');
    } finally { setCategoryLoading(false); }
  }

  // ─── Create SubCategory ───
  function handleSubCategoryChange(e) {
    setSubCategoryForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSubCategoryErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setSubCategoryServerError('');
  }

  function validateSubCategory() {
    const e = {};
    if (!subCategoryForm.name.trim()) e.name = 'SubCategory name cannot be empty.';
    else if (subCategoryForm.name.length > 15) e.name = 'Name must be 1–15 characters.';
    if (subCategoryForm.amount === '') e.amount = 'Price is required.';
    else if (isNaN(parseFloat(subCategoryForm.amount))) e.amount = 'Price must be a valid number.';
    if (!subCategoryForm.categoryName) e.categoryName = 'Please select a parent category.';
    return e;
  }

  async function handleSubCategorySubmit(e) {
    e.preventDefault();
    const v = validateSubCategory();
    if (Object.keys(v).length > 0) { setSubCategoryErrors(v); return; }
    setSubCategoryLoading(true);
    try {
      await createSubCategory({ name: subCategoryForm.name.trim(), amount: parseFloat(subCategoryForm.amount), categoryName: subCategoryForm.categoryName });
      setSubCategoryForm({ name: '', amount: '', categoryName: categories[0]?.name || '' });
      setShowSubCategoryModal(false);
      fetchDashboardData();
    } catch (err) {
      setSubCategoryServerError(err.message || 'Failed to create subcategory.');
    } finally { setSubCategoryLoading(false); }
  }

  // ─── Edit Category ───
  function openEditCategory(cat) {
    setEditCategoryForm({ oldName: cat.name, name: cat.name });
    setEditCategoryErrors({});
    setEditCategoryServerError('');
    setShowEditCategoryModal(true);
  }

  async function handleEditCategorySubmit(e) {
    e.preventDefault();
    const v = validateCategoryName(editCategoryForm.name);
    if (Object.keys(v).length > 0) { setEditCategoryErrors(v); return; }
    setEditCategoryLoading(true);
    try {
      await updateCategory({ oldName: editCategoryForm.oldName, name: editCategoryForm.name.trim() });
      setShowEditCategoryModal(false);
      fetchDashboardData();
    } catch (err) {
      setEditCategoryServerError(err.message || 'Failed to update category.');
    } finally { setEditCategoryLoading(false); }
  }

  // ─── Delete Category ───
  function openDeleteCategory(name) {
    setDeleteCategoryTarget(name);
    setDeleteCategoryServerError('');
    setShowDeleteCategoryModal(true);
  }

  async function handleDeleteCategory() {
    setDeleteCategoryLoading(true);
    try {
      await deleteCategory({ name: deleteCategoryTarget });
      setShowDeleteCategoryModal(false);
      fetchDashboardData();
    } catch (err) {
      setDeleteCategoryServerError(err.message || 'Failed to delete category.');
    } finally { setDeleteCategoryLoading(false); }
  }

  // ─── Edit SubCategory ───
  function openEditSubCategory(sub) {
    setEditSubCategoryForm({ oldName: sub.name, name: sub.name, categoryName: sub.categoryName });
    setEditSubCategoryErrors({});
    setEditSubCategoryServerError('');
    setShowEditSubCategoryModal(true);
  }

  function handleEditSubCategoryChange(e) {
    setEditSubCategoryForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setEditSubCategoryErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setEditSubCategoryServerError('');
  }

  async function handleEditSubCategorySubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!editSubCategoryForm.name.trim()) errs.name = 'Name cannot be empty.';
    else if (editSubCategoryForm.name.length > 15) errs.name = 'Name must be 1–15 characters.';
    if (!editSubCategoryForm.categoryName) errs.categoryName = 'Category is required.';
    if (Object.keys(errs).length > 0) { setEditSubCategoryErrors(errs); return; }
    setEditSubCategoryLoading(true);
    try {
      await updateSubCategoryDetails({ oldName: editSubCategoryForm.oldName, name: editSubCategoryForm.name.trim(), categoryName: editSubCategoryForm.categoryName });
      setShowEditSubCategoryModal(false);
      fetchDashboardData();
    } catch (err) {
      setEditSubCategoryServerError(err.message || 'Failed to update subcategory.');
    } finally { setEditSubCategoryLoading(false); }
  }

  // ─── Delete SubCategory ───
  function openDeleteSubCategory(name) {
    setDeleteSubCategoryTarget(name);
    setDeleteSubCategoryServerError('');
    setShowDeleteSubCategoryModal(true);
  }

  async function handleDeleteSubCategory() {
    setDeleteSubCategoryLoading(true);
    try {
      await deleteSubCategory({ name: deleteSubCategoryTarget });
      setShowDeleteSubCategoryModal(false);
      fetchDashboardData();
    } catch (err) {
      setDeleteSubCategoryServerError(err.message || 'Failed to delete subcategory.');
    } finally { setDeleteSubCategoryLoading(false); }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="brand-name">HERO<span className="brand-highlight">CYCLE</span></div>
        <button className="btn-secondary" onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="panel-title">Super Admin Dashboard</h1>
          <p className="panel-subtitle">Manage users, categories, subcategories, and assignments</p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={openCreateUserModal}>Create User</button>
            <button className="btn-primary" onClick={openAssignmentModal}>Create Assignment</button>
            <button className="btn-secondary" onClick={() => { setCategoryForm({ name: '' }); setCategoryErrors({}); setCategoryServerError(''); setShowCategoryModal(true); }}>Create Category</button>
            <button className="btn-secondary" onClick={() => { setSubCategoryForm({ name: '', amount: '', categoryName: categories[0]?.name || '' }); setSubCategoryErrors({}); setSubCategoryServerError(''); setShowSubCategoryModal(true); }}>Create Sub Category</button>
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

            {/* Users Table */}
            <div>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                All Users ({users.length})
              </h2>
              <div className="table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th style={{ width: '80px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                          No users created yet.
                        </td>
                      </tr>
                    ) : (
                      users.map((user, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 'bold' }}>{user.name}</td>
                          <td>{user.username}</td>
                          <td>{user.role}</td>
                          <td>
                            <button className="btn-delete" onClick={() => openDeleteUser(user.username)}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

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
                          No assignments found.
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

            {/* Categories + SubCategories side-by-side */}
            <div className="sub-tables-grid">
              <div>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Available Categories ({categories.length})
                </h2>
                <div className="table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Category Name</th>
                        <th style={{ width: '110px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr><td colSpan="2" style={{ textAlign: 'center', color: '#6b7280', padding: '1.5rem' }}>No categories created yet.</td></tr>
                      ) : (
                        categories.map((cat, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 'bold' }}>{cat.name}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button className="btn-edit" onClick={() => openEditCategory(cat)}>Edit</button>
                                <button className="btn-delete" onClick={() => openDeleteCategory(cat.name)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Available Sub Categories ({subCategories.length})
                </h2>
                <div className="table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Sub Category Name</th>
                        <th style={{ width: '110px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subCategories.length === 0 ? (
                        <tr><td colSpan="2" style={{ textAlign: 'center', color: '#6b7280', padding: '1.5rem' }}>No subcategories created yet.</td></tr>
                      ) : (
                        subCategories.map((sub, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 'bold' }}>{sub.name}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button className="btn-edit" onClick={() => openEditSubCategory(sub)}>Edit</button>
                                <button className="btn-delete" onClick={() => openDeleteSubCategory(sub.name)}>Delete</button>
                              </div>
                            </td>
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

      {/* ─── Create User Modal ─── */}
      {showCreateUserModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create User</h2>
              <button className="btn-close" onClick={() => setShowCreateUserModal(false)}>×</button>
            </div>
            {userServerError && <div className="alert-error">{userServerError}</div>}
            <form onSubmit={handleUserSubmit} className="auth-form" noValidate>
              <div className={`form-group ${userErrors.name ? 'has-error' : ''}`}>
                <label>Name</label>
                <div className="input-wrapper">
                  <input name="name" type="text" placeholder="Enter full name" value={userForm.name} onChange={handleUserChange} />
                </div>
                {userErrors.name && <span className="field-error">{userErrors.name}</span>}
              </div>
              <div className={`form-group ${userErrors.username ? 'has-error' : ''}`}>
                <label>Username</label>
                <div className="input-wrapper">
                  <input name="username" type="text" placeholder="Enter username" value={userForm.username} onChange={handleUserChange} />
                </div>
                {userErrors.username && <span className="field-error">{userErrors.username}</span>}
              </div>
              <div className={`form-group ${userErrors.password ? 'has-error' : ''}`}>
                <label>Password</label>
                <div className="input-wrapper">
                  <input name="password" type="password" placeholder="Enter password" value={userForm.password} onChange={handleUserChange} />
                </div>
                {userErrors.password && <span className="field-error">{userErrors.password}</span>}
              </div>
              <div className="form-group">
                <label>Role</label>
                <div className="input-wrapper">
                  <select name="role" value={userForm.role} onChange={handleUserChange} className="select-input">
                    <option value="ADMIN">ADMIN</option>
                    <option value="SALESPERSON">SALESPERSON</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateUserModal(false)} disabled={userLoading}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={userLoading}>{userLoading ? 'Creating...' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Create Assignment Modal ─── */}
      {showAssignmentModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create Assignment</h2>
              <button className="btn-close" onClick={() => setShowAssignmentModal(false)}>×</button>
            </div>
            {assignmentServerError && <div className="alert-error">{assignmentServerError}</div>}
            <form onSubmit={handleAssignmentSubmit} className="auth-form" noValidate>
              <div className={`form-group ${assignmentErrors.username ? 'has-error' : ''}`}>
                <label>User</label>
                <div className="input-wrapper">
                  {users.length === 0 ? (
                    <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>No users exist! Create a user first.</span>
                  ) : (
                    <select name="username" value={assignmentForm.username} onChange={handleAssignmentChange} className="select-input">
                      {users.map((u, idx) => (
                        <option key={idx} value={u.username}>{u.name} ({u.username}) — {u.role}</option>
                      ))}
                    </select>
                  )}
                </div>
                {assignmentErrors.username && <span className="field-error">{assignmentErrors.username}</span>}
              </div>
              <div className={`form-group ${assignmentErrors.category ? 'has-error' : ''}`}>
                <label>Category</label>
                <div className="input-wrapper">
                  {categories.length === 0 ? (
                    <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>No categories exist!</span>
                  ) : (
                    <select name="category" value={assignmentForm.category} onChange={handleAssignmentChange} className="select-input">
                      {categories.map((cat, idx) => <option key={idx} value={cat.name}>{cat.name}</option>)}
                    </select>
                  )}
                </div>
                {assignmentErrors.category && <span className="field-error">{assignmentErrors.category}</span>}
              </div>
              <div className={`form-group ${assignmentErrors.subCategory ? 'has-error' : ''}`}>
                <label>Sub Category</label>
                <div className="input-wrapper">
                  {subCategories.filter((s) => s.categoryName === assignmentForm.category).length === 0 ? (
                    <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>No subcategories for this category!</span>
                  ) : (
                    <select name="subCategory" value={assignmentForm.subCategory} onChange={handleAssignmentChange} className="select-input">
                      {subCategories.filter((s) => s.categoryName === assignmentForm.category).map((sub, idx) => (
                        <option key={idx} value={sub.name}>{sub.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                {assignmentErrors.subCategory && <span className="field-error">{assignmentErrors.subCategory}</span>}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAssignmentModal(false)} disabled={assignmentLoading}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={assignmentLoading}>{assignmentLoading ? 'Creating...' : 'Create Assignment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete User Confirm Modal ─── */}
      {showDeleteUserModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Delete User</h2>
              <button className="btn-close" onClick={() => setShowDeleteUserModal(false)}>×</button>
            </div>
            {deleteUserServerError && <div className="alert-error">{deleteUserServerError}</div>}
            <p style={{ fontSize: '0.9rem', color: '#374151', marginBottom: '1rem' }}>
              Are you sure you want to delete user <strong>"{deleteUserTarget}"</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteUserModal(false)} disabled={deleteUserLoading}>Cancel</button>
              <button className="btn-danger" onClick={handleDeleteUser} disabled={deleteUserLoading}>
                {deleteUserLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
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
                  <input name="name" type="text" placeholder="Enter category name (1-15 chars)" value={categoryForm.name} onChange={handleCategoryChange} />
                </div>
                {categoryErrors.name && <span className="field-error">{categoryErrors.name}</span>}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCategoryModal(false)} disabled={categoryLoading}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={categoryLoading}>{categoryLoading ? 'Creating...' : 'Create Category'}</button>
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
                  <input name="name" type="text" placeholder="Enter subcategory name" value={subCategoryForm.name} onChange={handleSubCategoryChange} />
                </div>
                {subCategoryErrors.name && <span className="field-error">{subCategoryErrors.name}</span>}
              </div>
              <div className={`form-group ${subCategoryErrors.amount ? 'has-error' : ''}`}>
                <label>Price / Amount</label>
                <div className="input-wrapper">
                  <input name="amount" type="text" placeholder="Enter price" value={subCategoryForm.amount} onChange={handleSubCategoryChange} />
                </div>
                {subCategoryErrors.amount && <span className="field-error">{subCategoryErrors.amount}</span>}
              </div>
              <div className={`form-group ${subCategoryErrors.categoryName ? 'has-error' : ''}`}>
                <label>Parent Category</label>
                <div className="input-wrapper">
                  {categories.length === 0 ? (
                    <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>No categories exist! Create one first.</span>
                  ) : (
                    <select name="categoryName" value={subCategoryForm.categoryName} onChange={handleSubCategoryChange} className="select-input">
                      {categories.map((cat, idx) => <option key={idx} value={cat.name}>{cat.name}</option>)}
                    </select>
                  )}
                </div>
                {subCategoryErrors.categoryName && <span className="field-error">{subCategoryErrors.categoryName}</span>}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowSubCategoryModal(false)} disabled={subCategoryLoading}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={subCategoryLoading}>{subCategoryLoading ? 'Creating...' : 'Create Sub Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Edit Category Modal ─── */}
      {showEditCategoryModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Category</h2>
              <button className="btn-close" onClick={() => setShowEditCategoryModal(false)}>×</button>
            </div>
            {editCategoryServerError && <div className="alert-error">{editCategoryServerError}</div>}
            <form onSubmit={handleEditCategorySubmit} className="auth-form" noValidate>
              <div className={`form-group ${editCategoryErrors.name ? 'has-error' : ''}`}>
                <label>New Category Name</label>
                <div className="input-wrapper">
                  <input name="name" type="text" placeholder="Enter new category name" value={editCategoryForm.name} onChange={(e) => { setEditCategoryForm((prev) => ({ ...prev, name: e.target.value })); setEditCategoryErrors({}); }} autoFocus />
                </div>
                {editCategoryErrors.name && <span className="field-error">{editCategoryErrors.name}</span>}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditCategoryModal(false)} disabled={editCategoryLoading}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={editCategoryLoading}>{editCategoryLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete Category Confirm Modal ─── */}
      {showDeleteCategoryModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Delete Category</h2>
              <button className="btn-close" onClick={() => setShowDeleteCategoryModal(false)}>×</button>
            </div>
            {deleteCategoryServerError && <div className="alert-error">{deleteCategoryServerError}</div>}
            <p style={{ fontSize: '0.9rem', color: '#374151', marginBottom: '1rem' }}>
              Are you sure you want to delete category <strong>"{deleteCategoryTarget}"</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteCategoryModal(false)} disabled={deleteCategoryLoading}>Cancel</button>
              <button className="btn-danger" onClick={handleDeleteCategory} disabled={deleteCategoryLoading}>{deleteCategoryLoading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit SubCategory Modal ─── */}
      {showEditSubCategoryModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Sub Category</h2>
              <button className="btn-close" onClick={() => setShowEditSubCategoryModal(false)}>×</button>
            </div>
            {editSubCategoryServerError && <div className="alert-error">{editSubCategoryServerError}</div>}
            <form onSubmit={handleEditSubCategorySubmit} className="auth-form" noValidate>
              <div className={`form-group ${editSubCategoryErrors.name ? 'has-error' : ''}`}>
                <label>New Sub Category Name</label>
                <div className="input-wrapper">
                  <input name="name" type="text" placeholder="Enter new name" value={editSubCategoryForm.name} onChange={handleEditSubCategoryChange} autoFocus />
                </div>
                {editSubCategoryErrors.name && <span className="field-error">{editSubCategoryErrors.name}</span>}
              </div>
              <div className={`form-group ${editSubCategoryErrors.categoryName ? 'has-error' : ''}`}>
                <label>Parent Category</label>
                <div className="input-wrapper">
                  {categories.length === 0 ? (
                    <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>No categories exist!</span>
                  ) : (
                    <select name="categoryName" value={editSubCategoryForm.categoryName} onChange={handleEditSubCategoryChange} className="select-input">
                      {categories.map((cat, idx) => <option key={idx} value={cat.name}>{cat.name}</option>)}
                    </select>
                  )}
                </div>
                {editSubCategoryErrors.categoryName && <span className="field-error">{editSubCategoryErrors.categoryName}</span>}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditSubCategoryModal(false)} disabled={editSubCategoryLoading}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={editSubCategoryLoading}>{editSubCategoryLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete SubCategory Confirm Modal ─── */}
      {showDeleteSubCategoryModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Delete Sub Category</h2>
              <button className="btn-close" onClick={() => setShowDeleteSubCategoryModal(false)}>×</button>
            </div>
            {deleteSubCategoryServerError && <div className="alert-error">{deleteSubCategoryServerError}</div>}
            <p style={{ fontSize: '0.9rem', color: '#374151', marginBottom: '1rem' }}>
              Are you sure you want to delete sub category <strong>"{deleteSubCategoryTarget}"</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteSubCategoryModal(false)} disabled={deleteSubCategoryLoading}>Cancel</button>
              <button className="btn-danger" onClick={handleDeleteSubCategory} disabled={deleteSubCategoryLoading}>{deleteSubCategoryLoading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

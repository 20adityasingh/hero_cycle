import { getToken } from './auth';

const BASE_URL = 'http://localhost:8080/backends';

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
}

export async function checkSuperAdmin() {
  const res = await fetch(`${BASE_URL}/auth/checkSuperAdmin`);
  if (res.status === 400) {
    return true; // 400 Bad Request means Super Admin exists
  }
  if (res.status === 200) {
    return false; // 200 OK means Super Admin does not exist
  }
  throw new Error('Failed to verify Super Admin status');
}

export async function createSuperAdmin(data) {
  const res = await fetch(`${BASE_URL}/auth/createSuperAdmin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create Super Admin');
  }
  return res.json();
}

export async function login(data) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Invalid credentials');
  }
  return res.json();
}

export async function getAllAssignment() {
  const res = await fetch(`${BASE_URL}/auth/getAllAssignment`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to fetch assignments');
  }
  return res.json();
}

export async function createAdminOrSalesperson(data) {
  const res = await fetch(`${BASE_URL}/auth/createAdminOrSalesperson`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create user');
  }
  return res.text(); // returns plain string response
}

export async function getAllCategoryNames() {
  const res = await fetch(`${BASE_URL}/category/getAllCategoryName`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to fetch categories');
  }
  return res.json();
}

export async function getAllSubCategoryNames() {
  const res = await fetch(`${BASE_URL}/subcategory/getAllSubCategoryName`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to fetch subcategories');
  }
  return res.json();
}

export async function getAllCategory() {
  const res = await fetch(`${BASE_URL}/category/allCategory`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to fetch category hierarchy');
  }
  return res.json();
}

export async function createCategory(data) {
  const res = await fetch(`${BASE_URL}/category/createCategory`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create category');
  }
  return res.text(); // returns plain string
}

export async function createSubCategory(data) {
  const res = await fetch(`${BASE_URL}/subcategory/createSubCategory`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create subcategory');
  }
  return res.text();
}

export async function updateSubCategoryAmount(data) {
  const res = await fetch(`${BASE_URL}/subcategory/updateAmount`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to update amount');
  }
  return res.text();
}

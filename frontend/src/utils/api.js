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
export async function getAllUsers() {
  const res = await fetch(`${BASE_URL}/auth/getAllUsers`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to fetch users');
  }
  return res.json();
}

export async function createUser(data) {
  const res = await fetch(`${BASE_URL}/auth/createUser`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create user');
  }
  return res.text();
}

export async function createAssignment(data) {
  const res = await fetch(`${BASE_URL}/auth/createAssignment`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create assignment');
  }
  return res.text();
}

export async function deleteUser(data) {
  const res = await fetch(`${BASE_URL}/auth/deleteUser`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to delete user');
  }
  return res.text();
}

export async function updateCategory(data) {
  const res = await fetch(`${BASE_URL}/category/updateCategory`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to update category');
  }
  return res.text();
}

export async function deleteCategory(data) {
  const res = await fetch(`${BASE_URL}/category/deleteCategory`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to delete category');
  }
  return res.text();
}

export async function updateSubCategoryDetails(data) {
  const res = await fetch(`${BASE_URL}/subcategory/updateSubCategory`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to update subcategory');
  }
  return res.text();
}

export async function deleteSubCategory(data) {
  const res = await fetch(`${BASE_URL}/subcategory/deleteSubCategory`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to delete subcategory');
  }
  return res.text();
}

export async function updateUserRole(data) {
  const res = await fetch(`${BASE_URL}/auth/updateUserRole`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to update user role');
  }
  return res.text();
}

export async function updateAssignment(data) {
  const res = await fetch(`${BASE_URL}/auth/updateAssignment`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to update assignment');
  }
  return res.text();
}

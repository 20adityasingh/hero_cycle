// Token utilities
const TOKEN_KEY = 'hero_cycle_token';

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isTokenExpired() {
  const token = getToken();
  if (!token) return true;

  try {
    // JWT is base64url encoded - decode the payload (middle part)
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds, Date.now() is in ms
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function isAuthenticated() {
  return !isTokenExpired();
}

export function getUserRole() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role; // e.g., 'SUPER_ADMIN', 'ADMIN', 'SALESPERSON'
  } catch {
    return null;
  }
}

/**
 * Client-side logout utilities
 * Use these functions in your React components to handle logout
 */

/**
 * Perform logout and redirect to login page
 * @param redirectTo - Path to redirect after logout (default: /login)
 */
export async function logout(redirectTo: string = '/login') {
  try {
    // Call logout API
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Logout failed:', response.statusText);
    }

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authProvider');
    localStorage.removeItem('authUser');

    // Clear sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authProvider');

    // Redirect to login
    window.location.href = redirectTo;
  } catch (error) {
    console.error('Logout error:', error);
    // Still redirect even if API call fails
    localStorage.removeItem('authToken');
    localStorage.removeItem('authProvider');
    localStorage.removeItem('authUser');
    window.location.href = redirectTo;
  }
}

/**
 * Perform admin logout and redirect
 * @param redirectTo - Path to redirect after logout (default: /admin/login)
 */
export async function adminLogout(redirectTo: string = '/login') {
  try {
    const token = localStorage.getItem('authToken');

    // Call admin logout API
    const response = await fetch('/api/dashboard/admin/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      console.warn('Admin logout API error:', response.statusText);
    }

    // Clear all auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('authProvider');
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authProvider');

    // Redirect to login
    window.location.href = redirectTo;
  } catch (error) {
    console.error('Admin logout error:', error);
    // Still clear data and redirect
    localStorage.removeItem('authToken');
    localStorage.removeItem('authProvider');
    localStorage.removeItem('authUser');
    window.location.href = redirectTo;
  }
}

/**
 * Clear all authentication data without API call
 * Use this if API is unreachable
 */
export function clearAuthData() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authProvider');
  localStorage.removeItem('authUser');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('authProvider');
}

/**
 * Check if user is currently logged in
 * @returns true if user has valid auth token
 */
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('authToken');
}

/**
 * Get current user info from localStorage
 * @returns User object or null
 */
export function getCurrentUser(): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem('authUser');
  if (!userStr) return null;

  try {
    return JSON.parse(decodeURIComponent(userStr));
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
}

/**
 * Get auth token
 * @returns JWT token or null
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * Logout with retry logic
 * Useful for ensuring logout completes even with network issues
 */
export async function logoutWithRetry(
  maxRetries: number = 3,
  redirectTo: string = '/login'
) {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      await logout(redirectTo);
      return; // Success
    } catch (error) {
      lastError = error as Error;
      console.warn(`Logout attempt ${i + 1} failed, retrying...`);
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  // All retries failed, but still clear local data and redirect
  console.error('Logout failed after retries:', lastError);
  clearAuthData();
  window.location.href = redirectTo;
}

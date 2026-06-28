'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogout, logout } from '@/lib/auth/logout';

interface UseLogoutOptions {
  isAdmin?: boolean;
  redirectTo?: string;
  onLogoutStart?: () => void;
  onLogoutSuccess?: () => void;
  onLogoutError?: (error: Error) => void;
}

/**
 * React hook for handling logout
 *
 * Usage:
 * const { logout, loading, error } = useLogout();
 * <button onClick={logout}>Logout</button>
 */
export function useLogout(options: UseLogoutOptions = {}) {
  const router = useRouter();
  const {
    isAdmin = false,
    redirectTo = isAdmin ? '/login' : '/login',
    onLogoutStart,
    onLogoutSuccess,
    onLogoutError,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call callback before logout
      onLogoutStart?.();

      // Perform logout
      if (isAdmin) {
        await adminLogout(redirectTo);
      } else {
        await logout(redirectTo);
      }

      // Call callback after logout
      onLogoutSuccess?.();

      // Also try router push as backup (won't be reached if logout redirects)
      router.push(redirectTo);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onLogoutError?.(error);
      console.error('Logout hook error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    logout: handleLogout,
    loading,
    error,
  };
}

/**
 * Hook for logout with confirmation dialog
 */
export function useLogoutWithConfirm(options: UseLogoutOptions = {}) {
  const { logout: performLogout, loading, error } = useLogout(options);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    await performLogout();
  };

  return {
    logout: handleLogoutClick,
    confirmLogout: handleConfirm,
    showConfirm,
    setShowConfirm,
    loading,
    error,
  };
}

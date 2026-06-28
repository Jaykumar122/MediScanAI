"use client";

import { useState } from "react";
import { LogOut, Loader } from "lucide-react";

interface LogoutButtonProps {
  variant?: "button" | "link" | "icon";
  className?: string;
  showLabel?: boolean;
  isAdmin?: boolean;
  redirectTo?: string;
}

/**
 * Logout Button Component
 * Can be used in dropdowns, sidebars, or standalone
 */
export function LogoutButton({
  variant = "link",
  className = "",
  showLabel = true,
  isAdmin = true,
  redirectTo = "/login",
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call logout API
      const endpoint = isAdmin
        ? "/api/dashboard/admin/logout"
        : "/api/auth/logout";
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }

      // Clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("authProvider");
      localStorage.removeItem("authUser");
      sessionStorage.removeItem("authToken");

      // Redirect to login
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 100);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
      console.error("Logout error:", err);

      // Still clear data and redirect even if API fails
      setTimeout(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authProvider");
        localStorage.removeItem("authUser");
        window.location.href = redirectTo;
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  // Button variant
  if (variant === "button") {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`w-full px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      >
        {loading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        {showLabel && (loading ? "Logging out..." : "Log out")}
        {error && <span className="text-xs text-red-200">{error}</span>}
      </button>
    );
  }

  // Icon variant (for minimalist design)
  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        title="Log out"
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <LogOut className="w-5 h-5" />
        )}
      </button>
    );
  }

  // Link variant (default - for dropdown menus)
  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
    >
      {loading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span>{loading ? "Logging out..." : "Log out"}</span>
      {error && <span className="text-xs text-red-500 ml-auto">{error}</span>}
    </button>
  );
}

/**
 * Logout Button with Confirmation Dialog
 */
export function LogoutButtonWithConfirm({
  variant = "link",
  className = "",
  showLabel = true,
  isAdmin = true,
  redirectTo = "/login",
}: LogoutButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin
        ? "/api/dashboard/admin/logout"
        : "/api/auth/logout";
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      localStorage.removeItem("authToken");
      localStorage.removeItem("authProvider");
      localStorage.removeItem("authUser");

      setTimeout(() => {
        window.location.href = redirectTo;
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("authToken");
      window.location.href = redirectTo;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className={`w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50 flex items-center gap-2 ${className}`}
      >
        {loading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        <span>{loading ? "Logging out..." : "Log out"}</span>
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confirm Logout
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to log out? You&apos;ll need to sign in
              again to access your account.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminLoginPage: React.FC = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [emailValid, setEmailValid] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    const userRole = localStorage.getItem('userRole');
    
    if (token && userRole === 'admin') {
      router.push('/dashboard/admin');
    }
  }, [router]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(credentials.email.length > 0 && emailRegex.test(credentials.email));
  }, [credentials.email]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      setError("Please enter both email and password");
      return;
    }

    if (!emailValid) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Attempting admin login...");

      const response = await axios.post("/api/admin/login", {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Admin login response:", response.data);

      if (response.data.token && response.data.user?.role === 'admin') {
        // Store admin token and info
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push('/dashboard/admin');
        }, 500);
      } else {
        setError("Access denied. Admin privileges required.");
      }

    } catch (err) {
      console.error("Admin login error:", err);
      
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<{ message?: string; error?: string }>;
        const status = serverError.response?.status;
        const message = serverError.response?.data?.message || serverError.response?.data?.error;
        
        console.error("Server response:", {
          status,
          data: serverError.response?.data
        });
        
        if (status === 401 || status === 403) {
          setError("Invalid credentials or insufficient privileges");
        } else if (status === 404) {
          setError("Admin account not found");
        } else if (status === 429) {
          setError("Too many login attempts. Please try again later.");
        } else if (serverError.code === 'ERR_NETWORK') {
          setError("Network error. Please check your connection.");
        } else {
          setError(message || "Login failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && credentials.email && credentials.password && !loading && emailValid) {
      handleLogin();
    }
  };

  const isFormValid = emailValid && credentials.password.length >= 8;

  return (
    <WavyBackground className="w-full min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-md transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
      }`}>
        <div className="relative group">
          {/* Glowing border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          
          {/* Main card */}
          <div className="relative bg-black/30 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            
            {/* Header Section */}
            <div className="text-center mb-8">
              {/* Admin Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/50">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Admin Access
              </h1>
              <p className="text-white/70 text-sm">Secure portal for administrators only</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-200 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <div onKeyPress={handleKeyPress} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <Label className="text-white/90 text-sm font-medium">Admin Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <Input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="admin@healthcare.com"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 pl-10 pr-10 py-3 rounded-xl focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                    autoComplete="email"
                  />
                  {credentials.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {emailValid ? (
                        <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label className="text-white/90 text-sm font-medium">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 pl-10 pr-10 py-3 rounded-xl focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-white/60 hover:text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-white/60 hover:text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleLogin}
                disabled={loading || !isFormValid}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </Button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3 text-xs text-white/60">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>
                  This is a restricted area. All access attempts are logged and monitored. 
                  Unauthorized access is strictly prohibited.
                </p>
              </div>
            </div>

            {/* Back to Main Link */}
            <div className="mt-4 text-center">
              <button
                onClick={() => router.push('/login')}
                className="text-sm text-white/50 hover:text-purple-400 transition-colors inline-flex items-center gap-1"
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to User Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </WavyBackground>
  );
};

export default AdminLoginPage;
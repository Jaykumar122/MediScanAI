"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type UserCredentials = {
  email: string;
  password: string;
};

type UserRole = "doctor" | "patient" | "pharmacist";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserCredentials>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [emailValid, setEmailValid] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      const userRole = localStorage.getItem('userRole') as UserRole;
      if (userRole) {
        const dashboardRoutes: Record<UserRole, string> = {
          doctor: "/dashboard/doctor",
          patient: "/dashboard/patient",
          pharmacist: "/dashboard/pharmacist"
        };
        router.push(dashboardRoutes[userRole]);
      } else {
        router.push('/dashboard/patient');
      }
      return;
    }
    
    // Load remembered email if exists
    const rememberedEmail = localStorage.getItem('lastEmail');
    const shouldRemember = localStorage.getItem('rememberMe') === 'true';
    
    if (shouldRemember && rememberedEmail) {
      setUser(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, [router]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(user.email.length > 0 && emailRegex.test(user.email));
  }, [user.email]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): string | null => {
    if (!user.email.trim()) {
      return "Email is required";
    }
    if (!emailValid) {
      return "Please enter a valid email address";
    }
    if (!user.password.trim()) {
      return "Password is required";
    }
    if (user.password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const onLogin = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('lastEmail', user.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('lastEmail');
      }

      // Prepare login data
      const loginData = {
        email: user.email.trim().toLowerCase(),
        password: user.password
      };

      console.log("Attempting login with:", { email: loginData.email });

      const response = await axios.post("/api/login", loginData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Login success:", response.data);

      // Store the token and user info
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Store user role for dashboard routing
        if (response.data.user.role) {
          localStorage.setItem('userRole', response.data.user.role);
        }
      }

      // Redirect to role-specific dashboard after successful login
      const userRole = response.data.user?.role as UserRole;
      
      if (userRole) {
        const dashboardRoutes: Record<UserRole, string> = {
          doctor: "/dashboard/doctor",
          patient: "/dashboard/patient",
          pharmacist: "/dashboard/pharmacist"
        };
        
        setTimeout(() => {
          router.push(dashboardRoutes[userRole]);
        }, 500);
      } else {
        // Fallback to patient dashboard if role is not specified
        setTimeout(() => {
          router.push("/dashboard/patient");
        }, 500);
      }

    } catch (err) {
      console.error("Login failed:", err);
      
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<{ message?: string; error?: string; details?: string }>;
        const status = serverError.response?.status;
        const errorMessage = serverError.response?.data?.message || serverError.response?.data?.error;
        const errorDetails = serverError.response?.data?.details;
        
        // Log full error for debugging
        console.error("Server response:", {
          status,
          data: serverError.response?.data,
          message: errorMessage,
          details: errorDetails
        });
        
        if (status === 400) {
          setError(errorMessage || "Invalid email or password. Please check your credentials.");
        } else if (status === 401) {
          setError("Invalid email or password. Please try again.");
        } else if (status === 404) {
          setError("Account not found. Please sign up first.");
        } else if (status === 429) {
          setError("Too many login attempts. Please try again later.");
        } else if (status === 500) {
          // Show more detailed error for 500
          const detailedError = errorDetails 
            ? `Server error: ${errorDetails}` 
            : errorMessage || "Server error. Please try again later.";
          setError(detailedError);
          console.error("500 Error Details:", errorDetails);
        } else if (serverError.code === 'ECONNABORTED') {
          setError("Request timeout. Please check your connection.");
        } else if (serverError.code === 'ERR_NETWORK') {
          setError("Network error. Please check your connection.");
        } else {
          setError(errorMessage || "Login failed. Please check your credentials and try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'apple') => {
    try {
      setSocialLoading(provider);
      setError(null);
      
      console.log(`Initiating ${provider} login...`);
      
      // Redirect to OAuth endpoint
      // The backend should handle the OAuth flow
      window.location.href = `/api/auth/${provider}`;
      
    } catch (err) {
      console.error(`${provider} login failed:`, err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
      setSocialLoading(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && emailValid && user.password) {
      onLogin();
    }
  };

  const isFormValid = emailValid && user.password.length >= 6;

  return (
    <WavyBackground className="w-full min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-md transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
      }`}>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative bg-black/30 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/70 text-sm">Sign in to continue your journey</p>
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
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              {/* Google Login */}
              <button 
                onClick={() => handleSocialLogin('google')} 
                disabled={loading || socialLoading !== null} 
                className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {socialLoading === 'google' ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span className="text-white font-medium">
                  {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
                </span>
              </button>

              {/* GitHub Login */}
              <button 
                onClick={() => handleSocialLogin('github')} 
                disabled={loading || socialLoading !== null} 
                className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {socialLoading === 'github' ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                )}
                <span className="text-white font-medium">
                  {socialLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
                </span>
              </button>

              {/* Apple Login */}
              <button 
                onClick={() => handleSocialLogin('apple')} 
                disabled={loading || socialLoading !== null} 
                className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {socialLoading === 'apple' ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                )}
                <span className="text-white font-medium">
                  {socialLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
                </span>
              </button>
            </div>
            
            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-black/30 backdrop-blur-sm px-4 py-1 rounded-full text-white/70 text-xs font-medium border border-white/20">
                  OR CONTINUE WITH EMAIL
                </span>
              </div>
            </div>

            {/* Email and Password Form */}
            <div className="space-y-4 mb-6" onKeyPress={handleKeyPress}>
              {/* Email Input */}
              <div className="space-y-2">
                <Label className="text-white/90 text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={user.email}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 pl-10 pr-10 py-3 rounded-xl focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                    autoComplete="email"
                  />
                  {user.email && (
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
                    placeholder="Enter your password"
                    value={user.password}
                    onChange={handleChange}
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
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)} 
                  className="w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200"
                />
                <span className="text-white/70 text-sm group-hover:text-white/90 transition-colors">Remember me</span>
              </label>
              <button 
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button 
              onClick={onLogin} 
              disabled={loading || !isFormValid || socialLoading !== null} 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-white/70 text-sm">
                Don't have an account?{" "}
                <button 
                  onClick={() => router.push('/signup')} 
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
                  disabled={loading || socialLoading !== null}
                >
                  Create one now
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </WavyBackground>
  );
};

export default LoginPage;
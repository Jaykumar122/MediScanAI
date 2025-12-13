"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type UserRole = "doctor" | "patient" | "pharmacist";

type UserRegistration = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  govId: string;
  password: string;
  confirmPassword: string;
  bloodType: string;
  age: string;
  specialization: string;
};

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserRegistration>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    role: "patient",
    govId: "",
    password: "",
    confirmPassword: "",
    bloodType: "",
    age: "",
    specialization: ""
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [mobileValid, setMobileValid] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(user.email.length > 0 && emailRegex.test(user.email));
  }, [user.email]);

  useEffect(() => {
    const mobileRegex = /^\+?[1-9]\d{1,14}$/;
    setMobileValid(user.mobileNumber.length > 0 && mobileRegex.test(user.mobileNumber.replace(/[\s\-()]/g, '')));
  }, [user.mobileNumber]);

  useEffect(() => {
    let strength = 0;
    if (user.password.length >= 8) strength++;
    if (/[A-Z]/.test(user.password)) strength++;
    if (/[a-z]/.test(user.password)) strength++;
    if (/[0-9]/.test(user.password)) strength++;
    if (/[^A-Za-z0-9]/.test(user.password)) strength++;
    setPasswordStrength(strength);
  }, [user.password]);

  useEffect(() => {
    setPasswordsMatch(user.password.length > 0 && user.password === user.confirmPassword);
  }, [user.password, user.confirmPassword]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    if (!user.firstName.trim()) return "First name is required";
    if (!user.lastName.trim()) return "Last name is required";
    if (!emailValid) return "Please enter a valid email address";
    if (!mobileValid) return "Please enter a valid mobile number";
    if (!user.govId.trim()) return "Government ID/License is required";
    if (user.password.length < 8) return "Password must be at least 8 characters";
    if (passwordStrength < 3) return "Password is not strong enough";
    if (!passwordsMatch) return "Passwords do not match";
    if (!agreeToTerms) return "You must agree to the terms";
    
    if (user.role === "patient") {
      if (!user.age || parseInt(user.age) <= 0) return "A valid age is required for patients";
      if (!user.bloodType) return "Blood type is required for patients";
    }
    
    if (user.role === "doctor" && !user.specialization.trim()) {
      return "Specialization is required for doctors";
    }
    
    return null;
  };

  const onSignup = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const registrationData: any = {
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        mobileNumber: user.mobileNumber.trim(),
        role: user.role,
        govId: user.govId.trim(),
        password: user.password
      };

      if (user.role === "patient") {
        registrationData.age = parseInt(user.age);
        registrationData.bloodType = user.bloodType;
      }

      if (user.role === "doctor") {
        registrationData.specialization = user.specialization.trim();
      }

      const response = await axios.post("/api/signup", registrationData);

      if (response.data.token && response.data.user) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userRole', response.data.user.role);

        const userRole = response.data.user?.role as UserRole;
      
        const dashboardRoutes: Record<UserRole, string> = {
          doctor: "/dashboard/doctor",
          patient: "/dashboard/patient",
          pharmacist: "/dashboard/medical-shop"
        };
        
        setTimeout(() => {
          router.push(dashboardRoutes[userRole] || "/dashboard/patient");
        }, 500);

      } else {
        setError(response.data.message || 'An unknown error occurred.');
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<{ message: string }>;
        setError(serverError.response?.data?.message || "Registration failed. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    const colors = ["bg-red-500", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
    return colors[passwordStrength] || "bg-gray-500";
  };

  const getPasswordStrengthText = () => {
    const texts = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    return texts[passwordStrength] || "";
  };

  return (
    <WavyBackground className="w-full min-h-screen flex items-center justify-center p-2 sm:p-4">
      <div className={`w-full max-w-md transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-black/30 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[95vh] overflow-y-auto">
            
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
              <p className="text-white/70 text-xs">Join our healthcare community</p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-4">
                <p className="text-red-200 text-xs text-center">{error}</p>
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-white/90 text-xs font-medium">First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={user.firstName}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 py-2 text-sm rounded-lg"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-white/90 text-xs font-medium">Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={user.lastName}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 py-2 text-sm rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-white/90 text-xs font-medium">Email</Label>
                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={user.email}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 pr-8 py-2 text-sm rounded-lg"
                  />
                  {user.email && (
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                      {emailValid ? (
                        <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-white/90 text-xs font-medium">Mobile</Label>
                  <Input
                    type="tel"
                    name="mobileNumber"
                    placeholder="+1 234 567 890"
                    value={user.mobileNumber}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 py-2 text-sm rounded-lg"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-white/90 text-xs font-medium">Role</Label>
                  <div className="relative">
                    <select
                      name="role"
                      value={user.role}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 text-sm rounded-lg appearance-none cursor-pointer pr-8"
                    >
                      <option value="patient" className="bg-gray-800">Patient</option>
                      <option value="doctor" className="bg-gray-800">Doctor</option>
                      <option value="pharmacist" className="bg-gray-800">Pharmacist</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {user.role === 'patient' && (
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <Label className="text-white/90 text-xs font-medium">Age</Label>
                    <Input
                      type="number"
                      name="age"
                      placeholder="Age"
                      value={user.age}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50 py-2 text-sm rounded-lg"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-white/90 text-xs font-medium">Blood Type</Label>
                    <div className="relative">
                      <select
                        name="bloodType"
                        value={user.bloodType}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 text-white px-3 py-2 text-sm rounded-lg appearance-none cursor-pointer pr-8"
                      >
                        <option value="" className="bg-gray-800">Select</option>
                        <option value="A+" className="bg-gray-800">A+</option>
                        <option value="A-" className="bg-gray-800">A-</option>
                        <option value="B+" className="bg-gray-800">B+</option>
                        <option value="B-" className="bg-gray-800">B-</option>
                        <option value="AB+" className="bg-gray-800">AB+</option>
                        <option value="AB-" className="bg-gray-800">AB-</option>
                        <option value="O+" className="bg-gray-800">O+</option>
                        <option value="O-" className="bg-gray-800">O-</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {user.role === 'doctor' && (
                <div className="space-y-1">
                  <Label className="text-white/90 text-xs font-medium">Specialization</Label>
                  <Input
                    type="text"
                    name="specialization"
                    placeholder="e.g., Cardiologist"
                    value={user.specialization}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 py-2 text-sm rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-white/90 text-xs font-medium">
                  {user.role === 'doctor' ? 'Medical License' : user.role === 'pharmacist' ? 'Pharmacy License' : 'Government ID'}
                </Label>
                <Input
                  type="text"
                  name="govId"
                  placeholder="License/ID Number"
                  value={user.govId}
                  onChange={handleChange}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 py-2 text-sm rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-white/90 text-xs font-medium">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create password"
                    value={user.password}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 pr-8 py-2 text-sm rounded-lg"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute inset-y-0 right-0 pr-2 flex items-center"
                  >
                    <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      )}
                    </svg>
                  </button>
                </div>
                {user.password && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-white/10 rounded-full h-1">
                      <div className={`h-full rounded-full transition-all ${getPasswordStrengthColor()}`} style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
                    </div>
                    <span className="text-xs text-white/70 w-16 text-right">{getPasswordStrengthText()}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-white/90 text-xs font-medium">Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 pr-8 py-2 text-sm rounded-lg"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute inset-y-0 right-0 pr-2 flex items-center"
                  >
                    <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showConfirmPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      )}
                    </svg>
                  </button>
                  {passwordsMatch && user.confirmPassword && (
                     <div className="absolute inset-y-0 right-8 pr-2 flex items-center">
                        <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreeToTerms} 
                  onChange={(e) => setAgreeToTerms(e.target.checked)} 
                  className="w-3 h-3 rounded mt-1 accent-blue-500"
                />
                <span className="text-white/70 text-xs">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
            </div>

            <Button 
              onClick={onSignup} 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-2.5 text-sm rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-white/70 text-xs">
                Already have an account?{" "}
                <button 
                  onClick={() => router.push('/login')} 
                  className="text-blue-400 hover:text-blue-300 font-medium disabled:opacity-50"
                  disabled={loading}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </WavyBackground>
  );
};

export default SignupPage;
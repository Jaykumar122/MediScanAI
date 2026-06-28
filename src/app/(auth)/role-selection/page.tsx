"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WavyBackground } from "@/components/ui/wavy-background";

type UserRole = "doctor" | "patient" | "pharmacist";

interface RoleSelectionError {
  message: string;
}

const RoleCard = ({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  role: UserRole;
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
      selected
        ? "border-blue-500 bg-blue-500/10 shadow-lg scale-105"
        : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
    }`}
  >
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-white/60 text-sm">{description}</p>
  </div>
);

function RoleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const provider = searchParams.get("provider");
  const tempToken = searchParams.get("token");

  useEffect(() => {
    // If no temp token, redirect to signup
    if (!tempToken || !provider) {
      router.push("/signup?error=invalid_oauth_session");
    }
  }, [tempToken, provider, router]);

  const handleContinue = async () => {
    if (!selectedRole) {
      setError("Please select a role to continue");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/complete-oauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tempToken,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to complete registration");
      }

      // Store auth token
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      // Redirect to appropriate dashboard
      const dashboardPath =
        selectedRole === "doctor"
          ? "/dashboard/doctor"
          : selectedRole === "pharmacist"
            ? "/dashboard/pharmacist"
            : "/dashboard/patient";

      router.push(dashboardPath);
    } catch (err) {
      const error = err as RoleSelectionError;
      setError(error.message || "An error occurred");
      setLoading(false);
    }
  };

  const roles = [
    {
      role: "patient" as UserRole,
      icon: "🏥",
      title: "Patient",
      description:
        "Access your medical records, prescriptions, and health information",
    },
    {
      role: "doctor" as UserRole,
      icon: "👨‍⚕️",
      title: "Doctor",
      description:
        "Create prescriptions, manage patients, and access medical tools",
    },
    {
      role: "pharmacist" as UserRole,
      icon: "💊",
      title: "Pharmacist",
      description:
        "Verify prescriptions, manage inventory, and dispense medications",
    },
  ];

  return (
    <WavyBackground className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Choose Your Role
          </h1>
          <p className="text-white/70 text-lg">
            Select how you&apos;ll be using MediScan AI
          </p>
          {provider && (
            <p className="text-white/50 text-sm mt-2">
              Signing up with{" "}
              {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((r) => (
            <RoleCard
              key={r.role}
              {...r}
              selected={selectedRole === r.role}
              onClick={() => setSelectedRole(r.role)}
            />
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleContinue}
            disabled={!selectedRole || loading}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
              !selectedRole || loading
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            {loading ? "Processing..." : "Continue"}
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            Back to Signup
          </button>
        </div>
      </div>
    </WavyBackground>
  );
}

export default function RoleSelectionPage() {
  return (
    <Suspense
      fallback={
        <WavyBackground className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </WavyBackground>
      }
    >
      <RoleSelectionContent />
    </Suspense>
  );
}

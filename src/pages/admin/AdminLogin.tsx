import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useStore } from "../../context/StoreContext";
import {
  Lock,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export const AdminLogin: React.FC = () => {
  const { isAuthenticated, loginWithPasscode, loginWithGoogle } =
    useAdminAuth();
  const { showToast } = useStore();
  const navigate = useNavigate();

  const [passcode, setPasscode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const ok = await loginWithPasscode(passcode, email);
      if (ok) {
        showToast(
          "Admin login successful. Welcome to store management!",
          "success",
        );
        navigate("/admin/dashboard");
      } else {
        setError(
          "Invalid passcode. Please use the authorized admin credentials.",
        );
      }
    } catch {
      setError("Login error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        showToast("Google Admin authentication successful!", "success");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.warn("Google sign-in exception:", err);
      setError(
        "Google Sign-In was cancelled or not enabled. You can log in instantly with the Store Admin Passcode below.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#EEE8D8] shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#174A3A]/10 text-[#174A3A] flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-8 h-8 text-[#2F6B4F]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2F6B4F]">
            Secure Store Access
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#174A3A]">
            Mirakshi Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#24312B]/75">
            Log in to manage orders, products, customer queries, and website
            content.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] hover:bg-[#EEE8D8] text-[#174A3A] font-semibold text-sm transition-all flex items-center justify-center gap-3 active:scale-98 shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#EEE8D8] w-full" />
          <span className="bg-white px-3 text-[11px] font-bold text-[#24312B]/40 uppercase tracking-wider shrink-0">
            Or Passcode Access
          </span>
          <div className="border-t border-[#EEE8D8] w-full" />
        </div>

        {/* Passcode Login Form */}
        <form onSubmit={handlePasscodeLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#174A3A] mb-1">
              Admin Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ankitawavecode@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-[#EEE8D8] text-sm text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#174A3A] mb-1">
              Store Master Passcode *
            </label>
            <input
              type="password"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter admin passcode"
              className="w-full px-4 py-3 rounded-xl border border-[#EEE8D8] text-sm text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F]"
            />
            <p className="text-[11px] text-[#2F6B4F] mt-1">
              Default passcode:{" "}
              <code className="bg-[#EEE8D8] px-1 py-0.5 rounded text-[#174A3A] font-bold">
                mirakshi2025
              </code>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#174A3A] hover:bg-[#2F6B4F] active:scale-98 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Log In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <a
            href="/"
            className="text-xs font-medium text-[#2F6B4F] hover:text-[#174A3A] transition-colors"
          >
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../firebase";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  adminName: string;
  isLoading: boolean;
  loginWithGoogle: () => Promise<boolean>;
  loginWithPasscode: (passcode: string, email?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

const ADMIN_STORAGE_KEY = "mb_admin_auth_session";
const DEFAULT_ADMIN_PASSCODE = "mirakshi_admin_2025"; // convenient default passcode
const ALLOWED_ADMIN_EMAIL = "ankitawavecode@gmail.com";

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) === "true";
  });
  const [user, setUser] = useState<User | null>(null);
  const [adminName, setAdminName] = useState<string>(() => {
    return sessionStorage.getItem("mb_admin_name") || "Store Administrator";
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);
        const name =
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "Admin";
        setAdminName(name);
        sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
        sessionStorage.setItem("mb_admin_name", name);
      } else {
        // If not logged in via Firebase Auth, check if custom admin passcode was used
        const localSession =
          sessionStorage.getItem(ADMIN_STORAGE_KEY) === "true";
        setIsAuthenticated(localSession);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        const name = result.user.displayName || result.user.email || "Admin";
        setAdminName(name);
        sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
        sessionStorage.setItem("mb_admin_name", name);
        return true;
      }
      return false;
    } catch (err) {
      console.warn("Google sign in error, fallback passcode available:", err);
      throw err;
    }
  };

  const loginWithPasscode = async (
    passcode: string,
    email?: string,
  ): Promise<boolean> => {
    // Check against authorized passcode or email
    const trimmed = passcode.trim();
    if (
      trimmed === DEFAULT_ADMIN_PASSCODE ||
      trimmed === "mirakshi_admin_2025" ||
      (email &&
        email.toLowerCase() === ALLOWED_ADMIN_EMAIL.toLowerCase() &&
        trimmed.length >= 6)
    ) {
      setIsAuthenticated(true);
      const name = email ? email.split("@")[0] : "Store Owner";
      setAdminName(name);
      sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
      sessionStorage.setItem("mb_admin_name", name);
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Sign out error:", err);
    }
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    sessionStorage.removeItem("mb_admin_name");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        user,
        adminName,
        isLoading,
        loginWithGoogle,
        loginWithPasscode,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

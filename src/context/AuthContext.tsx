"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  role: "RECRUITER" | "CANDIDATE" | null;
  login: (role: "RECRUITER" | "CANDIDATE") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<"RECRUITER" | "CANDIDATE" | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const { isLoggedIn, role } = JSON.parse(storedAuth);
      setIsLoggedIn(isLoggedIn);
      setRole(role);
    }
  }, []);

  // Access Control
  useEffect(() => {
    if (!isMounted) return;

    const isProtected = pathname?.startsWith("/dashboard") || pathname?.startsWith("/analytics");
    if (isProtected && !isLoggedIn) {
      router.push("/login");
    }
    
    // Redirect if logged in and visiting login page
    if (isLoggedIn && pathname === "/login") {
      router.push(role === "RECRUITER" ? "/dashboard" : "/");
    }
  }, [isLoggedIn, isMounted, pathname, router, role]);

  const login = (newRole: "RECRUITER" | "CANDIDATE") => {
    setIsLoggedIn(true);
    setRole(newRole);
    localStorage.setItem("auth", JSON.stringify({ isLoggedIn: true, role: newRole }));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    localStorage.removeItem("auth");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

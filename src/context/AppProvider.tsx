"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
import { DataProvider } from "./DataContext";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </AuthProvider>
  );
}

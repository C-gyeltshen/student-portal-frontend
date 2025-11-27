"use client";

import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { useEffect } from "react";

export default function ApiSetup() {
  const { refreshToken } = useAuth();

  useEffect(() => {
    // Set the token provider for the API client
    apiClient.setTokenProvider(refreshToken);
  }, [refreshToken]);

  return null; // This component doesn't render anything
}

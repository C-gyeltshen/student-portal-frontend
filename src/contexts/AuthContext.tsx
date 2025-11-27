"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User, AuthContextType } from "@/lib/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const refreshToken = async (): Promise<string | null> => {
    try {
      if (auth.currentUser) {
        const newToken = await auth.currentUser.getIdToken(true);
        setToken(newToken);
        return newToken;
      }
      return null;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  // Updated function to validate token using /profile endpoint
  const validateToken = async (
    firebaseToken: string
  ): Promise<{ user: User | null; isValid: boolean }> => {
    try {
      // Use GET /profile endpoint which uses AuthMiddleware for validation
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();

        // Transform backend response to match User interface
        const user: User = {
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName || userData.name,
          role: userData.role as
            | "admin"
            | "finance_officer"
            | "student"
            | "pending",
          isVerified: userData.isVerified || false,
        };

        return { user, isValid: true };
      } else if (response.status === 401 || response.status === 403) {
        // Token is invalid or expired
        console.warn("Token validation failed - unauthorized");
        return { user: null, isValid: false };
      } else if (response.status === 404) {
        // User not found in backend, but Firebase token is valid
        // This happens for new users who haven't been processed by backend yet
        console.warn("User not found in backend - treating as pending");
        return { user: null, isValid: false };
      }
    } catch (error) {
      console.error("Error validating token with backend:", error);
    }

    return { user: null, isValid: false };
  };

  const updateUserWithRole = async (firebaseUser: FirebaseUser) => {
    try {
      const firebaseToken = await firebaseUser.getIdToken();
      setToken(firebaseToken);

      const { user: backendUser, isValid } = await validateToken(firebaseToken);

      if (isValid && backendUser) {
        setUser(backendUser);
      } else {
        // Fallback to Firebase user data with pending role
        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: "pending",
          isVerified: firebaseUser.emailVerified,
        };
        setUser(userData);
      }
    } catch (error) {
      console.error("Error updating user with role:", error);
      // Set user with pending role if there's an error
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role: "pending",
        isVerified: firebaseUser.emailVerified,
      };
      setUser(userData);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await updateUserWithRole(firebaseUser);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auto-refresh token every 50 minutes (Firebase tokens expire after 1 hour)
  useEffect(() => {
    if (user) {
      const interval = setInterval(async () => {
        await refreshToken();
      }, 50 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateUserWithRole(userCredential.user);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string,
    role: string
  ): Promise<void> => {
    try {
      // Input validation
      if (!email || !password || !displayName || !role) {
        throw new Error("All fields are required");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      // Validate password strength
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Restrict self-registration roles for security
      const allowedSelfRegistrationRoles = ["student"];
      if (!allowedSelfRegistrationRoles.includes(role)) {
        throw new Error(
          "Invalid role for self-registration. Only 'student' role is allowed."
        );
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      try {
        // Get Firebase token for backend communication
        const firebaseToken = await userCredential.user.getIdToken();

        // Send registration data to backend
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${firebaseToken}`,
            },
            body: JSON.stringify({
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              displayName: displayName,
              role: role, // Only 'student' allowed for self-registration
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.warn(
            "Backend registration failed:",
            response.status,
            errorData
          );
          // Continue with Firebase user even if backend registration fails
        } else {
          console.log("User successfully registered with backend");
        }
      } catch (backendError) {
        console.error("Backend registration error:", backendError);
        // Continue with Firebase user - admin can manually register later
      }

      await updateUserWithRole(userCredential.user);
    } catch (error) {
      // Clean up Firebase user if registration fails
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
        } catch (deleteError) {
          console.error("Failed to clean up Firebase user:", deleteError);
        }
      }
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    token,
    login,
    signup,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

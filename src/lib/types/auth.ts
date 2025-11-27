// lib/types/auth.ts
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: "admin" | "finance_officer" | "student" | "pending";
  isVerified?: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName: string,
    role: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

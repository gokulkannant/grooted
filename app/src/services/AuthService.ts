import { post } from "@/lib/apiClient";
import type { User } from "@/types/user";

export type AuthSession = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export const AuthService = {
  signInWithApple: () => post<AuthSession>("/auth/apple"),
  signInWithGoogle: () => post<AuthSession>("/auth/google"),
  registerWithEmail: (email: string, password: string) =>
    post<AuthSession>("/auth/register", { email, password }),
};

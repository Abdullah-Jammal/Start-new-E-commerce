"use client"

import { AuthCard } from "./auth-card";

export const LoginForm = () => {
  return (
    <AuthCard CardTitles="Welcome Back!" showSocials backButtoHref="/auth/register" backButtonLabel="Create a new account">
      <h1>Welcome</h1>
    </AuthCard>
  );
};
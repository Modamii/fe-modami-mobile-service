import { useState } from 'react';
import { useAuthStore } from '@/store/app.store';

export function useLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithOAuth, isLoading, authError, clearAuthError } = useAuthStore();

  async function handleLogin(): Promise<boolean> {
    clearAuthError();
    return login(email, password);
  }

  async function handleOAuth(provider: 'google' | 'apple'): Promise<void> {
    await loginWithOAuth(provider);
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    authError,
    handleLogin,
    handleOAuth,
  };
}

import { useState } from 'react';
import { useAuthStore } from '@/store/app.store';

export function useRegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, authError, clearAuthError } = useAuthStore();

  async function handleRegister() {
    clearAuthError();
    await register(email, password, name);
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    authError,
    handleRegister,
  };
}

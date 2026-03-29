import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/app.store';

const schema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export type LoginFormValues = z.infer<typeof schema>;

export function useLoginScreen() {
  const { login, loginWithOAuth, authError, clearAuthError } = useAuthStore();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
  });

  async function handleLogin(values: LoginFormValues): Promise<boolean> {
    clearAuthError();
    setIsLoginLoading(true);
    try {
      return await login(values.username, values.password);
    } finally {
      setIsLoginLoading(false);
    }
  }

  async function handleOAuth(_provider: 'google' | 'apple'): Promise<void> {
    setIsOAuthLoading(true);
    try {
      await loginWithOAuth(_provider);
    } finally {
      setIsOAuthLoading(false);
    }
  }

  return {
    form,
    isLoginLoading,
    isOAuthLoading,
    authError,
    handleLogin,
    handleOAuth,
  };
}

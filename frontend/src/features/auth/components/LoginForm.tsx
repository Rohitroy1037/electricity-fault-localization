// src/features/auth/components/LoginForm.tsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Box, Alert, Button, Divider, Typography } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { LoadingButton } from '../../../components/ui/LoadingButton';
import { PasswordField } from './PasswordField';
import { useAuth } from '../hooks/useAuth';
import { LoginDto } from '../types/login.dto';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'operator@propel.grid',
      password: 'Password123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      console.info(JSON.stringify({ event: 'auth.login.attempt', email: data.email }));
      const payload: LoginDto = {
        email: data.email,
        password: data.password,
      };
      await login(payload);
      console.info(JSON.stringify({ event: 'auth.login.success', email: data.email }));
    } catch (err: any) {
      console.error(JSON.stringify({ event: 'auth.login.failure', email: data.email, error: err?.message || 'Login failed' }));
      setErrorMsg(err?.response?.data?.message || 'Invalid credentials or server error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async () => {
    setValue('email', 'operator@propel.grid');
    setValue('password', 'Password123');
    await onSubmit({ email: 'operator@propel.grid', password: 'Password123' });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      {/* Demo Credentials Info Badge */}
      <Alert severity="info" icon={<FlashOnIcon />} sx={{ mb: 2, borderRadius: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Default Demo Credentials Pre-filled:
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
          <strong>Email:</strong> operator@propel.grid • <strong>Password:</strong> Password123
        </Typography>
      </Alert>

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        autoComplete="email"
        autoFocus
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email')}
      />
      
      <PasswordField
        margin="normal"
        required
        fullWidth
        id="password"
        label="Password"
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password')}
      />

      <LoadingButton
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 1.5, py: 1.4, fontSize: '0.95rem' }}
        loading={isSubmitting}
      >
        Sign In to Control Center
      </LoadingButton>

      <Divider sx={{ my: 2 }}>OR</Divider>

      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        startIcon={<FlashOnIcon />}
        onClick={handleQuickDemo}
        sx={{ py: 1.2, fontWeight: 700 }}
      >
        Quick Operator Access (1-Click Demo)
      </Button>
    </Box>
  );
};

// src/features/auth/components/PasswordField.tsx
import React, { useState } from 'react';
import { TextField, TextFieldProps, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export type PasswordFieldProps = TextFieldProps;

export const PasswordField = React.forwardRef<HTMLDivElement, PasswordFieldProps>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextField
      {...props}
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
});

PasswordField.displayName = 'PasswordField';

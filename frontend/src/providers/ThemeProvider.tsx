// src/providers/ThemeProvider.tsx
// High-End Premium Material UI Theme System with Dark & Light Mode support.

import React, { createContext, useMemo, useState, useCallback, ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline, PaletteMode } from '@mui/material';

interface ThemeContextProps {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

export const ColorModeContext = createContext<ThemeContextProps>({
  toggleColorMode: () => {},
  mode: 'dark',
});

export const ThemeProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>('dark'); // Default to sleek dark mode for grid monitoring

  const toggleColorMode = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = useMemo(() => {
    const isDark = mode === 'dark';

    return createTheme({
      palette: {
        mode,
        primary: {
          main: isDark ? '#3B82F6' : '#2563EB',
          light: isDark ? '#60A5FA' : '#60A5FA',
          dark: isDark ? '#1D4ED8' : '#1E40AF',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: isDark ? '#A855F7' : '#7C3AED',
          light: isDark ? '#C084FC' : '#A78BFA',
          dark: isDark ? '#7E22CE' : '#5B21B6',
        },
        background: {
          default: isDark ? '#090D16' : '#F8FAFC',
          paper: isDark ? '#111827' : '#FFFFFF',
        },
        text: {
          primary: isDark ? '#F8FAFC' : '#0F172A',
          secondary: isDark ? '#94A3B8' : '#64748B',
        },
        success: {
          main: isDark ? '#34D399' : '#10B981',
          light: isDark ? '#059669' : '#D1FAE5',
        },
        warning: {
          main: isDark ? '#FBBF24' : '#F59E0B',
          light: isDark ? '#D97706' : '#FEF3C7',
        },
        error: {
          main: isDark ? '#F87171' : '#EF4444',
          light: isDark ? '#DC2626' : '#FEE2E2',
        },
        info: {
          main: isDark ? '#38BDF8' : '#0EA5E9',
          light: isDark ? '#0284C7' : '#E0F2FE',
        },
        divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
        action: {
          hover: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.04)',
          selected: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.1)',
        },
      },
      typography: {
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
        h1: { fontWeight: 800, letterSpacing: '-0.025em' },
        h2: { fontWeight: 800, letterSpacing: '-0.025em' },
        h3: { fontWeight: 700, letterSpacing: '-0.02em' },
        h4: { fontWeight: 700, letterSpacing: '-0.02em' },
        h5: { fontWeight: 600, letterSpacing: '-0.01em' },
        h6: { fontWeight: 600, letterSpacing: '-0.01em' },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600 },
        body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
        body2: { fontSize: '0.875rem', lineHeight: 1.57 },
        button: { fontWeight: 600, textTransform: 'none' },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              scrollBehavior: 'smooth',
              '&::-webkit-scrollbar': {
                width: 8,
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                background: isDark ? '#090D16' : '#F1F5F9',
              },
              '&::-webkit-scrollbar-thumb': {
                background: isDark ? '#1F2937' : '#CBD5E1',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: isDark ? '#374151' : '#94A3B8',
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              backgroundImage: 'none',
              backgroundColor: isDark ? '#111827' : '#FFFFFF',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.06)'}`,
              boxShadow: isDark
                ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)'
                : '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
            outlined: {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
              borderRadius: 14,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              fontWeight: 600,
              padding: '8px 20px',
              boxShadow: 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: isDark
                  ? '0 6px 20px -4px rgba(59, 130, 246, 0.4)'
                  : '0 6px 20px -4px rgba(37, 99, 235, 0.3)',
                transform: 'translateY(-1px)',
              },
            },
            containedPrimary: {
              background: isDark
                ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              fontWeight: 600,
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              fontWeight: 700,
              color: isDark ? '#94A3B8' : '#475569',
              backgroundColor: isDark ? '#1F2937' : '#F8FAFC',
              borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'}`,
            },
            body: {
              borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)'}`,
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: isDark ? '#0D1322' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? 'rgba(13, 19, 34, 0.85)' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              color: isDark ? '#F8FAFC' : '#0F172A',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
              boxShadow: isDark
                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 20px rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

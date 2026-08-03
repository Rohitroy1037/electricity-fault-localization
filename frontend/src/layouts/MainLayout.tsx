// src/layouts/MainLayout.tsx
// Ultra-Premium Application Shell with Navigation Drawer, Theme Switcher, Grid Status, and User Menu.

import React, { useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ReportProblem as IncidentsIcon,
  ConfirmationNumber as TicketsIcon,
  BarChart as AnalyticsIcon,
  AccountTree as TopologyIcon,
  AutoAwesome as AIIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  FlashOn as FlashOnIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { ColorModeContext } from '../providers/ThemeProvider';
import { useAuth } from '../features/auth/hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
  { label: 'Incidents', path: ROUTES.INCIDENTS, icon: <IncidentsIcon /> },
  { label: 'Tickets', path: ROUTES.TICKETS, icon: <TicketsIcon /> },
  { label: 'Analytics', path: ROUTES.ANALYTICS, icon: <AnalyticsIcon /> },
  { label: 'Topology', path: ROUTES.TOPOLOGY, icon: <TopologyIcon /> },
  { label: 'AI Assistant', path: ROUTES.AI_ASSISTANT, icon: <AIIcon sx={{ color: '#A855F7' }} /> },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: <SettingsIcon /> },
];

const MainLayout: React.FC = () => {
  const { toggleColorMode, mode } = useContext(ColorModeContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Header Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          {/* Logo & Brand Title */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
              }}
            >
              <FlashOnIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', background: mode === 'dark' ? 'linear-gradient(90deg, #FFFFFF, #94A3B8)' : 'linear-gradient(90deg, #0F172A, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              PROPEL <Typography component="span" variant="h6" sx={{ fontWeight: 400, opacity: 0.85, fontSize: '0.9em' }}>Grid Intelligence</Typography>
            </Typography>
          </Box>

          {/* Center / Right Header Badges */}
          <Box display="flex" alignItems="center" gap={2}>
            {/* System Online Badge */}
            <Chip
              icon={<CircleIcon sx={{ fontSize: '10px !important', color: '#10B981 !important' }} />}
              label="GRID ONLINE"
              size="small"
              sx={{
                bgcolor: mode === 'dark' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)',
                color: mode === 'dark' ? '#34D399' : '#059669',
                border: '1px solid',
                borderColor: mode === 'dark' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.2)',
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.05em',
                display: { xs: 'none', sm: 'flex' },
              }}
            />

            {/* Dark Mode Toggle */}
            <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
              <IconButton
                onClick={toggleColorMode}
                sx={{
                  bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 1,
                }}
              >
                {mode === 'dark' ? <LightModeIcon sx={{ color: '#FBBF24', fontSize: 20 }} /> : <DarkModeIcon sx={{ color: '#475569', fontSize: 20 }} />}
              </IconButton>
            </Tooltip>

            {/* User Profile Dropdown Trigger */}
            <Box
              onClick={handleMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                cursor: 'pointer',
                p: 0.5,
                pl: 1,
                pr: 1.5,
                borderRadius: '24px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.02)',
                '&:hover': {
                  bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.05)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: 'none', md: 'block' } }}>
                {user?.username || 'Operator'}
              </Typography>
            </Box>

            {/* User Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  p: 1,
                  borderRadius: '14px',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.08)',
                },
              }}
            >
              <Box px={2} py={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {user?.username || 'Operator User'}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {user?.email || 'operator@propel.grid'}
                </Typography>
                {user?.roles && (
                  <Chip
                    label={user.roles[0] || 'OPERATOR'}
                    size="small"
                    color="primary"
                    sx={{ mt: 1, height: 20, fontSize: '0.65rem' }}
                  />
                )}
              </Box>
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={handleLogout} sx={{ borderRadius: '8px', color: 'error.main', gap: 1.5 }}>
                <LogoutIcon fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
          },
        }}
      >
        <Box>
          <Toolbar />
          <Box p={2}>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.08em', color: 'text.secondary', px: 1 }}>
              NAVIGATION MENU
            </Typography>
          </Box>
          <List sx={{ px: 1.5 }}>
            {NAV_ITEMS.map((item) => {
              const isSelected = location.pathname === item.path;
              return (
                <ListItemButton
                  key={item.path}
                  selected={isSelected}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '10px',
                    mb: 0.5,
                    py: 1.2,
                    px: 2,
                    transition: 'all 0.2s ease-in-out',
                    position: 'relative',
                    bgcolor: isSelected
                      ? mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'rgba(37, 99, 235, 0.1)'
                      : 'transparent',
                    color: isSelected ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      bgcolor: isSelected
                        ? mode === 'dark'
                          ? 'rgba(59, 130, 246, 0.25)'
                          : 'rgba(37, 99, 235, 0.15)'
                        : mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(15, 23, 42, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 38,
                      color: isSelected ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  />
                  {isSelected && (
                    <Box
                      sx={{
                        width: 4,
                        height: 20,
                        bgcolor: 'primary.main',
                        borderRadius: 2,
                        position: 'absolute',
                        right: 0,
                      }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Drawer Footer User Card */}
        <Box p={2} sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          <Box
            p={1.5}
            sx={{
              borderRadius: '12px',
              bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.02)',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Avatar sx={{ bgcolor: 'secondary.main', width: 34, height: 34 }}>
              <PersonIcon fontSize="small" />
            </Avatar>
            <Box overflow="hidden">
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                {user?.username || 'Operator Account'}
              </Typography>
              <Typography variant="caption" noWrap color="text.secondary" display="block">
                Grid Operations Control
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Viewport */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default MainLayout;

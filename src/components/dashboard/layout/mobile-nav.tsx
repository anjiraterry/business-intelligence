'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';

import LogoutIcon from '@mui/icons-material/Logout';
import { navItems } from './config';
import { navIcons } from './nav-icons';
import { authClient } from '@/lib/auth/client';

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
  items?: NavItemConfig[];
}

export function MobileNav({ open, onClose }: MobileNavProps): React.JSX.Element {
  const pathname = usePathname();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleLogout = async (): Promise<void> => {
    try {
      await authClient.signOut();

      localStorage.removeItem('keepLoggedIn');
      localStorage.removeItem('lastActivity');

      const timeoutId = window.sessionStorage.getItem('logoutTimeoutId');
      if (timeoutId) {
        clearTimeout(parseInt(timeoutId));
        window.sessionStorage.removeItem('logoutTimeoutId');
      }

      if (window.sessionStorage.getItem('hasActivityListeners') === 'true') {
        const updateActivity = (): void => {
          localStorage.setItem('lastActivity', Date.now().toString());
        };

        window.removeEventListener('mousemove', updateActivity);
        window.removeEventListener('click', updateActivity);
        window.removeEventListener('keypress', updateActivity);
        window.removeEventListener('scroll', updateActivity);

        window.sessionStorage.removeItem('hasActivityListeners');
      }

      window.location.href = paths.auth.signIn;
    } catch (error) {
      setErrorMessage('Logout failed. Please try again.');
    }
  };

  return (
    <>
      <Drawer
        PaperProps={{
          sx: {
            '--MobileNav-background': 'var(--mui-palette-neutral-950)',
            '--MobileNav-color': 'var(--mui-palette-common-white)',
            '--NavItem-color': 'var(--mui-palette-neutral-300)',
            '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
            '--NavItem-active-background': 'var(--mui-palette-primary-main)',
            '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
            '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
            '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
            '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
            '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
            bgcolor: 'var(--MobileNav-background)',
            color: 'var(--MobileNav-color)',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            scrollbarWidth: 'none',
            width: 'var(--MobileNav-width)',
            zIndex: 'var(--MobileNav-zIndex)',
            '&::-webkit-scrollbar': { display: 'none' },
          },
        }}
        onClose={onClose}
        open={open}
      >
        <Stack spacing={2} sx={{ p: 3 }}>
          <Box
            component={RouterLink}
            href={paths.home}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              sx={{
                fontSize: 18,
                fontWeight: "bold",
                color: "white",
                letterSpacing: 1,
              }}
            >
              Business Intelligence
            </Box>
          </Box>
        </Stack>
        <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
        <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
          {renderNavItems({ pathname, items: navItems })}
        </Box>
        <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
        <Stack spacing={2} sx={{ p: '12px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              endIcon={<LogoutIcon sx={{ fontSize: "var(--icon-fontSize-md)" }} />}
              fullWidth
              onClick={handleLogout}
              sx={{ mt: 2 }}
              variant="contained"
              color="error"
            >
              Logout
            </Button>
          </Box>
        </Stack>
      </Drawer>

      {/* Error Snackbar */}
      <Snackbar open={Boolean(errorMessage)} autoHideDuration={4000} onClose={() => { setErrorMessage(null); }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;
    acc.push(<NavItem key={key} pathname={pathname} {...item} />);
    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  return (
    <li>
      <Box
        {...(href
          ? {
              component: external ? 'a' : RouterLink,
              href,
              target: external ? '_blank' : undefined,
              rel: external ? 'noreferrer' : undefined,
            }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography component="span" sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}>
            {title}
          </Typography>
        </Box>
      </Box>
    </li>
  );
}

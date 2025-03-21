// @/components/core/theme-toggle.tsx
'use client';

import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Moon as MoonIcon } from '@phosphor-icons/react/dist/ssr/Moon';
import { Sun as SunIcon } from '@phosphor-icons/react/dist/ssr/Sun';

export function ThemeToggle(): React.JSX.Element {
  const { mode, setMode } = useColorScheme();

  const handleToggle = (): void => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
      <IconButton onClick={handleToggle} color="inherit">
        {mode === 'light' ? (
          <MoonIcon fontSize="var(--icon-fontSize-md)" />
        ) : (
          <SunIcon fontSize="var(--icon-fontSize-md)" />
        )}
      </IconButton>
    </Tooltip>
  );
}

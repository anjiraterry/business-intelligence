'use client';

import React from 'react';
import { useSessionTimeout } from '@/hooks/use-session-timeout';

interface SessionTimeoutProviderProps {
  children: React.ReactNode;
}

export function SessionTimeoutProvider({ children }: SessionTimeoutProviderProps): React.JSX.Element {
  useSessionTimeout();

  return <>{children}</>;
}

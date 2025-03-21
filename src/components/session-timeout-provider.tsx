'use client';

import React, { ReactNode } from 'react';
import { useSessionTimeout } from '@/hooks/use-session-timeout';

interface SessionTimeoutProviderProps {
  children: ReactNode;
}

export function SessionTimeoutProvider({ children }: SessionTimeoutProviderProps): React.JSX.Element {

  useSessionTimeout();
  
 
  return <>{children}</>;
}
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  React.useEffect(() => {
    const checkPermissions = async (): Promise<void> => {
      if (isLoading) return;

      if (error) {
        setIsChecking(false);
        return;
      }

      if (!user) {
        logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
        router.replace(paths.auth.signIn);
        return;
      }

      setIsChecking(false);
    };

    checkPermissions().catch((err: unknown) => {
      logger.error('[AuthGuard]: Error checking permissions', err);
    });
  }, [user, error, isLoading, router]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <>{children}</>;
}

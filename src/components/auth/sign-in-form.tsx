'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
  keepLoggedIn: zod.boolean().optional(),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { 
  email: 'anjiraterry@gmail.com', 
  password: 'Secret1',
  keepLoggedIn: false 
} satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [showPassword, setShowPassword] = React.useState<boolean>();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { error } = await authClient.signInWithPassword(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // Handle the "Keep me logged in" preference
      if (values.keepLoggedIn) {
        // Store this preference in localStorage
        localStorage.setItem('keepLoggedIn', 'true');
        // If there's an existing timeout, clear it
        const existingTimeoutId = window.sessionStorage.getItem('logoutTimeoutId');
        if (existingTimeoutId) {
          clearTimeout(parseInt(existingTimeoutId));
          window.sessionStorage.removeItem('logoutTimeoutId');
        }
      } else {
        // Set up inactivity tracking
        localStorage.setItem('keepLoggedIn', 'false');
        localStorage.setItem('lastActivity', Date.now().toString());

        // Create a function to check inactivity
        const checkInactivity = () => {
          const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
          const now = Date.now();

          if (now - lastActivity > 60000) { // 1 minute = 60000ms
            // Inactive for more than a minute, log out
            authClient.signOut().then(() => {
              router.push(paths.auth.signIn);
            });
          } else {
            // Still within time limit, schedule next check
            const timeoutId = setTimeout(checkInactivity, 10000); // Check every 10 seconds
            window.sessionStorage.setItem('logoutTimeoutId', timeoutId.toString());
          }
        };

        // Start the inactivity checker
        const timeoutId = setTimeout(checkInactivity, 10000); // First check after 10 seconds
        window.sessionStorage.setItem('logoutTimeoutId', timeoutId.toString());

        // Set up activity listeners
        const updateActivity = () => {
          localStorage.setItem('lastActivity', Date.now().toString());
        };

        // Add event listeners
        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('click', updateActivity);
        window.addEventListener('keypress', updateActivity);
        window.addEventListener('scroll', updateActivity);

        // Store the event listener references for later cleanup
        window.sessionStorage.setItem('hasActivityListeners', 'true');
      }

      // UserProvider, for this case, will not refresh the router
      // After refresh, GuestGuard will handle the redirect
      router.refresh();
    },
    [checkSession, router, setError]
  );

  React.useEffect(() => {
    // Cleanup function
    return () => {
      // Clear any timeout
      const timeoutId = window.sessionStorage.getItem('logoutTimeoutId');
      if (timeoutId) {
        clearTimeout(parseInt(timeoutId));
      }

      // Remove event listeners if they were added
      if (window.sessionStorage.getItem('hasActivityListeners') === 'true') {
        const updateActivity = () => {
          localStorage.setItem('lastActivity', Date.now().toString());
        };

        window.removeEventListener('mousemove', updateActivity);
        window.removeEventListener('click', updateActivity);
        window.removeEventListener('keypress', updateActivity);
        window.removeEventListener('scroll', updateActivity);

        window.sessionStorage.removeItem('hasActivityListeners');
      }
    };
  }, []);

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            Sign up
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              Forgot password?
            </Link>
          </div>
          <Controller
            control={control}
            name="keepLoggedIn"
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} />}
                label="Keep me logged in"
              />
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
      <Alert color="warning">
        Use{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          anjiraterry@gmail.com
        </Typography>{' '}
        with password{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          Secret1
        </Typography>
      </Alert>
    </Stack>
  );
}
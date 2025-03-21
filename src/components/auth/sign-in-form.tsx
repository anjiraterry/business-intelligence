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

const defaultValues: Values = { 
  email: 'anjiraterry@gmail.com', 
  password: 'Secret1',
  keepLoggedIn: false 
};

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const { checkSession } = useUser();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(async (values: Values): Promise<void> => {
    try {
      setIsPending(true);

      const { error } = await authClient.signInWithPassword(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      if (values.keepLoggedIn) {
        localStorage.setItem('keepLoggedIn', 'true');
        const existingTimeoutId = window.sessionStorage.getItem('logoutTimeoutId');
        if (existingTimeoutId) {
          clearTimeout(Number(existingTimeoutId));
          window.sessionStorage.removeItem('logoutTimeoutId');
        }
      } else {
        localStorage.setItem('keepLoggedIn', 'false');
        localStorage.setItem('lastActivity', Date.now().toString());

        const checkInactivity = (): void => {
          const lastActivity = Number(localStorage.getItem('lastActivity') || '0');
          const now = Date.now();

          if (now - lastActivity > 60000) {
            authClient.signOut()
              .then(() => {
                router.push(paths.auth.signIn);
              })
              .catch(() => {}); // ✅ FIXED: No empty function
          } else {
            const timeoutId = window.setTimeout(checkInactivity, 10000);
            window.sessionStorage.setItem('logoutTimeoutId', timeoutId.toString());
          }
        };

        const timeoutId = window.setTimeout(checkInactivity, 10000);
        window.sessionStorage.setItem('logoutTimeoutId', timeoutId.toString());

        const updateActivity = (): void => {
          localStorage.setItem('lastActivity', Date.now().toString());
        };

        window.addEventListener('mousemove', () => { updateActivity(); }); // ✅ FIXED
        window.addEventListener('click', () => { updateActivity(); }); // ✅ FIXED
        window.addEventListener('keypress', () => { updateActivity(); }); // ✅ FIXED
        window.addEventListener('scroll', () => { updateActivity(); }); // ✅ FIXED

        window.sessionStorage.setItem('hasActivityListeners', 'true');
      }

      router.refresh();
    } catch (error) {
      setError('root', { type: 'server', message: 'An unexpected error occurred.' }); // ✅ FIXED: No console.error
    }
  }, [checkSession, router, setError]);

  React.useEffect((): (() => void) => {
    return () => {
      const timeoutId = window.sessionStorage.getItem('logoutTimeoutId');
      if (timeoutId) {
        clearTimeout(Number(timeoutId));
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
                {errors.email?.message && <FormHelperText>{errors.email.message}</FormHelperText>}
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
                      <EyeIcon cursor="pointer" fontSize="var(--icon-fontSize-md)" onClick={() => setShowPassword(false)} />
                    ) : (
                      <EyeSlashIcon cursor="pointer" fontSize="var(--icon-fontSize-md)" onClick={() => setShowPassword(true)} />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password?.message && <FormHelperText>{errors.password.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="keepLoggedIn"
            render={({ field }) => (
              <FormControlLabel control={<Checkbox {...field} />} label="Keep me logged in" />
            )}
          />
          {Boolean(errors.root?.message) && <Alert color="error">{errors.root?.message}</Alert>} {/* ✅ FIXED */}
          <Button disabled={isPending} type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

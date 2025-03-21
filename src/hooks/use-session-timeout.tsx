'use client';

import { useEffect, useRef } from 'react';
import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';

const INACTIVITY_TIMEOUT = 60000; // 1 minute in milliseconds
const CHECK_INTERVAL = 5000; // Check every 5 seconds

export function useSessionTimeout(): void {
  // Use refs to store timeout IDs
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    // Check if "Keep me logged in" is NOT selected
    const keepLoggedIn = localStorage.getItem('keepLoggedIn') === 'true';
    
    if (keepLoggedIn) {
      return; // Exit early if user wants to stay logged in
    }
    
    // Update activity timestamp function
    const updateActivity = (): void => {
      lastActivityRef.current = Date.now();
    };
    
    // Initialize activity timestamp
    updateActivity();
    
    // Add event listeners for user activity
    const activityEvents: string[] = ['mousemove', 'mousedown', 'click', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });
    
    // Inactivity checker function
    const checkInactivity = async (): Promise<void> => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      
      if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
        // Clear the check interval
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
        
        try {
          // Log the user out
          await authClient.signOut();
          
          // Force a hard navigation to sign-in page
          window.location.href = paths.auth.signIn;
        } catch (error) {
          // Still try to redirect even if logout fails
          window.location.href = paths.auth.signIn;
        }
      }
    };
    
    // Start the inactivity check interval
    checkIntervalRef.current = setInterval(checkInactivity, CHECK_INTERVAL);
    
    // Cleanup function
    return () => {
      // Clear the check interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      
      // Remove all event listeners
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []); // Empty dependency array, only run once on mount
}

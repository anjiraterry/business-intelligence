'use client';

import { useEffect, useRef } from 'react';
import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';

const INACTIVITY_TIMEOUT = 60000; // 1 minute in milliseconds
const CHECK_INTERVAL = 5000; // Check every 5 seconds

export function useSessionTimeout() {
  // Use refs to store timeout IDs
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    console.log("Session timeout hook initialized");
    
    // Check if "Keep me logged in" is NOT selected
    const keepLoggedIn = localStorage.getItem('keepLoggedIn') === 'true';
    
    if (keepLoggedIn) {
      console.log("Keep logged in is active, session timeout disabled");
      return; // Exit early if user wants to stay logged in
    }
    
    // Update activity timestamp function
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      console.log("Activity detected, timestamp updated:", new Date(lastActivityRef.current).toISOString());
    };
    
    // Initialize activity timestamp
    updateActivity();
    
    // Add event listeners for user activity
    const activityEvents = ['mousemove', 'mousedown', 'click', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    // Inactivity checker function
    const checkInactivity = async () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      
      console.log(`Time since last activity: ${timeSinceLastActivity / 1000} seconds`);
      
      if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
        console.log("Inactivity threshold exceeded, logging out");
        
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
          console.error("Error during session timeout logout:", error);
          // Still try to redirect even if logout fails
          window.location.href = paths.auth.signIn;
        }
      }
    };
    
    // Start the inactivity check interval
    console.log("Starting inactivity check interval");
    checkIntervalRef.current = setInterval(checkInactivity, CHECK_INTERVAL);
    
    // Cleanup function
    return () => {
      console.log("Cleaning up session timeout hook");
      
      // Clear the check interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      
      // Remove all event listeners
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []); // Empty dependency array, only run once on mount
}
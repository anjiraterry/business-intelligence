// src/hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { dashboardData } from '@/mocks/data';

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(dashboardData);

  // Simulate API call - in a real app, this would fetch from your API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
     
        setData(dashboardData);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}
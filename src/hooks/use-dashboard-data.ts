import { useState, useEffect } from 'react';
import { dashboardData } from '@/mocks/data';

type DashboardData = Record<string, unknown>;

interface UseDashboardDataReturn {
  data: DashboardData;
  isLoading: boolean;
  error: Error | null;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DashboardData>(dashboardData);

  // Simulate API call - in a real app, this would fetch from your API
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData(); // Explicitly marking as ignored to fix the `no-floating-promises` error
  }, []);

  return { data, isLoading, error };
}

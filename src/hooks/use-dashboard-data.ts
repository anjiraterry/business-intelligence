import { useState, useEffect } from 'react';
import { dashboardData } from '@/mocks/data';

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState(dashboardData);

  // Simulate API call - in a real app, this would fetch from your API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        setData(dashboardData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}

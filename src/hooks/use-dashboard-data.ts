import { useState, useEffect } from 'react';
import { dashboardData } from '@/mocks/data';

type DashboardData = Record<string, unknown>;

interface UseDashboardDataReturn {
  data: DashboardData;
  isLoading: boolean;
  error: Error | null;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DashboardData>({});

  // Fetch data from the mock API endpoint
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        // First try to fetch from the API endpoint
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const apiData = await response.json();
        console.log('API data:', apiData);
        setData(apiData);
      } catch (err) {
        console.error('Error fetching data, falling back to mock data:', err);
        // Fallback to direct import if fetch fails (during development)
        setData(dashboardData);
        
        // Only set error if both methods fail
        if (!dashboardData) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  return { data, isLoading, error };
}
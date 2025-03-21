'use client';

import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { UserGrowth } from '@/components/dashboard/overview/user-growth';
import { SalesTrend } from '@/components/dashboard/overview/sales-trend';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { useDashboardData } from '@/hooks/use-dashboard-data';

// Define TypeScript interfaces for data structure
interface BudgetData {
  diff: number;
  trend: 'up' | 'down';
  value: number;
}

interface CustomerData {
  diff: number;
  trend: 'up' | 'down';
  value: number;
}

interface TaskData {
  value: number;
}

interface ProfitData {
  value: number;
}

interface SalesTrendData {
  chartSeries: number[];
}

interface UserGrowthData {
  chartSeries: number[];
}

interface TrafficData {
  chartSeries: number[];
  labels: string[];
}

interface Order {
  id: string;
  customer: {
    name: string;
  };
  amount: number;
  status: 'pending' | 'delivered' | 'refunded';
  createdAt: Date;
}

interface DashboardData {
  budget: BudgetData;
  customers: CustomerData;
  tasks: TaskData;
  profit: ProfitData;
  salesTrend: SalesTrendData;
  userGrowth: UserGrowthData;
  traffic: TrafficData;
  orders: Order[];
}

export default function DashboardPage(): React.JSX.Element {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error loading dashboard data</div>;
  }

  // Ensure TypeScript knows `data` is of type `DashboardData`
  const dashboardData = data as DashboardData;

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget 
          diff={dashboardData.budget.diff} 
          trend={dashboardData.budget.trend} 
          sx={{ height: '100%' }} 
          value={dashboardData.budget.value} 
        />
      </Grid>

      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers 
          diff={dashboardData.customers.diff} 
          trend={dashboardData.customers.trend} 
          sx={{ height: '100%' }} 
          value={dashboardData.customers.value} 
        />
      </Grid>

      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress 
          sx={{ height: '100%' }} 
          value={dashboardData.tasks.value} 
        />
      </Grid>

      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit 
          sx={{ height: '100%' }} 
          value={dashboardData.profit.value} 
        />
      </Grid>

      <Grid lg={12} xs={12}>
        <SalesTrend
          chartSeries={dashboardData.salesTrend.chartSeries}
          sx={{ height: '100%' }}
        />
      </Grid>

      <Grid lg={8} xs={12}>
        <UserGrowth
          chartSeries={dashboardData.userGrowth.chartSeries}
          sx={{ height: '100%' }}
        />
      </Grid>

      <Grid lg={4} md={6} xs={12}>
        <Traffic 
          chartSeries={dashboardData.traffic.chartSeries} 
          labels={dashboardData.traffic.labels} 
          sx={{ height: '100%' }} 
        />
      </Grid>

      <Grid lg={12} md={12} xs={12}>
        <LatestOrders
          orders={dashboardData.orders}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}

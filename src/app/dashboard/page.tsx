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

// At the top of your dashboard file
interface Order {
  id: string;
  customer: {
    name: string;
  };
  amount: number;
  status: "pending" | "delivered" | "refunded";
  createdAt: Date;
}

export default function DashboardPage(): React.JSX.Element {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget 
          diff={data.budget.diff} 
          trend={data.budget.trend as "up" | "down"} 
          sx={{ height: '100%' }} 
          value={data.budget.value} 
        />
      </Grid>
      
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers 
          diff={data.customers.diff} 
          trend={data.customers.trend  as "up" | "down" } 
          sx={{ height: '100%' }} 
          value={data.customers.value} 
        />
      </Grid>
      
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress 
          sx={{ height: '100%' }} 
          value={data.tasks.value} 
        />
      </Grid>
      
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit 
          sx={{ height: '100%' }} 
          value={data.profit.value} 
        />
      </Grid>
      
      <Grid lg={12} xs={12}>
        <SalesTrend
          chartSeries={data.salesTrend.chartSeries}
          sx={{ height: '100%' }}
        />
      </Grid>
      
      <Grid lg={8} xs={12}>
        <UserGrowth
          chartSeries={data.userGrowth.chartSeries}
          sx={{ height: '100%' }}
        />
      </Grid>
      
      <Grid lg={4} md={6} xs={12}>
        <Traffic 
          chartSeries={data.traffic.chartSeries} 
          labels={data.traffic.labels} 
          sx={{ height: '100%' }} 
        />
      </Grid>
      
      <Grid lg={12} md={12} xs={12}>
        <LatestOrders
          orders={data.orders as Order[]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
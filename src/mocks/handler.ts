import { http, HttpResponse } from 'msw';
import { dashboardData } from './data';

export const handlers = [
  // Get all dashboard data
  http.get('/api/dashboard', () => {
    return HttpResponse.json(dashboardData, { status: 200 });
  }),

  // Specific endpoints
  http.get('/api/dashboard/budget', () => {
    return HttpResponse.json(dashboardData.budget ?? {}, { status: 200 });
  }),

  http.get('/api/dashboard/customers', () => {
    return HttpResponse.json(dashboardData.customers ?? {}, { status: 200 });
  }),

  http.get('/api/dashboard/sales-trend', () => {
    return HttpResponse.json(dashboardData.salesTrend ?? {}, { status: 200 });
  }),

  http.get('/api/dashboard/user-growth', () => {
    return HttpResponse.json(dashboardData.userGrowth ?? {}, { status: 200 });
  }),

  http.get('/api/dashboard/traffic', () => {
    return HttpResponse.json(dashboardData.traffic ?? {}, { status: 200 });
  }),

  http.get('/api/dashboard/orders', () => {
    return HttpResponse.json(dashboardData.orders ?? {}, { status: 200 });
  }),
];

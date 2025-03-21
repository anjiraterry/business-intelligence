// src/mocks/handlers.ts
import { rest } from 'msw';
import { dashboardData } from './data';

export const handlers = [
  // Get all dashboard data
  rest.get('/api/dashboard', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dashboardData));
  }),
  
  // Get individual data endpoints
  rest.get('/api/dashboard/budget', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dashboardData.budget));
  }),
  
  rest.get('/api/dashboard/customers', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dashboardData.customers));
  }),
  
  rest.get('/api/dashboard/sales-trend', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dashboardData.salesTrend));
  }),
  
  rest.get('/api/dashboard/user-growth', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dashboardData.userGrowth));
  }),
  
  rest.get('/api/dashboard/traffic', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dashboardData.traffic));
  }),
  
  rest.get('/api/dashboard/orders', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dashboardData.orders));
  }),
];
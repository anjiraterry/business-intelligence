// src/mocks/data.ts
import dayjs from 'dayjs';

export const dashboardData = {
  budget: {
    value: "$24k",
    diff: 12,
    trend: "up"
  },
  
  customers: {
    value: "1.6k",
    diff: 16,
    trend: "down"
  },
  
  tasks: {
    value: 75.5
  },
  
  profit: {
    value: "$15k"
  },
  
  salesTrend: {
    chartSeries: [
      { name: 'Revenue', data: [31, 40, 28, 51, 42, 67, 69, 61, 72, 84, 90, 101] },
      { name: 'Profit', data: [11, 32, 18, 39, 27, 51, 48, 43, 57, 62, 73, 79] },
    ]
  },
  
  userGrowth: {
    chartSeries: [
      { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
      { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
    ]
  },
  
  traffic: {
    chartSeries: [63, 15, 22],
    labels: ['Desktop', 'Tablet', 'Phone']
  },
  
  orders: [
    {
      id: 'ORD-007',
      customer: { name: 'Ekaterina Tankova' },
      amount: 30.5,
      status: 'pending',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
    },
    {
      id: 'ORD-006',
      customer: { name: 'Cao Yu' },
      amount: 25.1,
      status: 'delivered',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
    },
    {
      id: 'ORD-004',
      customer: { name: 'Alexa Richardson' },
      amount: 10.99,
      status: 'refunded',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
    },
    {
      id: 'ORD-003',
      customer: { name: 'Anje Keizer' },
      amount: 96.43,
      status: 'pending',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
    },
    {
      id: 'ORD-002',
      customer: { name: 'Clarke Gillebert' },
      amount: 32.54,
      status: 'delivered',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
    },
    {
      id: 'ORD-001',
      customer: { name: 'Adam Denisov' },
      amount: 16.76,
      status: 'delivered',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
    },
  ]
};
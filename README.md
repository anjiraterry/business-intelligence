# Business Intelligence Dashboard

A modern business intelligence dashboard built with Next.js, React, Material UI, and TypeScript, providing real-time analytics and data visualization to monitor business performance metrics.

## 📊 Features

- **Interactive Data Visualization**: Line charts, bar charts, and pie charts for comprehensive data analysis
- **Performance Metrics**: Track key business metrics including budget, customer growth, and sales trends
- **Responsive Design**: Optimized for all device sizes from mobile to desktop
- **Dark Mode Support**: Toggle between light and dark themes for user preference
- **Authentication System**: Secure login with session management and inactivity timeout
- **Modern UI Components**: Material UI-based interface with smooth animations and transitions

## 🚀 Technology Stack

- **Frontend Framework**: Next.js with React 18
- **UI Components**: Material UI v5
- **Data Visualization**: Chart.js integration
- **State Management**: React Hooks and Context API
- **Type Safety**: TypeScript
- **API Handling**: REST API with MSW for mock services during development
- **Authentication**: Custom authentication with session management
- **Styling**: CSS-in-JS with MUI styled components

## 📁 Project Structure
src/
├── app/ # Next.js app directory with routes
│ ├── dashboard/ # Dashboard routes and pages
│ ├── auth/ # Authentication pages
│ └── layout.tsx # Root layout component
├── components/ # Reusable UI components
│ ├── dashboard/ # Dashboard-specific components
│ │ ├── layout/ # Layout components including navigation
│ │ └── overview/ # Chart and widget components
│ └── auth/ # Authentication components
├── hooks/ # Custom React hooks
├── lib/ # Utility functions and services
│ └── auth/ # Auth client and helpers
├── mocks/ # Mock data and service workers
├── paths.ts # Application route definitions
└── types/ # TypeScript type definitions

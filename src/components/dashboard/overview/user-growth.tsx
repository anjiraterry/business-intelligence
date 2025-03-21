'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

export interface UserGrowthProps {
  chartSeries: { name: string; data: number[] }[];
  sx?: SxProps;
}

export function UserGrowth({ chartSeries, sx }: UserGrowthProps): React.JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Responsive chart height
  const chartHeight = isMobile ? 250 : isTablet ? 300 : 350;
  
  const chartOptions: ApexOptions = useChartOptions(isMobile, isTablet);

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          !isMobile && (
            <Button color="inherit" size="small" startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}>
              Sync
            </Button>
          )
        }
        title="User Growth"
      />
      <CardContent sx={{ pb: isMobile ? 1 : 2 }}>
        <Box sx={{ 
          width: '100%', 
          overflow: 'hidden',
          '.apexcharts-xaxis-label': {
            fontSize: isMobile ? '10px' : '12px',
          }
        }}>
          <Chart height={chartHeight} options={chartOptions} series={chartSeries} type="bar" width="100%" />
        </Box>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end', py: isMobile ? 0.5 : 1 }}>
        <Button 
          color="inherit" 
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />} 
          size={isMobile ? "small" : "medium"}
        >
          {isMobile ? "View" : "Overview"}
        </Button>
      </CardActions>
    </Card>
  );
}

function useChartOptions(isMobile: boolean, isTablet: boolean): ApexOptions {
  const theme = useTheme();
  
  const getCategories = (): string[] => {
    if (isMobile) {
      return ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov']; // Mobile: Show fewer months
    }
    if (isTablet) {
      return ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']; // Tablet: Short names
    }
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // Desktop: Full names
  };

  return {
    chart: { 
      background: 'transparent', 
      stacked: false, 
      toolbar: { show: false },
      parentHeightOffset: 0,
    },
    colors: [theme.palette.success.main, alpha(theme.palette.success.main, 0.25)],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        top: 0,
        right: isMobile ? 0 : 10,
        bottom: 0,
        left: isMobile ? 0 : 10
      },
    },
    legend: { 
      show: !isMobile, 
      position: 'top',
      horizontalAlign: 'right',
      fontSize: isTablet ? '10px' : '12px',
      markers: {
        width: isTablet ? 8 : 12,
        height: isTablet ? 8 : 12,
      },
      itemMargin: {
        horizontal: isTablet ? 6 : 10,
      }
    },
    plotOptions: { 
      bar: { 
        columnWidth: isMobile ? '70%' : isTablet ? '50%' : '40px',
        distributed: isMobile,
      } 
    },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: getCategories(),
      labels: { 
        offsetY: 5, 
        style: { 
          colors: theme.palette.text.secondary,
          fontSize: isMobile ? '8px' : isTablet ? '10px' : '12px', 
        },
        rotate: isMobile ? -45 : 0,
        hideOverlappingLabels: true,
      },
    },
    yaxis: {
      tickAmount: isMobile ? 3 : 5,
      labels: {
        formatter: (value) => (value > 0 ? (isMobile ? `${value}` : `${value}K`) : `${value}`),
        offsetX: isMobile ? -5 : -10,
        style: { 
          colors: theme.palette.text.secondary,
          fontSize: isMobile ? '8px' : isTablet ? '10px' : '12px',
        },
      },
    },
    responsive: [
      {
        breakpoint: 600, 
        options: {
          chart: { height: 250 },
        }
      },
      {
        breakpoint: 960, 
        options: {
          chart: { height: 300 },
        }
      }
    ]
  };
}

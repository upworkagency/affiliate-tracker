"use client"
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LinearScale, CategoryScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Redirects } from 'kysely-codegen';
import type { ChartData, ChartOptions, } from 'chart.js'

Chart.register(
    LineController,
    LinearScale,
    CategoryScale,
    PointElement,
    LineElement,
    Tooltip,  
    Legend    
);
type Generated<T> = T;
type Timestamp = Date;

interface LineChartProps {
  redirects: Redirects[];
}
type Dataset = {
    label: string;
    data: number[];
    bookedData: number[];
    borderColor: string;
    fill: boolean;
};
type Platforms = 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'twitter';

const platformColors: Record<Platforms, string> = {
    tiktok: 'rgba(255, 99, 132, 0.8)',
    youtube: 'rgba(54, 162, 235, 0.8)',
    instagram: 'rgba(255, 206, 86, 0.8)',
    facebook: 'rgba(75, 192, 192, 0.8)',
    twitter: 'rgba(153, 102, 255, 0.8)',
    // ... add more platform colors if necessary
};
const formatDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;
const normalizePlatform = (platform: string): Platforms | null => {
    switch (platform.toLowerCase()) {
        case 'tiktok':
            return 'tiktok';
        case 'youtube':
            return 'youtube';
        case 'instagram':
            return 'instagram';
        case 'facebook':
            return 'facebook';
        case 'twitter':
            return 'twitter';
        default:
            return null;  // Or handle other platforms accordingly
    }
};

const processData = (redirects: Redirects[]) => {
    const groupedData: { [date: string]: { [platform: string]: { redirects: number, booked: number } } } = {};

    redirects.forEach((redirect) => {
        if (redirect.redirect_timestamp) {
            const normalizedPlatform = normalizePlatform(redirect.platform);
            if (normalizedPlatform) {
                const dateObj = new Date(redirect.redirect_timestamp.toString());
                const dateStr = formatDate(dateObj);
                if (!groupedData[dateStr]) groupedData[dateStr] = {};
                if (!groupedData[dateStr][normalizedPlatform]) groupedData[dateStr][normalizedPlatform] = { redirects: 0, booked: 0 };
                groupedData[dateStr][normalizedPlatform].redirects++;
                if (redirect.booked_timestamp) groupedData[dateStr][normalizedPlatform].booked++;
            }
        }
    });

    return groupedData;
};


const getEarliestDate = (redirects: Redirects[]) => {
    if (!redirects || redirects.length === 0) return new Date();

    let earliest: Date = new Date(redirects[0].redirect_timestamp?.toString() || '');
    for (let redirect of redirects) {
        if (redirect && redirect.redirect_timestamp) {
            const current = new Date(redirect.redirect_timestamp?.toString() || '');
            if (current < earliest) earliest = current;
        }
    }
    earliest.setHours(0, 0, 0, 0);
    return earliest;
};

const transformToChartJsFormat = (processedData: any, currentDate: Date, earliestDate: Date) => {
  const allDates: string[] = [];
  while (earliestDate <= currentDate) {
    allDates.push(formatDate(earliestDate));
    earliestDate.setDate(earliestDate.getDate() + 1);
  }

  const allPlatforms: string[] = [];
  allDates.forEach(date => {
    Object.keys(processedData[date] || {}).forEach(platform => {
      if (allPlatforms.indexOf(platform) === -1) allPlatforms.push(platform);
    });
  });
  const datasets: Dataset[] = allPlatforms.map(platform => {
    // Type assert the platform as one of the Platforms
    const platformKey = platform as Platforms;
    
    return {
        label: platform,
        data: allDates.map(date => processedData[date]?.[platform]?.redirects || 0),
        bookedData: allDates.map(date => processedData[date]?.[platform]?.booked || 0),
        borderColor: platformColors[platformKey] || '#ffffff',  // use the mapped color, or generate a random color if not found
        fill: false
    };
});
  return { labels: allDates, datasets };
};

export const LineChart: React.FC<LineChartProps> = ({ redirects }) => {
    if(!redirects) return (
        <div>
            <h1>Redirects</h1>
            <p>No data</p>
        </div>
    )
  const earliestDate = getEarliestDate(redirects);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const processedData = processData(redirects);
  const { datasets, labels } = transformToChartJsFormat(processedData, currentDate, earliestDate);
  const data = { labels, datasets };
  const options:ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Date', color: 'white' },
      grid: {
        color: 'transparent'
    }    },
      y: {
        title: {
            display: true,
            text: 'Counts',
            color: 'white'
        },
        ticks: {
            stepSize: 1,
        },
        grid: {
            color: 'transparent'
        }
        
    }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {   
            console.log(context);
            const label = context.dataset.label; // This should get the platform label
            const value = context.parsed.y;
            const bookedValue = context.dataset.bookedData[context.dataIndex];
            return `${label}: Redirects = ${value}, Booked = ${bookedValue}`;
          }
        }
      },
      legend: {
        display: true,
        labels: {
            color: 'white',

        },
        align: 'start',
      },
      colors: {
        enabled: true,
      }
    }
  };
  return <Line data={data} options={options} />;
};

 
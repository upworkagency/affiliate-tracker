import React from 'react';

interface DoughnutProps {
  totalRedirects: number;
  redirectsLeadingToCalls: number;
  size?: number;
  strokeWidth?: number;
}

export const PieChart: React.FC<DoughnutProps> = ({ totalRedirects, redirectsLeadingToCalls, size = 275, strokeWidth = 40 }) => {
  const circleRadius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * circleRadius;
  const percentage = redirectsLeadingToCalls / totalRedirects;
  const offset = circumference - percentage * circumference;

  return (
    <svg width={size} height={size}>
      <circle 
        cx={size / 2} 
        cy={size / 2} 
        r={circleRadius} 
        fill="none"
        stroke="#FF6384" 
        strokeWidth={strokeWidth} 
      />
      <circle 
        cx={size / 2} 
        cy={size / 2} 
        r={circleRadius} 
        fill="none"
        stroke="#4BC0C0" 
        strokeWidth={strokeWidth} 
        strokeDasharray={circumference} 
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      {/* Label for Total Redirects */}
      <text 
        x={size / 2} 
        y={size / 2 - 10}
        fill="#ffffff"
        fontSize="12px"
        textAnchor="middle"
      >
        {`Total Clicks: ${totalRedirects}`}
      </text>
      {/* Label for Redirects Leading to Calls */}
      <text 
        x={size / 2} 
        y={size / 2 + 10}
        fill="#ffffff"
        fontSize="12px"
        textAnchor="middle"
      >
        {`Scheduled Meetings: ${redirectsLeadingToCalls}`}
      </text>
    </svg>
  );
}


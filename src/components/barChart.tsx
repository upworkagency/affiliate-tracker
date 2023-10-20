"use client"
import { useState, useEffect } from 'react'
import { Chart, BarController, LinearScale, CategoryScale, BarElement, DoughnutController, ArcElement } from 'chart.js';
import type { ChartData, ChartOptions, } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2';
import debounce from 'lodash/debounce';
import { Redirects } from 'kysely-codegen'
import { type Defaults } from 'chart.js';

interface BarChartProps {
    data: ChartData<'bar'>;
    options: ChartOptions<'bar'>;
}
interface PlatformRedirectCounts {
    [key: string]: number;
}
interface BarProps {
    redirects: Redirects[];
}
const centerTextPlugin = {
    id: 'centerTextPlugin',
    afterDraw: (chart: any) => {
        const width = chart.width;
        const height = chart.height;
        const ctx = chart.ctx;
        ctx.restore();

        const text = chart.config._activeLabel || "";
        const textX = Math.round(width / 2);
        const textY = Math.round(height / 2);
        
        ctx.fillStyle = '#000';
        ctx.font = "20px Arial";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, textX, textY);
        
        ctx.save();
    },
};
type Platforms = 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'twitter';
const platformColors: Record<Platforms, string> = {
    youtube: 'rgba(54, 162, 235, 0.8)',
    tiktok: 'rgba(255, 99, 132, 0.8)',
    facebook: 'rgba(75, 192, 192, 0.8)',
    instagram: 'rgba(255, 206, 86, 0.8)',
   
    twitter: 'rgba(153, 102, 255, 0.8)',
    // ... add more platform colors if necessary
};
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
export const BarChart:React.FC<BarProps> = ({ redirects }) => {
    if(redirects.length === 0){
        return (
            <div className="flex flex-col w-full sm:w-1/2 h-full justify-center text-white text-center">
                No Analytics
            </div>
        )
    }
    Chart.register(BarController, LinearScale, CategoryScale, BarElement, DoughnutController, ArcElement, centerTextPlugin);
    // Chart.register(centerTextPlugin);

    const [platformCounts, setPlatformCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const counts: Record<string, number> = {};
        redirects.forEach(redirect => {
            const normalizedPlatform = normalizePlatform(redirect.platform);
            if (normalizedPlatform) {
                counts[normalizedPlatform] = (counts[normalizedPlatform] || 0) + 1;
            }
        });
        setPlatformCounts(counts);
    }, [redirects]);
    const [hoverPlatform, setHoverPlatform] = useState<string | null>(redirects.length > 0 ? redirects[0].platform : null);
    const [hoverCoords, setHoverCoords] = useState<{top: number, left: number} | null>({ top: 50, left: 650 }); // Adjust the values based on your layout.
    // Extract keys (platform names) and values (redirect counts) from the counts object
    const platforms = Object.keys(platformCounts);
    const redirectCounts = Object.values(platformCounts);

    const getDonutDataForPlatform = (platform: string) => {
        console.log("Platform:", platform)
    
        // Filter all redirects for the given platform.
        const redirectsForPlatform = redirects.filter(r => r.platform === platform);
    
        // Count the number of redirects that resulted in bookings.
        const totalBookings = redirectsForPlatform.filter(r => r.calendly_event_id !== null).length;
    
        // Calculate the number of redirects that did not result in bookings.
        const totalNonBookings = redirectsForPlatform.length - totalBookings;
    
        console.log("Total Redirects (non-bookings):", totalNonBookings)
        console.log("Total Bookings:", totalBookings)
    
        return {
            labels: ['Clicks (Not Booked)', 'Bookings'],
            datasets: [{
                data: [totalNonBookings, totalBookings],
                backgroundColor: ['#16113A', platformColors[platform as Platforms] || '#ccc'],
            }]
        };
    };
    
    const backgroundColors = platforms.map(platform => platformColors[platform as Platforms] || '#ccc');
    const borderColors = platforms.map(platform => platformColors[platform as Platforms] || '#aaa');

    const data: ChartData<'bar'> = {
        labels: platforms,
        datasets: [{
            data: redirectCounts,
            label: 'Total Clicks',  // You can adjust this label as per your requirement
            backgroundColor: backgroundColors,
            borderColor: borderColors,
        }]
    };
    const handleHover = debounce((event, chartElements) => {
        console.log(event)
        if (chartElements && chartElements.length > 0) {
            const { index } = chartElements[0];
            const left = chartElements[0].element.x;
            const top = chartElements[0].element.y;
            
            // Only set the platform if it has changed to avoid re-renders.
            if (hoverPlatform !== platforms[index]) {
                setHoverPlatform(platforms[index]);
            }
            
            // Always update the coordinates.
            setHoverCoords({ top, left });
        } // No need to reset to null when unhovered.
    }, 200);  // debounce for 200ms. Adjust as needed.
    
    
    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'white' // color for the tick text
                },
                title: {
                    display: true,
                    text: 'Clicks',
                    color: 'white'  // color for the X-axis title
                }
            },
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'white' // color for the tick text
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white'  // color for the legend labels
                }
            }
        },
        onHover: handleHover
        
    }
    
    const props: BarChartProps = {
        data: data,
        options: options
    }

    const donutData = hoverPlatform ? getDonutDataForPlatform(hoverPlatform) : null;
  
    
    
    const donutOptions:ChartOptions<"doughnut"> = {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
            onProgress: function(animation:any) {
                const chart = animation.chart;
                const ctx = chart.ctx;
                const width = chart.width;
                const height = chart.height;
                
                ctx.restore();
                
                const platform = hoverPlatform || ''; // Defaulting to empty string if hoverPlatform is null
                const textX = Math.round(width / 2);
                const textY = Math.round(height / 2) - Math.round(height / 2)*.1;
          
                ctx.fillStyle = '#ffffff';
                ctx.font = "20px Arial";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(platform, textX, textY);
                
                ctx.save();
            }
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        },
        plugins:  {
            // Change options for ALL labels of THIS CHART
            legend: {
                labels: {
                    color: 'white',  // color for the legend labels
                    boxHeight: 10,  
                    usePointStyle: true,
                    pointStyle: 'circle', 
                    // boxPadding: 20
                },
                fullSize: true,
                align: 'center',
                position: "bottom"
            }
        }
        
      };
      return (
        <div className='xl:w-full p-4 flex flex-col sm:flex-col space-y-4 sm:space-y-0 sm:space-x-4 w-full h-full bg-[#272953] rounded-lg '>
            <h1 className=' text-white'>Analytics</h1>
            <div className='p-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full h-full'>
                <div className='flex flex-col w-full sm:w-1/2 h-full justify-center'>
                    <div className="lg:h-[250px]"> 
                        <Bar data={data} options={options} />
                    </div>
                </div>
        
                {hoverPlatform && donutData && (
                    <div className="flex flex-col w-full sm:w-1/2 h-full justify-center items-center">
                        <div className="lg:h-[250px]"> 
                            <Doughnut data={donutData} options={donutOptions} />
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    );
}
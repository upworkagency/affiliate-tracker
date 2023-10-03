import { type Redirects, type Generated } from '../../node_modules/kysely-codegen/dist/db'

interface BarProps {
    label: string;
    value: number;
    max: number;
  }
  
  const Bar: React.FC<BarProps> = ({ label, value, max }) => {
    console.log(`Rendering bar for ${label} with value ${value}`);
    return (
      <div className="mb-4">
        <div className="text-sm mb-2">{label}</div>
        <div className="w-full h-4 bg-gray-200 rounded">
          <div className={`h-full bg-blue-500 rounded w-[${(value / max) * 100}%]`}></div>
        </div>
      </div>
    );
  };
  

  interface BarChartProps {
    redirects: Redirects[];
  }
  
  export const BarChart: React.FC<BarChartProps> = ({ redirects }) => {
    const platformCounts: { [key: string]: number } = {};
  
    redirects.forEach((redirect) => {
      if (platformCounts[redirect.platform]) {
        platformCounts[redirect.platform]++;
      } else {
        platformCounts[redirect.platform] = 1;
      }
    });

    const totalRedirects = redirects.length;
    const maxCount = Math.max(...Object.values(platformCounts));
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"];
    let colorIndex = 0;

    return (
        <div className="w-full pr-10">
          <h2 className="text-lg font-semibold mb-4">Platform Redirects</h2>
          <div className="relative h-40 bg-gray-100 p-4 rounded overflow-auto">
            {Object.entries(platformCounts).map(([platform, count]) => {
              const currentColor = colors[colorIndex % colors.length];
              colorIndex++;
              return (
                <div key={platform} className="mb-2">
                  <div className="text-sm mb-1">{platform}</div>
                  <div
                    className={`relative ${currentColor} h-5 rounded`}
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  >
                    <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white text-xs">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-sm">Total Redirects: {totalRedirects}</div>
        </div>
      );
  };
  
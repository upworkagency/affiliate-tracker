import React, { useEffect, useRef, useState } from 'react'

interface PieChartProps {
  counts:  {
    booked: number,
    cancelled: number,
    closed: number,
    followUp: number
  }
}
export const PieChart: React.FC<PieChartProps> = ({ counts }) => {
    const [ size, setSize ] = useState(225)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const updateSize = () => {
        if (containerRef.current) {
          const newSize = Math.min(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
          );
          setSize(newSize);
        }
      };
  
      const resizeObserver = new ResizeObserver(updateSize);
      updateSize();
  
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
  
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }, []);

    const total = Object.entries(counts).reduce(
        (prev: [acc: string, val: number], cur: [acc: string, val: number]) => ["", prev[1] + cur[1]], ["",0]
    );

    const outerRadius = size / 2;
    const innerRadius = size / 3;
    const origin = size / 2;
    let rotation = 0;
  
    const segments = Object.entries(counts).map((value: [ string, number ], index: number) => {
      const percentage = (value[1] / total[1]) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = rotation;
      const endAngle = rotation + angle;
      rotation += angle;
  
      const d = createArc(startAngle, endAngle, outerRadius, innerRadius, origin);
  
      return (
        <svg key={index} className={``}>
          <path key={index} d={d} />
        </svg>
      )
    });
  
    return (
      <div
        className="flex w-full items-center justify-center"
        ref={containerRef}
      >
        <svg className='' width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments}
        </svg>
      </div>
    );
  };

  const polarToCartesian = (angle: number, radius: number, origin: number) => {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: origin + radius * Math.cos(radians),
      y: origin + radius * Math.sin(radians),
    };
  };
  
  const createArc = (
    startAngle: number,
    endAngle: number,
    outerRadius: number,
    innerRadius: number,
    origin: number
  ) => {
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const startOuter = polarToCartesian(startAngle, outerRadius, origin);
    const endOuter = polarToCartesian(endAngle, outerRadius, origin);
    const startInner = polarToCartesian(endAngle, innerRadius, origin);
    const endInner = polarToCartesian(startAngle, innerRadius, origin);
  
    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
      "Z",
    ].join(" ");
  };
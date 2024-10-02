import React, { useEffect, useRef } from 'react';
import Dygraph from 'dygraphs';

// Define a more specific type for Dygraph options based on what properties are commonly used
interface DygraphOptions {
  drawPoints?: boolean;
  showRoller?: boolean;
  labels?: string[];
  interactionModel?: Record<string, unknown>; // Replace any with Record<string, unknown>
  panEdgeFraction?: number;
  [key: string]: unknown; // For other dynamic properties
}

interface TimeSeriesChartProps {
  data: Array<[number, number]>;
  granularity: number; // Accept granularity as a prop
  options?: DygraphOptions; // Use the custom interface for options
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, granularity, options }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Dygraph | null>(null);

  // Function to adjust data based on granularity
  const applyGranularity = (data: Array<[number, number]>, granularity: number) => {
    return data.filter((_, index) => index % Math.round(1 / granularity) === 0);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && graphRef.current) {
      // Apply granularity to data
      const formattedData = applyGranularity(data, granularity).map(([time, amplitude]) => [time, amplitude]);

      if (!chartRef.current) {
        // Initialize the chart
        chartRef.current = new Dygraph(graphRef.current, formattedData, {
          ...options,
          drawPoints: false,
          showRoller: false,
          labels: ['Time (s)', 'Amplitude'],
          interactionModel: Dygraph.defaultInteractionModel,
          panEdgeFraction: 0.1,
        });
      } else {
        // Update chart data and reset zoom when data changes
        chartRef.current.updateOptions({ file: formattedData });
        chartRef.current.resetZoom(); // Reset zoom to ensure auto-scaling works properly
      }
    }
  }, [data, granularity, options]); // Recalculate when data or granularity changes

  // Handle chart cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return <div ref={graphRef} style={{ width: '100%', height: '500px' }} />;
};

export default TimeSeriesChart;

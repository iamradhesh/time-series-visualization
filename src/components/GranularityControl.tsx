import React from 'react';
import '../app/globals.css';
interface GranularityControlProps {
  onGranularityChange: (granularity: number) => void;
}

const GranularityControl: React.FC<GranularityControlProps> = ({ onGranularityChange }) => {
  const options = [
    { label: '10s', value: 10 },
    { label: '1s', value: 1 },
    { label: '100ms', value: 0.1 },
    { label: '10ms', value: 0.01 },
    { label: '1ms', value: 0.001 },
  ];

  return (
    <div className="granularity-control">
      <select onChange={(e) => onGranularityChange(parseFloat(e.target.value))}>
        {options.map((opt) => (
          <option key={opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GranularityControl;

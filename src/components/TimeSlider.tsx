import React from 'react';

interface TimeSliderProps {
  maxTime: number;
  onTimeChange: (time: number) => void;
}

const TimeSlider: React.FC<TimeSliderProps> = ({ maxTime, onTimeChange }) => {
  return (
    <div className="time-slider">
      <input
        type="range"
        min="0"
        max={maxTime}
        step="0.001"
        onChange={(e) => onTimeChange(parseFloat(e.target.value))}
      />
    </div>
  );
};

export default TimeSlider;

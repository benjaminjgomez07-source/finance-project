import React from 'react';

interface SparklineProps {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data = [],
  color,
  width = 70,
  height = 24,
}) => {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="opacity-0" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const usableHeight = height - padding * 2;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - padding - ((val - min) / range) * usableHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const isUp = data[data.length - 1] >= data[0];
  const strokeColor = color || (isUp ? '#00c805' : '#ff5000');

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* End pulse dot */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={
            height -
            padding -
            ((data[data.length - 1] - min) / range) * usableHeight
          }
          r="2.5"
          fill={strokeColor}
        />
      )}
    </svg>
  );
};

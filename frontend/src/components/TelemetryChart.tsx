import React from 'react';
import { TelemetryPoint } from '../services/api';

interface TelemetryChartProps {
  data: TelemetryPoint[];
  title?: string;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ data, title = "Live Telemetry Feed" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 text-center text-slate-400 font-mono text-sm">
        No telemetry points available.
      </div>
    );
  }

  // Calculate SVG line points for Temperature
  const width = 600;
  const height = 180;
  const padding = 20;

  const temps = data.map(d => d.temperature);
  const minTemp = Math.min(...temps) - 1;
  const maxTemp = Math.max(...temps) + 1;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.temperature - minTemp) / (maxTemp - minTemp)) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-400">Real-time STM32 sensor array output (°C)</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan inline-block"></span>
          <span className="text-slate-300">Temperature</span>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 stroke-brand-cyan fill-none">
          {/* Background Grid Lines */}
          <line x1="0" y1="40" x2={width} y2="40" stroke="#1F2937" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="0" y1="90" x2={width} y2="90" stroke="#1F2937" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="0" y1="140" x2={width} y2="140" stroke="#1F2937" strokeDasharray="4 4" strokeWidth="1" />

          {/* Smooth Trend Polyline */}
          <polyline
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2 px-2 border-t border-slate-800/60 pt-2">
        <span>{data[0]?.timestamp}</span>
        <span>{data[Math.floor(data.length / 2)]?.timestamp}</span>
        <span>{data[data.length - 1]?.timestamp}</span>
      </div>
    </div>
  );
};

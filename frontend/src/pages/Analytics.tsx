import React from 'react';
import { TelemetryChart } from '../components/TelemetryChart';
import { Download } from 'lucide-react';

export const Analytics: React.FC = () => {
  const sampleData = [
    { timestamp: "00:00", temperature: 22.4, humidity: 48, power_mw: 1200, relay_status: 0 },
    { timestamp: "00:05", temperature: 23.1, humidity: 47, power_mw: 1250, relay_status: 0 },
    { timestamp: "00:10", temperature: 24.5, humidity: 45, power_mw: 1350, relay_status: 1 },
    { timestamp: "00:15", temperature: 25.2, humidity: 44, power_mw: 1420, relay_status: 1 },
    { timestamp: "00:20", temperature: 24.0, humidity: 46, power_mw: 1300, relay_status: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Telemetry Time-Series Analytics</h1>
          <p className="text-xs text-slate-400">Inspect historical sensor data trends and export CSV reports</p>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <TelemetryChart data={sampleData} title="24-Hour Historical Temperature Log (°C)" />
    </div>
  );
};

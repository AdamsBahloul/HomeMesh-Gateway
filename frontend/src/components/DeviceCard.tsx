import React, { useState } from 'react';
import { Cpu, Power, Thermometer, Droplets, Zap, RefreshCw } from 'lucide-react';
import { Device } from '../services/api';

interface DeviceCardProps {
  device: Device;
  onActuate?: (deviceId: string, command: str) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onActuate }) => {
  const [relayState, setRelayState] = useState(false);

  const toggleRelay = () => {
    const nextState = !relayState;
    setRelayState(nextState);
    if (onActuate) {
      onActuate(device.device_id, nextState ? 'RELAY_ON' : 'RELAY_OFF');
    }
  };

  return (
    <div className="glass-card glass-card-hover rounded-xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-brand-cyan">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">{device.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{device.device_id}</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide ${
            device.status === 'ONLINE' 
              ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {device.status}
          </span>
        </div>

        {/* Sensor Snapshot Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>Temp</span>
            </div>
            <p className="text-sm font-semibold text-slate-100 font-mono">24.5 °C</p>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 mb-1">
              <Droplets className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Hum</span>
            </div>
            <p className="text-sm font-semibold text-slate-100 font-mono">45 %</p>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-brand-violet" />
              <span>Power</span>
            </div>
            <p className="text-sm font-semibold text-slate-100 font-mono">1.35 W</p>
          </div>
        </div>
      </div>

      {/* Actuator & Metadata Controls */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="text-slate-400 font-mono text-[11px]">
          FW: <span className="text-slate-200">{device.firmware_version}</span>
        </div>

        <button
          onClick={toggleRelay}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            relayState 
              ? 'bg-brand-emerald text-slate-950 shadow-md shadow-brand-emerald/20' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{relayState ? 'Relay ON' : 'Relay OFF'}</span>
        </button>
      </div>
    </div>
  );
};

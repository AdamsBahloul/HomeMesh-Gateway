import React from 'react';
import { DeviceCard } from '../components/DeviceCard';
import { Plus } from 'lucide-react';

export const Devices: React.FC = () => {
  const devices = [
    {
      id: 1,
      device_id: "stm32-32f401a8",
      name: "HVAC Temperature Sensor #1",
      device_type: "TEMP_SENSOR",
      status: "ONLINE",
      firmware_version: "v1.2.4",
      last_seen: "Just now"
    },
    {
      id: 2,
      device_id: "stm32-32f402b9",
      name: "Main Power Meter (3-Phase)",
      device_type: "POWER_METER",
      status: "ONLINE",
      firmware_version: "v1.2.4",
      last_seen: "Just now"
    },
    {
      id: 3,
      device_id: "stm32-32f403c0",
      name: "Server Room Exhaust Fan Relay",
      device_type: "RELAY_CTRL",
      status: "ONLINE",
      firmware_version: "v1.1.0",
      last_seen: "Just now"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">STM32 Microcontroller Node Registry</h1>
          <p className="text-xs text-slate-400">Manage hardware node configurations, serial port mapping, and actuation</p>
        </div>
        <button className="bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow-md">
          <Plus className="w-4 h-4" />
          <span>Provision New Node</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {devices.map((dev) => (
          <DeviceCard key={dev.id} device={dev} />
        ))}
      </div>
    </div>
  );
};

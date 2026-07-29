import React, { useEffect, useState } from 'react';
import { Cpu, Activity, ShieldCheck, Zap } from 'lucide-react';
import { DeviceCard } from '../components/DeviceCard';
import { TelemetryChart } from '../components/TelemetryChart';
import { TelemetryWebSocket } from '../services/websocket';
import { Device, TelemetryPoint } from '../services/api';

export const Dashboard: React.FC = () => {
  const [devices] = useState<Device[]>([
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
  ]);

  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([
    { timestamp: "00:25:00", temperature: 24.1, humidity: 44.5, power_mw: 1320, relay_status: 0 },
    { timestamp: "00:27:00", temperature: 24.3, humidity: 45.0, power_mw: 1340, relay_status: 0 },
    { timestamp: "00:29:00", temperature: 24.8, humidity: 45.2, power_mw: 1380, relay_status: 1 },
    { timestamp: "00:31:00", temperature: 24.5, humidity: 44.8, power_mw: 1350, relay_status: 0 },
  ]);

  useEffect(() => {
    const ws = new TelemetryWebSocket();
    ws.connect((data) => {
      if (data.event === "TELEMETRY_UPDATE") {
        setTelemetry(prev => [
          ...prev.slice(-15),
          {
            timestamp: data.timestamp,
            temperature: data.temperature,
            humidity: data.humidity,
            power_mw: data.power_mw,
            relay_status: data.relay_status
          }
        ]);
      }
    });

    return () => ws.disconnect();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">Connected STM32 Nodes</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">3 / 3</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">Gateway Memory Load</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">18.4 %</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">MQTT Bus Latency</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">4.2 ms</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">Security & Cert Status</p>
            <p className="text-2xl font-bold text-brand-emerald mt-1">TLS 1.3 OK</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TelemetryChart data={telemetry} title="Real-Time Node Telemetry Broadcast (°C)" />
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-slate-100">Edge AI Anomaly Diagnostics</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                TFLite Stub
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-slate-300">Predictive Anomaly Score</span>
                  <span className="text-brand-emerald font-bold">0.12 (Normal)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-emerald h-full w-[12%]"></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-slate-300">CRC-16 Error Rate</span>
                  <span className="text-slate-200 font-bold">0.00 %</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-cyan h-full w-[0%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Model: Anomaly_v1_quant.tflite</span>
            <span className="text-brand-emerald">Inference: 1.8ms</span>
          </div>
        </div>
      </div>

      {/* Microcontroller Nodes List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-100">Active STM32 Microcontroller Nodes</h2>
          <span className="text-xs text-slate-400 font-mono">UART/RS485 Bus #0</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>
    </div>
  );
};

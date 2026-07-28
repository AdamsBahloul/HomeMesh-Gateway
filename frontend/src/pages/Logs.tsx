import React, { useState } from 'react';
import { Terminal, Filter, RefreshCw } from 'lucide-react';

export const Logs: React.FC = () => {
  const [logs] = useState([
    "[2026-07-29 00:30:01] [INFO] [GatewayDaemon]: Gateway initialized on /dev/ttyAMA0 @ 115200 baud",
    "[2026-07-29 00:30:02] [INFO] [MQTTClient]: Connected to Mosquitto Broker at localhost:1883 with TLS 1.3",
    "[2026-07-29 00:30:05] [INFO] [ProtocolEngine]: Frame unpacked: Sync 0xAA55, Seq 1, Cmd 0x03 (TELEMETRY_REPORT)",
    "[2026-07-29 00:30:05] [INFO] [MQTTClient]: Published telemetry to home/device/stm32-32f401a8/telemetry",
    "[2026-07-29 00:30:15] [INFO] [HealthMonitor]: Gateway Health OK: CPU=12%, RAM=18%, Temp=42.5°C",
    "[2026-07-29 00:30:25] [INFO] [RuleEngine]: Evaluating rule High Temperature Protection... Condition false (24.5°C <= 30.0°C)"
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Live System Event Logs</h1>
          <p className="text-xs text-slate-400">Stream real-time Linux gateway daemon and serial bridge debug logs</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 font-mono">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter: ALL</span>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-300 bg-slate-950/80 h-96 overflow-y-auto space-y-1.5">
        {logs.map((log, idx) => (
          <div key={idx} className="hover:bg-slate-900/60 p-1 rounded transition-colors flex items-start space-x-2">
            <span className="text-brand-cyan select-none">&gt;</span>
            <span className={log.includes("INFO") ? "text-slate-300" : "text-amber-400"}>{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

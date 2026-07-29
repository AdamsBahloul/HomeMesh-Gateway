import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { OtaModal } from '../components/OtaModal';

export const OtaUpdates: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const releases = [
    {
      version: "v1.2.4",
      target: "STM32F401 Temperature Node",
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      size: "142 KB",
      date: "2026-07-28"
    },
    {
      version: "v1.1.0",
      target: "STM32G4 Relay Actuator",
      sha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      size: "128 KB",
      date: "2026-07-20"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Over-The-Air (OTA) Firmware Management</h1>
          <p className="text-xs text-slate-400">Manage STM32 dual-bank firmware packages, cryptographically signed with SHA-256</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow-md"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Signed Firmware</span>
        </button>
      </div>

      <div className="glass-card rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
            <tr>
              <th className="p-3.5">Version</th>
              <th className="p-3.5">Target Device</th>
              <th className="p-3.5">Binary Size</th>
              <th className="p-3.5">SHA-256 Digest</th>
              <th className="p-3.5">Upload Date</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {releases.map((rel, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5 font-bold text-brand-cyan">{rel.version}</td>
                <td className="p-3.5 text-slate-200">{rel.target}</td>
                <td className="p-3.5 text-slate-400">{rel.size}</td>
                <td className="p-3.5 text-[10px] text-slate-500">{rel.sha256.substring(0, 16)}...</td>
                <td className="p-3.5 text-slate-400">{rel.date}</td>
                <td className="p-3.5 text-right">
                  <button className="bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan px-3 py-1 rounded text-[11px] font-bold border border-brand-cyan/30">
                    Deploy OTA
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OtaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

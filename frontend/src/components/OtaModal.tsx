import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, X } from 'lucide-react';

interface OtaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OtaModal: React.FC<OtaModalProps> = ({ isOpen, onClose }) => {
  const [version, setVersion] = useState('v1.3.0');
  const [targetType, setTargetType] = useState('TEMP_SENSOR');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-md rounded-xl p-6 border border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-100 mb-1">Deploy OTA Firmware Package</h2>
        <p className="text-xs text-slate-400 mb-5">Upload signed .bin binary file for STM32 Dual-Bank distribution</p>

        {!success ? (
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Firmware Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-cyan"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Microcontroller Family</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-cyan"
              >
                <option value="TEMP_SENSOR">STM32F401 Temperature Node</option>
                <option value="POWER_METER">STM32F407 Power Meter</option>
                <option value="RELAY_CTRL">STM32G4 Relay Actuator</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-brand-cyan/50 transition-colors">
              <UploadCloud className="w-8 h-8 text-brand-cyan mx-auto mb-2" />
              <p className="text-xs text-slate-300 font-medium">Click or drag binary file (.bin) here</p>
              <p className="text-[10px] text-slate-500 mt-1">Maximum file size: 512 KB (SHA-256 Autosigned)</p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition-all shadow-lg shadow-brand-cyan/20 flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <span>Signing & Processing...</span>
              ) : (
                <span>Upload & Initiate OTA</span>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-brand-emerald mx-auto animate-bounce" />
            <div>
              <h3 className="font-semibold text-slate-100">OTA Deployment Initiated</h3>
              <p className="text-xs text-slate-400 mt-1">Binary broadcast chunk stream started over serial/MQTT bridge</p>
            </div>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2 rounded-lg text-sm font-medium border border-slate-700"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

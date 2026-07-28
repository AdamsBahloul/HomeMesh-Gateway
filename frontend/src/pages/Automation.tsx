import React from 'react';
import { AutomationRuleEditor } from '../components/AutomationRuleEditor';
import { Zap, Trash2, CheckCircle2 } from 'lucide-react';

export const Automation: React.FC = () => {
  const rules = [
    {
      id: 1,
      name: "High Temperature Protection",
      trigger: "stm32-32f401a8 (Temperature)",
      condition: "> 30.0 °C",
      target: "stm32-32f403c0 (Relay 1)",
      action: "Turn Relay ON",
      enabled: true
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Automation & Edge Actuation Engine</h1>
        <p className="text-xs text-slate-400">Configure IF-THEN rules evaluated locally on the Embedded Linux Gateway</p>
      </div>

      <AutomationRuleEditor />

      <div className="glass-card rounded-xl border border-slate-800 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-100">Active Automation Rules</h2>
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">{rule.name}</h3>
                  <p className="text-slate-400 font-mono text-[11px] mt-0.5">
                    IF <span className="text-brand-cyan">{rule.trigger}</span> {rule.condition} THEN <span className="text-brand-emerald">{rule.action}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                  ACTIVE
                </span>
                <button className="text-slate-500 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

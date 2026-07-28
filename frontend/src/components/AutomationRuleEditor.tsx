import React, { useState } from 'react';
import { Zap, Plus, Check } from 'lucide-react';

export const AutomationRuleEditor: React.FC = () => {
  const [ruleName, setRuleName] = useState('');
  const [sensor, setSensor] = useState('temperature');
  const [operator, setOperator] = useState('>');
  const [threshold, setThreshold] = useState(30.0);
  const [actionCmd, setActionCmd] = useState('RELAY1_ON');

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Automation Rule "${ruleName}" Created Successfully!`);
    setRuleName('');
  };

  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800">
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-5 h-5 text-amber-400" />
        <h3 className="font-semibold text-sm text-slate-100">Create New IF-THEN Rule</h3>
      </div>

      <form onSubmit={handleAddRule} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-mono">Rule Label</label>
          <input
            type="text"
            placeholder="e.g. Overheat Fan Relay"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-brand-cyan focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1 font-mono">IF Sensor</label>
          <select
            value={sensor}
            onChange={(e) => setSensor(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-brand-cyan focus:outline-none"
          >
            <option value="temperature">Temperature (°C)</option>
            <option value="humidity">Humidity (%)</option>
            <option value="power_mw">Active Power (mW)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1 font-mono">Condition</label>
          <div className="flex space-x-2">
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-100 focus:border-brand-cyan focus:outline-none"
            >
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value="==">==</option>
            </select>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-brand-cyan focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1 font-mono">THEN Actuation</label>
          <select
            value={actionCmd}
            onChange={(e) => setActionCmd(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-brand-cyan focus:outline-none"
          >
            <option value="RELAY1_ON">Turn Relay 1 ON</option>
            <option value="RELAY1_OFF">Turn Relay 1 OFF</option>
            <option value="EMERGENCY_SHUTDOWN">Emergency Shutdown</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Save Rule</span>
        </button>
      </form>
    </div>
  );
};

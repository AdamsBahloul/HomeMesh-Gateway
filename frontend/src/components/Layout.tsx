import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  LineChart, 
  DownloadCloud, 
  Zap, 
  Terminal, 
  LogOut, 
  ShieldCheck,
  Radio
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/devices', label: 'STM32 Nodes', icon: Cpu },
    { path: '/analytics', label: 'Telemetry', icon: LineChart },
    { path: '/ota', label: 'OTA Updates', icon: DownloadCloud },
    { path: '/automation', label: 'Automation', icon: Zap },
    { path: '/logs', label: 'System Logs', icon: Terminal },
  ];

  const handleLogout = () => {
    localStorage.removeItem('smartbridge_token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-dark-900 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-800 border-r border-slate-800 flex flex-col justify-between p-4 z-20">
        <div>
          {/* Logo Header */}
          <div className="flex items-center space-x-3 px-3 py-4 mb-6 border-b border-slate-800/60">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center shadow-lg shadow-brand-cyan/20">
              <Radio className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wide bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                SmartBridge <span className="text-brand-cyan text-xs font-mono px-1 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20">OS</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">HomeMesh Gateway</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 shadow-sm shadow-brand-cyan/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
              <span className="text-slate-300 font-mono">RPi5-GW #01</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">ONLINE</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-dark-800/80 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
              <span>TLS 1.3 MQTTS Active</span>
              <span className="text-slate-600">|</span>
              <span className="text-brand-cyan">QoS 1</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-200">System Admin</p>
              <p className="text-[10px] text-slate-400 font-mono">admin@smartbridge.io</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-violet flex items-center justify-center font-bold text-xs text-white shadow-md">
              SA
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

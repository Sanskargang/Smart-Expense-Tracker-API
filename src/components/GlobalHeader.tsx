import React from 'react';
import { Download, Play, CheckCircle2, Terminal, Code2, Table, Sparkles } from 'lucide-react';
import { downloadProjectZip } from '../utils/zipExporter';

interface GlobalHeaderProps {
  activeTab: 'endpoints' | 'expenses' | 'code' | 'tests';
  onSelectTab: (tab: 'endpoints' | 'expenses' | 'code' | 'tests') => void;
  testsPassingCount: number;
  totalTests: number;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  activeTab,
  onSelectTab,
  testsPassingCount,
  totalTests,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 shrink-0 shadow-xs z-10">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-linear-to-tr from-indigo-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm border border-indigo-400/30">
          <div className="w-4 h-4 border-2 border-white transform rotate-45 rounded-xs"></div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">SmartExpense.API</h1>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              REST v1.0
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Node.js Clean Architecture • Local JSON Storage</p>
        </div>
      </div>

      {/* Centered Navigation Pills */}
      <nav className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
        <button
          onClick={() => onSelectTab('endpoints')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'endpoints'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>API Sandbox</span>
        </button>

        <button
          onClick={() => onSelectTab('expenses')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Expense Manager</span>
        </button>

        <button
          onClick={() => onSelectTab('code')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'code'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code & Docs</span>
        </button>

        <button
          onClick={() => onSelectTab('tests')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'tests'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Jest Suite</span>
        </button>
      </nav>

      {/* Right Side Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onSelectTab('tests')}
          className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
          title="Click to view Jest + Supertest test runner"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-semibold text-emerald-800 tracking-wide">
            Tests {testsPassingCount}/{totalTests}
          </span>
        </button>

        <button
          onClick={downloadProjectZip}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Zip</span>
        </button>
      </div>
    </header>
  );
};

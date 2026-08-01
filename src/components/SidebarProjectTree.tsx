import React from 'react';
import { PROJECT_FILES, ProjectFile } from '../data/projectFiles';
import { FileCode, FileText, CheckCircle2, FolderTree, Sparkles, Terminal, Table } from 'lucide-react';

interface SidebarProjectTreeProps {
  selectedFile: ProjectFile;
  onSelectFile: (file: ProjectFile) => void;
  activeTab: 'endpoints' | 'expenses' | 'code' | 'tests';
  onSelectTab: (tab: 'endpoints' | 'expenses' | 'code' | 'tests') => void;
}

export const SidebarProjectTree: React.FC<SidebarProjectTreeProps> = ({
  selectedFile,
  onSelectFile,
  activeTab,
  onSelectTab
}) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 shadow-md">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-2">
          <FolderTree className="w-4 h-4 text-indigo-400" />
          <span className="text-[11px] uppercase tracking-widest font-bold text-slate-300">
            Project Files
          </span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono font-semibold">
          13 Files
        </span>
      </div>

      {/* Quick Mode Switcher in Sidebar */}
      <div className="p-2.5 border-b border-slate-800/80 bg-slate-950/40 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => onSelectTab('endpoints')}
          className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'endpoints'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>API Sandbox</span>
        </button>
        <button
          onClick={() => onSelectTab('expenses')}
          className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Expenses</span>
        </button>
      </div>

      {/* File Tree List */}
      <div className="flex-1 p-3 font-mono text-xs overflow-y-auto space-y-1">
        <div className="text-indigo-400 font-bold px-2 py-1 flex items-center space-x-1.5">
          <span>expense-tracker/</span>
        </div>

        {/* Root Docs / Feature file highlight */}
        <div className="pl-3 space-y-0.5">
          <div className="text-slate-500 text-[10px] font-bold px-2 pt-1 pb-0.5 uppercase tracking-wider font-sans">
            Documentation & Features
          </div>
          {PROJECT_FILES.filter((f) => ['docs', 'config'].includes(f.category)).map((file) => {
            const isSelected = selectedFile.path === file.path && activeTab === 'code';
            const isFeatureTxt = file.name === 'feature.txt';
            return (
              <button
                key={file.path}
                onClick={() => {
                  onSelectFile(file);
                  onSelectTab('code');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : isFeatureTxt
                    ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-semibold border border-amber-500/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  {isFeatureTxt ? (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className="truncate">├── {file.name}</span>
                </div>
                {isFeatureTxt && (
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded uppercase font-sans font-bold">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Source Files */}
        <div className="pl-3 pt-2 space-y-0.5">
          <div className="text-slate-500 text-[10px] font-bold px-2 pt-1 pb-0.5 uppercase tracking-wider font-sans">
            src/ (REST API Code)
          </div>
          {PROJECT_FILES.filter((f) => ['source', 'routes', 'controllers', 'services', 'middleware', 'utils'].includes(f.category)).map((file) => {
            const isSelected = selectedFile.path === file.path && activeTab === 'code';
            const shortPath = file.path.replace('expense-tracker/src/', '├── ');
            return (
              <button
                key={file.path}
                onClick={() => {
                  onSelectFile(file);
                  onSelectTab('code');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{shortPath}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tests */}
        <div className="pl-3 pt-2 space-y-0.5">
          <div className="text-slate-500 text-[10px] font-bold px-2 pt-1 pb-0.5 uppercase tracking-wider font-sans">
            tests/ (Jest Suite)
          </div>
          {PROJECT_FILES.filter((f) => f.category === 'tests').map((file) => {
            const isSelected = selectedFile.path === file.path && activeTab === 'code';
            return (
              <button
                key={file.path}
                onClick={() => {
                  onSelectFile(file);
                  onSelectTab('code');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-emerald-400/90 hover:bg-slate-800/50 hover:text-emerald-300'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>├── {file.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Feature Note */}
      <div className="p-4 bg-slate-950 border-t border-slate-800/80">
        <div className="flex items-center space-x-1.5 text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3 h-3" />
          <span>FEATURE.TXT ADDED</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          All 10 required REST API features and storage specs are documented in <code className="text-amber-300 font-mono">feature.txt</code>.
        </p>
      </div>
    </aside>
  );
};

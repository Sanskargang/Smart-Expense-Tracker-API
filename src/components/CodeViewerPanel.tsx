import React from 'react';
import { ProjectFile } from '../data/projectFiles';
import { Copy, Check, FileCode, Download } from 'lucide-react';

interface CodeViewerPanelProps {
  file: ProjectFile;
}

export const CodeViewerPanel: React.FC<CodeViewerPanelProps> = ({ file }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      {/* Code Viewer Top Bar */}
      <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <FileCode className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-mono font-bold text-slate-800">{file.path}</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded">
            {file.language}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded transition-colors cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy File</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSingle}
            className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Description Banner */}
      <div className="px-6 py-2 bg-indigo-50/50 border-b border-indigo-100 text-xs text-indigo-900 flex items-center justify-between shrink-0">
        <span><strong>Architectural Purpose:</strong> {file.description}</span>
      </div>

      {/* Code Content Area */}
      <div className="flex-1 overflow-auto bg-slate-950 p-6 font-mono text-xs leading-relaxed text-slate-100">
        <pre className="whitespace-pre-wrap select-text">{file.content}</pre>
      </div>
    </div>
  );
};

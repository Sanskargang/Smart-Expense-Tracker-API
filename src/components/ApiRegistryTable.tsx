import React, { useState } from 'react';
import { apiEngine, ApiResponse } from '../utils/apiSandbox';
import { Play, Plus, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApiRegistryTableProps {
  onDataChange: () => void;
}

export const ApiRegistryTable: React.FC<ApiRegistryTableProps> = ({ onDataChange }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [responseLog, setResponseLog] = useState<ApiResponse | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [newTitle, setNewTitle] = useState('Uber Ride');
  const [newAmount, setNewAmount] = useState('35.50');
  const [newCategory, setNewCategory] = useState('Travel');
  const [newDate, setNewDate] = useState('2026-07-31');
  const [deleteId, setDeleteId] = useState('');

  const handleTestGetExpenses = () => {
    setSelectedEndpoint('GET /expenses');
    const res = apiEngine.getExpenses(categoryFilter);
    setResponseLog(res);
  };

  const handleTestGetSummary = () => {
    setSelectedEndpoint('GET /expenses/summary');
    const res = apiEngine.getSummary();
    setResponseLog(res);
  };

  const handleTestCreateExpense = () => {
    setSelectedEndpoint('POST /expenses');
    const amountNum = parseFloat(newAmount);
    const res = apiEngine.createExpense({
      title: newTitle,
      amount: isNaN(amountNum) ? (newAmount as any) : amountNum,
      category: newCategory,
      date: newDate,
    });
    setResponseLog(res);
    if (res.status === 201) {
      onDataChange();
    }
  };

  const handleTestDeleteExpense = () => {
    setSelectedEndpoint('DELETE /expenses/:id');
    const targetId = deleteId || apiEngine.getExpenses().data?.[0]?.id || '00000000-0000-0000-0000-000000000000';
    const res = apiEngine.deleteExpense(targetId);
    setResponseLog(res);
    if (res.status === 200) {
      onDataChange();
    }
  };

  return (
    <div className="flex-1 bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            REST Endpoint Registry & Sandbox
          </h2>
          <p className="text-xs text-slate-500">
            Live local Express server simulation backed by in-memory JSON storage
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[10px] text-slate-500 font-mono bg-slate-200/60 px-2 py-0.5 rounded">
            BASE_URL: /api/v1
          </span>
          <button
            onClick={() => {
              apiEngine.reset();
              onDataChange();
              setResponseLog({
                status: 200,
                statusText: '200 OK',
                data: { message: 'In-memory expenses.json reset to default seeds' },
              });
            }}
            className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 px-2.5 py-1 rounded hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Main Split: Registry Table & Live Request Tester */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left column: Endpoints table */}
        <div className="flex-1 overflow-y-auto border-r border-slate-200">
          <table className="w-full text-left">
            <thead className="bg-slate-50 sticky top-0 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Method</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Path</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Description</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* POST /expenses */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">
                    POST
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono font-bold text-slate-800">/expenses</td>
                <td className="px-6 py-4 text-xs text-slate-600">Create new expense record with UUIDv4</td>
                <td className="px-6 py-4 text-xs text-slate-500">201 Created</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={handleTestCreateExpense}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test POST</span>
                  </button>
                </td>
              </tr>

              {/* GET /expenses */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-[10px] font-bold rounded">
                    GET
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono font-bold text-slate-800">/expenses</td>
                <td className="px-6 py-4 text-xs text-slate-600">
                  Retrieve all with optional <code className="bg-slate-100 px-1 rounded text-slate-800">?category=Food</code> filter
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">200 OK</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={handleTestGetExpenses}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test GET</span>
                  </button>
                </td>
              </tr>

              {/* GET /expenses/summary */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-[10px] font-bold rounded">
                    GET
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono font-bold text-slate-800">/expenses/summary</td>
                <td className="px-6 py-4 text-xs text-slate-600">
                  Aggregated financial summary (overall + category breakdown)
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">200 OK</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={handleTestGetSummary}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test Summary</span>
                  </button>
                </td>
              </tr>

              {/* DELETE /expenses/:id */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded">
                    DELETE
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono font-bold text-slate-800">/expenses/:id</td>
                <td className="px-6 py-4 text-xs text-slate-600">Remove expense by UUIDv4 identifier</td>
                <td className="px-6 py-4 text-xs text-slate-500">200 OK</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={handleTestDeleteExpense}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test DELETE</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Quick Request Controls Section */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Interactive Request Parameter Controls
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Add Expense Controls */}
              <div className="bg-white p-4 border border-slate-200 rounded shadow-xs space-y-3">
                <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>POST /expenses Payload</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                    201 Created
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Title"
                    className="text-xs border border-slate-200 px-2 py-1 rounded font-sans"
                  />
                  <input
                    type="text"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="Amount"
                    className="text-xs border border-slate-200 px-2 py-1 rounded font-sans"
                  />
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Category"
                    className="text-xs border border-slate-200 px-2 py-1 rounded font-sans"
                  />
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="text-xs border border-slate-200 px-2 py-1 rounded font-mono"
                  />
                </div>
                <button
                  onClick={handleTestCreateExpense}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-1.5 rounded transition-colors flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Send POST Request</span>
                </button>
              </div>

              {/* Filter / Delete Controls */}
              <div className="bg-white p-4 border border-slate-200 rounded shadow-xs space-y-3">
                <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>GET Filter & DELETE ID</span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-mono">
                    Query / Param
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      placeholder="Filter category (e.g. Food)"
                      className="text-xs border border-slate-200 px-2 py-1 rounded flex-1 font-sans"
                    />
                    <button
                      onClick={handleTestGetExpenses}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1 rounded transition-colors"
                    >
                      Filter
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={deleteId}
                      onChange={(e) => setDeleteId(e.target.value)}
                      placeholder="Expense UUID (blank = delete 1st)"
                      className="text-xs border border-slate-200 px-2 py-1 rounded flex-1 font-mono"
                    />
                    <button
                      onClick={handleTestDeleteExpense}
                      className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Live Response Output Log */}
        <div className="w-96 bg-slate-900 text-slate-200 flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-950">
            <span className="text-xs font-mono font-bold text-slate-400">
              HTTP RESPONSE LOG
            </span>
            {selectedEndpoint && (
              <span className="text-[10px] font-mono bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700/50">
                {selectedEndpoint}
              </span>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
            {responseLog ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      responseLog.status >= 200 && responseLog.status < 300
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {responseLog.statusText}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Content-Type: application/json
                  </span>
                </div>

                <pre className="bg-slate-950 p-3 rounded border border-slate-800 overflow-x-auto text-emerald-400 leading-relaxed text-[11px]">
                  {JSON.stringify(responseLog.data || responseLog, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                <Play className="w-8 h-8 opacity-30" />
                <p className="text-xs font-sans">
                  Click any <strong className="text-slate-400">"Test"</strong> button in the table to execute an instant REST API call.
                </p>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Storage: <code className="text-slate-300 font-mono">expenses.json</code></span>
            <span>Atomic Writes: <span className="text-emerald-400">Active</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

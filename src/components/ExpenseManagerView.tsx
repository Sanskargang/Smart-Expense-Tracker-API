import React, { useState } from 'react';
import { apiEngine, SummaryResponse } from '../utils/apiSandbox';
import { Plus, Trash2, Filter, DollarSign, Calendar, Tag, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

interface ExpenseManagerViewProps {
  onDataChange: () => void;
  summary: SummaryResponse;
}

export const ExpenseManagerView: React.FC<ExpenseManagerViewProps> = ({ onDataChange, summary }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Food');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const expensesResponse = apiEngine.getExpenses(selectedCategory);
  const expensesList = expensesResponse.data || [];

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const amountNum = parseFloat(newAmount);
    const result = apiEngine.createExpense({
      title: newTitle,
      amount: amountNum,
      category: newCategory,
      date: newDate,
    });

    if (result.status === 201 && result.data) {
      setSuccessMessage(`Expense "${newTitle}" added successfully with ID ${result.data.id.slice(0, 8)}...`);
      setNewTitle('');
      setNewAmount('');
      onDataChange();
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      const errData = result.data as any;
      const errMsg = Array.isArray(errData?.errors)
        ? errData.errors.join(' | ')
        : errData?.error || 'Validation failed';
      setErrorMessage(errMsg);
    }
  };

  const handleDeleteExpense = (id: string, title: string) => {
    const result = apiEngine.deleteExpense(id);
    if (result.status === 200) {
      setSuccessMessage(`Deleted expense "${title}" (${id.slice(0, 8)}...)`);
      onDataChange();
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const categories = ['Food', 'Travel', 'Shopping', 'Utilities', 'Entertainment'];

  return (
    <div className="flex-1 bg-white border border-slate-200/80 rounded-xl shadow-xs flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Live Expense Manager & Visualizer
          </h2>
          <p className="text-xs text-slate-500">
            Real-time visual explorer for <code className="bg-slate-200/60 px-1.5 py-0.5 rounded font-mono text-slate-700">expenses.json</code> atomic storage
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              apiEngine.reset();
              onDataChange();
              setSuccessMessage('In-memory expenses.json reset to default records.');
              setTimeout(() => setSuccessMessage(null), 3000);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Default Data</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Add Expense Form & Quick Filter */}
        <div className="w-80 border-r border-slate-200/80 p-6 flex flex-col space-y-6 overflow-y-auto bg-slate-50/30">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center space-x-1.5">
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Add New Expense</span>
            </h3>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sushi Dinner, Flight Ticket"
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Date (ISO YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-mono"
                />
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-start space-x-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-medium">{successMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>POST /expenses (Add Record)</span>
              </button>
            </form>
          </div>

          {/* Category Totals Card */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Category Total Breakdown
            </h4>
            <div className="space-y-2">
              {Object.entries(summary.categoryTotals).map(([cat, amount]) => {
                const numAmount = Number(amount);
                const percentage = summary.totalExpenses > 0
                  ? Math.round((numAmount / summary.totalExpenses) * 100)
                  : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{cat}</span>
                      <span className="font-bold text-slate-900">
                        ${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Expenses Table & Category Filter */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Category Filter Chips Bar */}
          <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Filter by Category:</span>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === ''
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({apiEngine.getExpenses('').data?.length || 0})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-mono text-slate-500">
              Showing <strong className="text-slate-800">{expensesList.length}</strong> record(s)
            </span>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            {expensesList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <Filter className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">No Expenses Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    No records match the selected category filter or the table is currently empty.
                  </p>
                </div>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 sticky top-0 border-b border-slate-200/60">
                  <tr>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      UUID v4 (ID)
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expensesList.map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-900">
                        {expense.title}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs font-mono text-slate-600">
                        {expense.date}
                      </td>
                      <td className="px-6 py-3.5 text-xs font-mono text-slate-400">
                        {expense.id}
                      </td>
                      <td className="px-6 py-3.5 text-xs font-bold text-slate-900 text-right">
                        ${Number(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteExpense(expense.id, expense.title)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                          title="DELETE /expenses/:id"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

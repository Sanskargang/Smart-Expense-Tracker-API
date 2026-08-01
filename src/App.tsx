/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GlobalHeader } from './components/GlobalHeader';
import { SidebarProjectTree } from './components/SidebarProjectTree';
import { MetricTiles } from './components/MetricTiles';
import { ApiRegistryTable } from './components/ApiRegistryTable';
import { ExpenseManagerView } from './components/ExpenseManagerView';
import { CodeViewerPanel } from './components/CodeViewerPanel';
import { JestTestRunner } from './components/JestTestRunner';
import { FooterSignature } from './components/FooterSignature';
import { PROJECT_FILES, ProjectFile } from './data/projectFiles';
import { apiEngine, SummaryResponse } from './utils/apiSandbox';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(
    PROJECT_FILES.find((f) => f.name === 'feature.txt') || PROJECT_FILES[0]
  );
  const [activeTab, setActiveTab] = useState<'endpoints' | 'expenses' | 'code' | 'tests'>('endpoints');
  const [summary, setSummary] = useState<SummaryResponse>({
    totalExpenses: 2500,
    categoryTotals: {
      Food: 800,
      Travel: 700,
      Shopping: 1000,
    },
  });

  const refreshSummary = () => {
    const res = apiEngine.getSummary();
    if (res.data) {
      setSummary(res.data);
    }
  };

  useEffect(() => {
    refreshSummary();
  }, []);

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Global Header with Navigation Tabs */}
      <GlobalHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        testsPassingCount={9}
        totalTests={9}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Project Structure */}
        <SidebarProjectTree
          selectedFile={selectedFile}
          onSelectFile={(file) => {
            setSelectedFile(file);
            setActiveTab('code');
          }}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Metric Tiles: API Summary */}
          <MetricTiles summary={summary} />

          {/* Active View: API Sandbox / Expense Manager / Code Viewer / Jest Runner */}
          {activeTab === 'endpoints' && (
            <ApiRegistryTable onDataChange={refreshSummary} />
          )}

          {activeTab === 'expenses' && (
            <ExpenseManagerView onDataChange={refreshSummary} summary={summary} />
          )}

          {activeTab === 'code' && (
            <CodeViewerPanel file={selectedFile} />
          )}

          {activeTab === 'tests' && (
            <JestTestRunner />
          )}

          {/* Footer: Code Signature */}
          <FooterSignature />
        </main>
      </div>
    </div>
  );
}


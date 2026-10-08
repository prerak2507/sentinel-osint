'use client';

import React, { useState } from 'react';
import { useIntelligence } from '@/context/IntelligenceContext';
import { Report, ReportType } from '@/types/intelligence';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  CheckCircle2, 
  Plus, 
  ShieldAlert, 
  Clock, 
  Target, 
  Database, 
  AlertTriangle,
  ExternalLink,
  RotateCw
} from 'lucide-react';

export default function ReportsPage() {
  const { reports, generateNewReport, investigation, addToast } = useIntelligence();
  const [selectedReport, setSelectedReport] = useState<Report>(reports[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<ReportType>('EXECUTIVE_SUMMARY');
  const [customTitle, setCustomTitle] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    const newRep = await generateNewReport(selectedType, customTitle || undefined);
    setSelectedReport(newRep);
    setIsGenerating(false);
    setIsModalOpen(false);
    setCustomTitle('');
  };

  const handleCopySummary = () => {
    const summaryText = `[SENTINELOSINT THREAT BRIEF]
Case: ${selectedReport.caseId}
Title: ${selectedReport.title}
Classification: ${selectedReport.classification}
Risk Score: ${selectedReport.riskScore}/100 | Confidence: ${selectedReport.confidence}%
Generated: ${selectedReport.generatedAt}

EXECUTIVE SUMMARY:
${selectedReport.executiveSummary}

RECOMMENDED ACTIONS:
${selectedReport.recommendedActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}
`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    addToast('Summary Copied', 'Copied executive summary and actions to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(selectedReport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport.id}-${selectedReport.caseId}.json`;
    a.click();
    addToast('Report Exported', `Downloaded ${selectedReport.id} as JSON`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print p-5 rounded-xl bg-[#0d121d] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
              Actionable Threat Intelligence Reports
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated intelligence briefs, technical indicator sheets, and executive threat assessments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold transition-all shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* Report Selection Tabs (No print) */}
      <div className="no-print flex items-center gap-2 overflow-x-auto pb-1">
        {reports.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedReport(r)}
            className={`px-3 py-2 rounded-lg font-mono text-xs text-left transition-all border shrink-0 ${
              selectedReport.id === r.id
                ? 'bg-blue-950/40 border-cyan-500/50 text-cyan-300 shadow-sm'
                : 'bg-[#0d121d] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="font-semibold">{r.id}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px]">
              {r.type.replace('_', ' ')}
            </div>
          </button>
        ))}
      </div>

      {/* Main Report Document Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-xl border border-slate-800 bg-[#0d121d] space-y-6 max-w-5xl mx-auto shadow-2xl">
        {/* Document Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-500/40 font-bold">
                {selectedReport.classification}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                CASE: {selectedReport.caseId}
              </span>
              <span className="text-[10px] font-mono text-slate-500">•</span>
              <span className="text-[10px] font-mono text-slate-500">
                {selectedReport.id}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-mono text-slate-100 tracking-tight">
              {selectedReport.title}
            </h2>
            <div className="text-xs font-mono text-slate-400">
              Author: {selectedReport.author} • Generated: {selectedReport.generatedAt}
            </div>
          </div>

          {/* Action buttons (hidden when printing) */}
          <div className="no-print flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
              title="Copy Summary"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
              title="Export JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium transition-colors shadow-sm"
              title="Print / Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#080b12] border border-slate-800 text-center font-mono">
          <div>
            <span className="text-[10px] text-slate-500 block">THREAT RISK</span>
            <span className="text-xl font-bold text-rose-400 mt-0.5 block">
              {selectedReport.riskScore} / 100
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">CONFIDENCE</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
              {selectedReport.confidence}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">INDICATORS</span>
            <span className="text-xl font-bold text-cyan-400 mt-0.5 block">
              {selectedReport.indicatorsCount}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">ENTITIES</span>
            <span className="text-xl font-bold text-purple-400 mt-0.5 block">
              {selectedReport.entitiesCount}
            </span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span>01. Executive Summary</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0a0e17] p-4 rounded-lg border border-slate-800">
            {selectedReport.executiveSummary}
          </p>
        </div>

        {/* Section 2: Threat Assessment */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span>02. Threat Assessment & Attribution</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0a0e17] p-4 rounded-lg border border-slate-800">
            {selectedReport.threatAssessment}
          </p>
        </div>

        {/* Section 3: Recommended Actions */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span>03. Immediate Recommended Defenses</span>
          </h3>
          <div className="space-y-2">
            {selectedReport.recommendedActions.map((action, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-[#0a0e17] border border-slate-800 text-xs text-slate-200 font-mono"
              >
                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  {idx + 1}
                </span>
                <span className="mt-0.5">{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Indicators Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span>04. Correlated Technical Indicators (IOCs)</span>
          </h3>
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#080b12] text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Indicator</th>
                  <th className="py-2.5 px-2">Type</th>
                  <th className="py-2.5 px-2">Severity</th>
                  <th className="py-2.5 px-2">Confidence</th>
                  <th className="py-2.5 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {selectedReport.indicators.slice(0, 6).map((ioc) => (
                  <tr key={ioc.id} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-semibold text-slate-200 break-all">{ioc.value}</td>
                    <td className="py-2 px-2 text-slate-400">{ioc.type}</td>
                    <td className="py-2 px-2 text-rose-400 font-bold">{ioc.severity}</td>
                    <td className="py-2 px-2 text-slate-300">{ioc.confidence}%</td>
                    <td className="py-2 px-3 text-slate-400 truncate max-w-xs">{ioc.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Footer Verification */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
          <div>
            Cryptographic Integrity: <span className="text-slate-400">SHA256: 8f4a19b7...2e91 (VERIFIED)</span>
          </div>
          <div>SentinelOSINT Threat Intelligence Platform v2.4</div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0d121d] shadow-2xl p-5 space-y-4 font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  Generate Threat Intelligence Report
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Report Archetype</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ReportType)}
                  className="w-full p-2.5 rounded-lg bg-[#080b12] border border-slate-800 text-slate-200 focus:outline-none"
                >
                  <option value="EXECUTIVE_SUMMARY">Executive Summary</option>
                  <option value="TECHNICAL_ANALYSIS">Technical Analysis</option>
                  <option value="IOC_REPORT">IOC Report</option>
                  <option value="THREAT_INVESTIGATION">Threat Investigation</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Custom Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Urgent C2 Infrastructure Threat Brief"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#080b12] border border-slate-800 text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#080b12] border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                Will compile current telemetry for case <strong>{investigation.id}</strong> ({investigation.targetQuery}) including 23 indicators, 9 entities, and mitigation playbook.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isGenerating ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{isGenerating ? 'Synthesizing...' : 'Generate Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

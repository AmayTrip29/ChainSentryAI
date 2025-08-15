import React from 'react';
import { AuditReport, Severity } from '../types';
import FindingCard from './FindingCard';

interface AuditReportDisplayProps {
    report: AuditReport;
    onExport: () => void;
}

const severityOrder: Severity[] = ['Critical', 'High', 'Medium', 'Low', 'Informational'];

const SeverityBadge: React.FC<{ severity: keyof AuditReport['summary'], count: number }> = ({ severity, count }) => {
    const colors = {
        critical: 'bg-red-500/20 text-red-300 border-red-500/50',
        high: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
        medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        low: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
        informational: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
    };
    
    return (
        <div className={`flex flex-col items-center justify-center p-4 rounded-lg border ${colors[severity]} text-center`}>
            <span className="text-3xl font-bold">{count}</span>
            <span className="text-sm font-medium uppercase tracking-wider">{severity}</span>
        </div>
    );
};

const AuditReportDisplay: React.FC<AuditReportDisplayProps> = ({ report, onExport }) => {
    const sortedFindings = [...report.findings].sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity));

    return (
        <div className="bg-gray-800/50 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4 md:mb-0">Audit Report</h2>
                <button
                    onClick={onExport}
                    className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Export as PDF
                </button>
            </div>
            
            <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-200">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <SeverityBadge severity="critical" count={report.summary.critical} />
                    <SeverityBadge severity="high" count={report.summary.high} />
                    <SeverityBadge severity="medium" count={report.summary.medium} />
                    <SeverityBadge severity="low" count={report.summary.low} />
                    <SeverityBadge severity="informational" count={report.summary.informational} />
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-200">Findings ({report.summary.total})</h3>
                {sortedFindings.length > 0 ? (
                    <div className="space-y-4">
                        {sortedFindings.map((finding, index) => (
                            <FindingCard key={index} finding={finding} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-900/50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h4 className="mt-4 text-lg font-medium text-gray-200">No Vulnerabilities Found</h4>
                        <p className="mt-1 text-gray-400">The AI auditor did not find any security issues in the provided contract.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditReportDisplay;
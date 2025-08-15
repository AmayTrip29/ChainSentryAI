import React, { useState, useCallback, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { Blockchain, AuditReport, AuditFinding } from './types';
import { auditContract } from './services/geminiService';

import Header from './components/Header';
import AuditForm from './components/AuditForm';
import AuditReportDisplay from './components/AuditReportDisplay';
import Loader from './components/Loader';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [report, setReport] = useState<AuditReport | null>(null);
    const reportRef = useRef<HTMLDivElement>(null);

    const handleAudit = useCallback(async (code: string, blockchain: Blockchain) => {
        if (!code.trim()) {
            setError("Contract code cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setReport(null);

        try {
            const findings = await auditContract(code, blockchain);
            const summary = findings.reduce((acc, finding) => {
                acc[finding.severity.toLowerCase() as keyof typeof acc]++;
                acc.total++;
                return acc;
            }, { critical: 0, high: 0, medium: 0, low: 0, informational: 0, total: 0 });

            setReport({ findings, summary });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred during the audit.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleExportPDF = useCallback(() => {
        if (reportRef.current) {
            html2canvas(reportRef.current, {
                backgroundColor: '#111827', // Match the dark background
                scale: 2, // Increase resolution
            }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;
                const height = pdfWidth / ratio;
                
                // Check if content exceeds one page
                if (height > pdfHeight) {
                    console.warn("Report is too long for a single PDF page. Export may be truncated.");
                }

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, height);
                pdf.save(`ChainSentryAI-Audit-Report-${new Date().toISOString().split('T')[0]}.pdf`);
            });
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 font-sans text-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <p className="text-center text-lg text-gray-300 mb-8">
                        Harnessing advanced AI to provide a deep security analysis of your smart contracts.
                    </p>
                    <AuditForm onAudit={handleAudit} isLoading={isLoading} />

                    {error && (
                        <div className="mt-8 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg animate-fade-in" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {isLoading && <Loader />}
                    
                    {report && !isLoading && (
                        <div ref={reportRef} className="mt-12 animate-fade-in">
                            <AuditReportDisplay report={report} onExport={handleExportPDF} />
                        </div>
                    )}
                </div>
            </main>
            <footer className="text-center py-6 text-gray-600">
                <p>
                    Built by <a href="https://github.com/AmayTrip29" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">Amay Tripathi</a>
                </p>
            </footer>
        </div>
    );
};

export default App;
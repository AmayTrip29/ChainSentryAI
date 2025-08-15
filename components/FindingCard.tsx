
import React, { useState } from 'react';
import { AuditFinding, Severity } from '../types';
import CodeBlock from './CodeBlock';

interface FindingCardProps {
    finding: AuditFinding;
}

const getSeverityStyles = (severity: Severity): string => {
    switch (severity) {
        case 'Critical': return 'bg-red-500/20 text-red-300 border-red-500/50';
        case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
        case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
        case 'Low': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
        case 'Informational': return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        default: return 'bg-gray-600 text-gray-200';
    }
};

const FindingCard: React.FC<FindingCardProps> = ({ finding }) => {
    const [isOpen, setIsOpen] = useState(false);
    const severityStyles = getSeverityStyles(finding.severity);

    return (
        <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${severityStyles} ${isOpen ? 'bg-opacity-30' : ''}`}>
            <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${severityStyles}`}>
                        {finding.severity}
                    </span>
                    <h4 className="ml-4 font-semibold text-gray-100">{finding.vulnerability}</h4>
                </div>
                <div className="flex items-center">
                    {finding.location.lines !== 'N/A' && (
                         <span className="text-sm text-gray-400 mr-4 hidden sm:inline">Lines: {finding.location.lines}</span>
                    )}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="px-4 pb-5 pt-2 border-t border-gray-700/50 animate-fade-in">
                    <div className="space-y-6 text-gray-300">
                        <div>
                            <h5 className="font-semibold text-gray-200 mb-1">Description</h5>
                            <p className="text-sm leading-relaxed">{finding.description}</p>
                        </div>
                        <div>
                            <h5 className="font-semibold text-gray-200 mb-1">Impact</h5>
                            <p className="text-sm leading-relaxed">{finding.impact}</p>
                        </div>
                         <div>
                            <h5 className="font-semibold text-gray-200 mb-1">Recommendation</h5>
                            <p className="text-sm leading-relaxed">{finding.recommendation}</p>
                        </div>
                        <div>
                            <h5 className="font-semibold text-gray-200 mb-2">Suggested Fix</h5>
                            <CodeBlock code={finding.codeFix} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindingCard;

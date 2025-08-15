
import React, { useState } from 'react';
import { Blockchain } from '../types';

interface AuditFormProps {
    onAudit: (code: string, blockchain: Blockchain) => void;
    isLoading: boolean;
}

const AuditForm: React.FC<AuditFormProps> = ({ onAudit, isLoading }) => {
    const [code, setCode] = useState('');
    const [blockchain, setBlockchain] = useState<Blockchain>(Blockchain.Ethereum);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAudit(code, blockchain);
    };

    return (
        <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700">
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="blockchain-select" className="block text-sm font-medium text-gray-300 mb-2">
                        Select Blockchain
                    </label>
                    <select
                        id="blockchain-select"
                        value={blockchain}
                        onChange={(e) => setBlockchain(e.target.value as Blockchain)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                        disabled={isLoading}
                    >
                        <option value={Blockchain.Ethereum}>{Blockchain.Ethereum}</option>
                        <option value={Blockchain.Solana}>{Blockchain.Solana}</option>
                    </select>
                </div>
                
                <div className="mb-6">
                    <label htmlFor="code-input" className="block text-sm font-medium text-gray-300 mb-2">
                        Paste Smart Contract Code
                    </label>
                    <textarea
                        id="code-input"
                        rows={15}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-gray-200 font-mono text-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition placeholder-gray-500"
                        placeholder={blockchain === Blockchain.Ethereum ? `pragma solidity ^0.8.0;\n\ncontract MyContract {\n    // ...\n}` : `use anchor_lang::prelude::*;\n\ndeclare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");\n\n#[program]\npub mod my_program { ... }`}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading || !code.trim()}
                        className="w-full md:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-primary"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Auditing...
                            </>
                        ) : (
                            'Run Full Audit'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AuditForm;

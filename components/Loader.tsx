import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Initializing AI core...",
    "Analyzing contract structure...",
    "Cross-referencing vulnerability databases...",
    "Simulating attack vectors...",
    "Performing semantic code analysis...",
    "Finalizing report...",
];

const Loader: React.FC = () => {
    const [message, setMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % loadingMessages.length;
            setMessage(loadingMessages[currentIndex]);
        }, 2500); // Change message every 2.5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-8 text-center animate-fade-in" aria-label="Auditing in progress">
            <div className="flex justify-center items-center mb-4">
                <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <p className="text-lg font-semibold text-gray-200">Audit in Progress</p>
            <p className="text-gray-400 mt-1 transition-opacity duration-500">{message}</p>
        </div>
    );
};

export default Loader;
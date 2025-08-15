
import React from 'react';

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  // A simple heuristic to detect if the code is just a comment or a placeholder
  const isMeaningfulCode = code.trim().length > 0 && !code.toLowerCase().includes("no code fix needed");

  if (!isMeaningfulCode) {
    return <p className="text-sm text-gray-400 italic">No specific code change required. Follow the recommendation for best practices.</p>;
  }

  // Basic markdown-to-html for code blocks
  const formattedCode = code.replace(/```(?:\w*\n)?([\s\S]*?)```/g, '$1').trim();

  return (
    <div className="bg-gray-900 rounded-md p-4 overflow-x-auto border border-gray-700">
      <pre className="text-sm text-gray-200 font-mono">
        <code>{formattedCode}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;

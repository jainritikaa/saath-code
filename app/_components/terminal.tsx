import React, { useState } from 'react';

interface TerminalProps {
  output: string;
  readMeContent: string; // Add the readMeContent prop
}

const Terminal: React.FC<TerminalProps> = ({ output, readMeContent }) => {
  const [activeTab, setActiveTab] = useState<string>('Terminal');

  console.log('Rendering Terminal component');
  console.log('Terminal output:', output);
  console.log('ReadMe content:', readMeContent);

  return (
    <div className="w-full mt-2">
      <div className="flex border-b">
        <button
          className={`px-4 py-2 -mb-px font-semibold text-gray-800 border-b-2 ${
            activeTab === 'Terminal' ? 'border-blue-500' : ''
          }`}
          onClick={() => setActiveTab('Terminal')}
        >
          Terminal
        </button>
        <button
          className={`px-4 py-2 -mb-px font-semibold text-gray-800 border-b-2 ${
            activeTab === 'ReadMe' ? 'border-blue-500' : ''
          }`}
          onClick={() => setActiveTab('ReadMe')}
        >
          ReadMe
        </button>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg">
        {activeTab === 'Terminal' ? (
          <pre className="text-xs whitespace-pre-wrap">{output}</pre>
        ) : (
          <pre className="text-xs whitespace-pre-wrap">{readMeContent}</pre>
        )}
      </div>
    </div>
  );
};

export default Terminal;

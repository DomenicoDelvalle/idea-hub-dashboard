import React from 'react';

interface JsonViewerProps {
  data: object;
  className?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, className = '' }) => {
  return (
    <pre className={`bg-slate-900 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto border border-slate-700 ${className}`}>
      <code>
        {JSON.stringify(data, null, 2)}
      </code>
    </pre>
  );
};

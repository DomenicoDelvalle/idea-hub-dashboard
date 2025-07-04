import React, { useEffect, useRef } from 'react';

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
}

// Ensure window.marked is available.
declare global {
  interface Window {
    marked: any;
  }
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown, className = '' }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && window.marked) {
      const sanitizedHtml = window.marked.parse(markdown);
      contentRef.current.innerHTML = sanitizedHtml;
    }
  }, [markdown]);

  return (
    <div
      ref={contentRef}
      className={`prose prose-invert prose-sm md:prose-base max-w-none prose-headings:text-white prose-a:text-sky-400 prose-strong:text-slate-200 prose-blockquote:border-l-slate-600 prose-code:text-amber-400 prose-code:bg-slate-800 prose-code:p-1 prose-code:rounded prose-ul:list-disc prose-ol:list-decimal ${className}`}
    >
        {/* Content will be rendered here */}
    </div>
  );
};

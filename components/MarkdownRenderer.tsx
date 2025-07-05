import React, { useEffect, useRef } from "react";

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

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdown,
  className = "",
}) => {
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
      className={`markdown-content prose prose-invert prose-sm md:prose-base lg:prose-lg max-w-none 
      prose-headings:text-white prose-headings:break-words
      prose-a:text-sky-400 prose-a:break-all
      prose-strong:text-slate-200 
      prose-blockquote:border-l-slate-600 
      prose-code:text-amber-400 prose-code:bg-slate-800 prose-code:p-1 prose-code:rounded prose-code:text-xs prose-code:md:text-sm prose-code:break-all
      prose-pre:bg-slate-800 prose-pre:overflow-x-auto prose-pre:text-xs prose-pre:md:text-sm
      prose-table:text-xs prose-table:md:text-sm prose-table:overflow-x-auto prose-table:block prose-table:md:table
      prose-ul:list-disc prose-ol:list-decimal
      prose-p:break-words prose-li:break-words
      ${className}`}
    >
      {/* Content will be rendered here */}
    </div>
  );
};

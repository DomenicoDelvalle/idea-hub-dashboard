import React, { useMemo } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ColumnarMarkdownReportProps {
  markdown: string;
}

interface Section {
  title: string;
  content: string;
}

const getCleanMarkdown = (markdown: string): string => {
    if (!markdown || typeof markdown !== 'string') return '';
    try {
        const parsed = JSON.parse(markdown);
        if (typeof parsed === 'object' && parsed !== null) {
            if ('report_markdown' in parsed && typeof parsed.report_markdown === 'string') {
                return parsed.report_markdown;
            }
            if ('briefing_markdown' in parsed && typeof parsed.briefing_markdown === 'string') {
                return parsed.briefing_markdown;
            }
            if ('design_brief_markdown' in parsed && typeof parsed.design_brief_markdown === 'string') {
                return parsed.design_brief_markdown;
            }
        }
    } catch (e) {
        // Not JSON, return original string
        return markdown;
    }
    // Valid JSON but no expected keys, return original string
    return markdown;
}


export const ColumnarMarkdownReport: React.FC<ColumnarMarkdownReportProps> = ({ markdown }) => {
  const cleanedMarkdown = useMemo(() => getCleanMarkdown(markdown), [markdown]);

  const { intro, sections } = useMemo(() => {
    const lines = cleanedMarkdown.split('\n');
    const parsedSections: Section[] = [];
    let currentSection: Section | null = null;
    let introContent = '';
    
    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentSection) {
          parsedSections.push({ ...currentSection, content: currentSection.content.trim() });
        }
        currentSection = { title: line.replace('## ', '').trim(), content: '' };
      } else {
          if (currentSection) {
            currentSection.content += line + '\n';
          } else {
            introContent += line + '\n';
          }
      }
    }

    if (currentSection) {
      parsedSections.push({ ...currentSection, content: currentSection.content.trim() });
    }
    
    return { intro: introContent.trim(), sections: parsedSections };
  }, [cleanedMarkdown]);

  if (sections.length === 0) {
    return <MarkdownRenderer markdown={cleanedMarkdown} />;
  }
  
  return (
    <div className="space-y-6">
        {intro && <div className="mb-6"><MarkdownRenderer markdown={intro} /></div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
                <div key={section.title} className="p-4 bg-slate-900 rounded-lg border border-slate-800 flex flex-col">
                    <h4 className="font-bold text-lg text-sky-300 mb-3">{section.title}</h4>
                    <div className="flex-1">
                        <MarkdownRenderer markdown={section.content} />
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

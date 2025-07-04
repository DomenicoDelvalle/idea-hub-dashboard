import React, { useState, useMemo } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface TabbedMarkdownReportProps {
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


export const TabbedMarkdownReport: React.FC<TabbedMarkdownReportProps> = ({ markdown }) => {
  const cleanedMarkdown = useMemo(() => getCleanMarkdown(markdown), [markdown]);

  const sections = useMemo(() => {
    const lines = cleanedMarkdown.split('\n');
    const parsedSections: Section[] = [];
    let currentSection: Section | null = null;
    let introContent = '';
    let hasSections = false;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        hasSections = true;
        if (currentSection) {
          parsedSections.push({ ...currentSection, content: currentSection.content.trim() });
        } else if (introContent.trim()) {
            const introTitleMatch = introContent.match(/^# (.*)/);
            if (introTitleMatch) {
                parsedSections.push({ title: introTitleMatch[1].trim(), content: introContent.replace(/^# .*\n/, '').trim()});
            } else {
                parsedSections.push({ title: 'Overview', content: introContent.trim() });
            }
        }
        currentSection = { title: line.replace('## ', '').trim(), content: '' };
        introContent = ''; // clear intro once a section is found
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
    
    // If no ## sections were found, don't create tabs.
    return hasSections ? parsedSections : [];
  }, [cleanedMarkdown]);

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  if (sections.length <= 1) { // If there's 0 or 1 section, no need for tabs
    return <MarkdownRenderer markdown={cleanedMarkdown} />;
  }

  return (
    <div>
      <div className="border-b border-slate-700 mb-4">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
          {sections.map((section, index) => (
            <button
              key={section.title}
              onClick={() => setActiveTabIndex(index)}
              className={`${
                index === activeTabIndex
                  ? 'border-sky-400 text-sky-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>
      <div>
        <MarkdownRenderer
          key={activeTabIndex}
          markdown={sections[activeTabIndex].content}
        />
      </div>
    </div>
  );
};

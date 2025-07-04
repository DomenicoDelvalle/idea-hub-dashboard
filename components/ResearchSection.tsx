import React from 'react';
import type { ResearchData, Competitor, TargetPersona } from '../types';
import { Card } from './Card';
import { ResearchIcon, UserIcon, CalendarIcon, LocationMarkerIcon, BriefcaseIcon, AcademicCapIcon, TargetIcon, HeartIcon, SparklesIcon, LightningBoltIcon, LightbulbIcon, TagIcon } from './icons';
import { MarkdownRenderer } from './MarkdownRenderer';
import { TabbedMarkdownReport } from './TabbedMarkdownReport';
import { ColumnarMarkdownReport } from './ColumnarMarkdownReport';

interface ResearchSectionProps {
  data: ResearchData | null;
}

const ConceptDisplay: React.FC<{ concept: Record<string, any> }> = ({ concept }) => (
    <div className="space-y-6">
      {concept.suggested_name && (
        <div>
          <p className="text-sm font-semibold text-slate-400 mb-1">Suggested Name</p>
          <p className="text-2xl font-bold text-sky-300">{concept.suggested_name}</p>
        </div>
      )}

      {concept.unique_value_proposition && (
        <div>
          <p className="text-sm font-semibold text-slate-400 mb-2">Unique Value Proposition</p>
          <blockquote className="border-l-4 border-sky-500 pl-4 italic text-slate-300 bg-slate-900 p-3 rounded-r-lg">
            {concept.unique_value_proposition}
          </blockquote>
        </div>
      )}
      
      {concept.core_features && Array.isArray(concept.core_features) && concept.core_features.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-400 mb-2">Core Features</p>
          <ul className="space-y-2">
            {concept.core_features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
        {concept.main_target_public && (
          <div>
            <p className="text-sm font-semibold text-slate-400 mb-1">Main Target Public</p>
            <p className="text-slate-300">{concept.main_target_public}</p>
          </div>
        )}

        {concept.suggested_visual_style && (
          <div>
            <p className="text-sm font-semibold text-slate-400 mb-1">Suggested Visual Style</p>
            <p className="text-slate-300">{concept.suggested_visual_style}</p>
          </div>
        )}
        
        {concept.suggested_monetization_model && (
          <div className="md:col-span-2 mt-2">
            <p className="text-sm font-semibold text-slate-400 mb-1">Suggested Monetization Model</p>
            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {concept.suggested_monetization_model}
            </span>
          </div>
        )}
      </div>
    </div>
);

const CompetitorCard: React.FC<{ competitor: Competitor }> = ({ competitor: c }) => (
  <div key={c.id} className="p-4 bg-slate-900 rounded-lg border border-slate-800 transition-all hover:border-slate-700/80">
    <div className="flex justify-between items-start mb-4">
      <div>
         <h4 className="font-bold text-sky-300 text-lg">{c.competitor_name}</h4>
         {c.app_store_url && <a href={c.app_store_url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-sky-400 hover:underline">App Store Link</a>}
      </div>
      <span className="flex-shrink-0 ml-4 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
        {c.monetization_model}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <div>
        <h5 className="font-semibold text-slate-200 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Strengths
        </h5>
        {Array.isArray(c.strengths) && c.strengths.length > 0 ? (
          <ul className="space-y-1.5 text-slate-400">
            {c.strengths.map((strength, i) => (
              <li key={i} className="flex items-start">
                  <span className="text-green-500/80 mr-2 mt-1 flex-shrink-0 text-xs">&#x25CF;</span>
                  <span>{String(strength)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 italic">No strengths listed.</p>
        )}
      </div>
      <div>
        <h5 className="font-semibold text-slate-200 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          Weaknesses
        </h5>
        {Array.isArray(c.weaknesses) && c.weaknesses.length > 0 ? (
           <ul className="space-y-1.5 text-slate-400">
            {c.weaknesses.map((weakness, i) => (
              <li key={i} className="flex items-start">
                  <span className="text-red-500/80 mr-2 mt-1 flex-shrink-0 text-xs">&#x25CF;</span>
                  <span>{String(weakness)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 italic">No weaknesses listed.</p>
        )}
      </div>
    </div>
     {c.user_review_summary && (
        <div className="mt-4 pt-3 border-t border-slate-800">
             <h5 className="font-semibold text-slate-300 mb-1 text-sm">User Review Summary</h5>
             <blockquote className="text-sm text-slate-400 italic border-l-2 border-slate-700 pl-3">"{c.user_review_summary}"</blockquote>
        </div>
     )}
  </div>
);

const PsychographicTags: React.FC<{ title: string; items: any; icon: React.ReactNode; color: string }> = ({ title, items, icon, color }) => {
    if (!items || (Array.isArray(items) && items.length === 0)) return null;
    const itemList = Array.isArray(items) ? items : [items];
    
    return (
        <div>
            <h5 className="font-semibold text-slate-300 mb-2">{title}</h5>
            <div className="flex flex-wrap gap-2">
                {itemList.map((item, index) => (
                    <span key={index} className={`flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>
                        {icon}
                        <span className="ml-1.5">{String(item)}</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

const PersonaCard: React.FC<{ persona: TargetPersona }> = ({ persona: p }) => {
    const demographics = p.demographics || {};
    const psychographics = p.psychographics || {};

    const demoItems = [
        { icon: <CalendarIcon className="text-slate-400" />, value: demographics.age || demographics.primary_age_range },
        { icon: <LocationMarkerIcon className="text-slate-400" />, value: demographics.location || demographics.geographic_location },
        { icon: <BriefcaseIcon className="text-slate-400" />, value: demographics.occupation },
        { icon: <AcademicCapIcon className="text-slate-400" />, value: demographics.education_level },
    ].filter(item => item.value);

    return (
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-5 transition-all hover:border-slate-700/80">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-sky-900/50 flex items-center justify-center mr-4 flex-shrink-0">
                    <UserIcon className="text-sky-400 h-7 w-7" />
                </div>
                <h4 className="font-bold text-sky-300 text-xl">{p.persona_name}</h4>
            </div>

            {p.day_in_the_life_narrative && (
                 <blockquote className="text-slate-400 my-4 text-sm border-l-2 border-slate-700 pl-4 py-1">
                    {p.day_in_the_life_narrative}
                </blockquote>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                    <h5 className="font-semibold text-slate-300 mb-3">Demographics</h5>
                    <ul className="space-y-2.5 text-slate-300 text-sm">
                        {demoItems.map((item, i) => (
                            <li key={i} className="flex items-center">
                                <span className="mr-3">{item.icon}</span>
                                <span>{item.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-4">
                     <PsychographicTags title="Goals" items={psychographics.goals} icon={<TargetIcon />} color="bg-green-500/10 text-green-300" />
                     <PsychographicTags title="Values" items={psychographics.values} icon={<HeartIcon />} color="bg-purple-500/10 text-purple-300" />
                     <PsychographicTags title="Interests" items={psychographics.interests} icon={<SparklesIcon />} color="bg-yellow-500/10 text-yellow-300" />
                     <PsychographicTags title="Challenges" items={psychographics.challenges} icon={<LightningBoltIcon />} color="bg-red-500/10 text-red-300" />
                </div>
            </div>
        </div>
    );
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ data }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-3">
        <ResearchIcon />
        <span>Research</span>
      </h2>
      {!data ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-lg text-slate-500">
          <p>Sin datos de research disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.unifiedProductBriefing && (
            <Card title="Unified Product Briefing" className="lg:col-span-2">
              <div className="space-y-6">
                  <MarkdownRenderer markdown={data.unifiedProductBriefing.executive_summary_markdown} />
                  
                  <div className="my-6 border-t border-slate-800"></div>

                  <div>
                      <h4 className="font-bold mb-4 text-slate-100 text-lg">Final App Concept</h4>
                      <ConceptDisplay concept={data.unifiedProductBriefing.final_app_concept} />
                  </div>
              </div>
            </Card>
          )}

          {data.competitors.length > 0 && (
            <Card title="Competitor Analysis" className="lg:col-span-2">
              <div className="space-y-6">
                {data.competitors.map(c => <CompetitorCard key={c.id} competitor={c} />)}
              </div>
            </Card>
          )}

          {data.features.length > 0 && (
            <Card title="Proposed Features">
              <ul className="space-y-2">
                {data.features.map(f => (
                  <li key={f.id}>
                    <strong className="text-slate-100">{f.feature_name}</strong> ({f.category}): <span className="text-slate-400">{f.justification}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {data.targetPersonas.length > 0 && (
            <Card title="Target Personas" className="lg:col-span-2">
                <div className="space-y-6">
                    {data.targetPersonas.map(p => <PersonaCard key={p.id} persona={p} />)}
                </div>
            </Card>
          )}

          {data.asoAssets && (
            <Card title="ASO Assets" icon={<TagIcon />}>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold mb-3 text-slate-100 flex items-center">
                    <LightbulbIcon className="text-yellow-400 mr-2" />
                    Name Suggestions
                  </h4>
                  {Array.isArray(data.asoAssets.name_suggestions) && data.asoAssets.name_suggestions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {data.asoAssets.name_suggestions.map((name, i) => (
                        <span key={i} className="px-3 py-1 text-sm font-semibold rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                          {String(name)}
                        </span>
                      ))}
                    </div>
                  ) : <p className="text-slate-500 italic">No name suggestions.</p>}
                </div>

                <div>
                  <h4 className="font-bold mb-3 text-slate-100 flex items-center">
                    <LightbulbIcon className="text-yellow-400 mr-2" />
                    Subtitle Suggestions
                  </h4>
                  {Array.isArray(data.asoAssets.subtitle_suggestions) && data.asoAssets.subtitle_suggestions.length > 0 ? (
                    <ul className="space-y-2">
                      {data.asoAssets.subtitle_suggestions.map((subtitle, i) => (
                        <li key={i} className="p-3 bg-slate-900 rounded-md border border-slate-800">
                          <p className="text-slate-300">"{String(subtitle)}"</p>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-slate-500 italic">No subtitle suggestions.</p>}
                </div>
                
                <div>
                  <h4 className="font-bold mb-3 text-slate-100">App Description Preview</h4>
                  <div className="p-4 border border-slate-700/80 rounded-lg bg-slate-900">
                      <MarkdownRenderer markdown={data.asoAssets.app_description} />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {data.userFeedback.length > 0 && (
            <Card title="User Feedback Snippets">
              <div className="space-y-4">
                {data.userFeedback.map(snippet => (
                  <div key={snippet.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <blockquote className="border-l-4 border-sky-500 pl-4 italic text-slate-300">
                      "{snippet.original_quote}"
                    </blockquote>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <p><span className="font-semibold text-slate-400">Sentiment:</span> {snippet.sentiment}</p>
                      <p><span className="font-semibold text-slate-400">Topic:</span> {snippet.topic}</p>
                      <p className="col-span-2"><span className="font-semibold text-slate-400">Pain Point:</span> {snippet.underlying_pain_point}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          {data.monetizationModel && (
              <Card title="Monetization Model" className="lg:col-span-2">
                  <ColumnarMarkdownReport markdown={data.monetizationModel.report_markdown} />
              </Card>
          )}

          {data.visualBriefing && (
              <Card title="Visual Briefing" className="lg:col-span-2">
                  <TabbedMarkdownReport markdown={data.visualBriefing.briefing_markdown} />
              </Card>
          )}
        </div>
      )}
    </section>
  );
};
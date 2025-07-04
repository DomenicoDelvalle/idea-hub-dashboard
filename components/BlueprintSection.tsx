import React from 'react';
import type { BlueprintData } from '../types';
import { Card } from './Card';
import { BlueprintIcon, PackageIcon } from './icons';
import { ColumnarMarkdownReport } from './ColumnarMarkdownReport';
import { TabbedMarkdownReport } from './TabbedMarkdownReport';


interface BlueprintSectionProps {
  data: BlueprintData | null;
}

export const BlueprintSection: React.FC<BlueprintSectionProps> = ({ data }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-3">
        <BlueprintIcon />
        <span>Blueprint</span>
      </h2>
      {!data ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-lg text-slate-500">
          <p>Sin datos de blueprint disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.sddDocuments.map(sdd => (
            <React.Fragment key={sdd.id}>
              <Card title={`SDD Version ${sdd.version}`} className="lg:col-span-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <p className="text-sm text-slate-400">
                      Storage Path: <code className="text-amber-400 bg-slate-800 p-1 rounded-md">{sdd.storage_path}</code>
                    </p>
                    {sdd.publicUrl && (
                      <a 
                        href={sdd.publicUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                         </svg>
                        Descargar archivo .md
                      </a>
                    )}
                  </div>

                  {sdd.markdownContent ? (
                    <div className="mt-4 border-t border-slate-800 pt-4">
                      <ColumnarMarkdownReport markdown={sdd.markdownContent} />
                    </div>
                  ) : (
                    <div className="mt-4 border-t border-slate-800 pt-4 text-slate-500 italic text-center">
                      No se pudo cargar el contenido del documento.
                    </div>
                  )}
                </div>
              </Card>

              {data.persuasionLayers.filter(pl => pl.sdd_id === sdd.id).map(pl => (
                <Card key={pl.id} title="Persuasion Layer">
                  <h4 className="font-bold text-slate-100 mb-2">Color Palette</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(pl.color_palette).map(([name, hex]) => (
                          <div key={name} className="text-center">
                              <div className="w-16 h-16 rounded-full border-2 border-slate-700" style={{ backgroundColor: hex }}></div>
                              <span className="text-xs capitalize mt-1 block">{name}</span>
                          </div>
                      ))}
                  </div>
                  <h4 className="font-bold text-slate-100 mt-4 mb-2">Icon Style</h4>
                  <p className="mb-4">{pl.icon_style}</p>
                  <h4 className="font-bold text-slate-100 mt-4 mb-2">Design Brief</h4>
                  <TabbedMarkdownReport markdown={pl.design_brief_markdown} />
                </Card>
              ))}

              {data.techStackRecommendations.filter(ts => ts.sdd_id === sdd.id).map(ts => (
                <Card key={ts.id} title="Tech Stack Recommendation">
                  <h4 className="font-bold text-sky-300 text-lg">{ts.recommended_framework}</h4>
                  <p className="text-slate-400 my-2">{ts.justification}</p>
                   
                   <h5 className="font-semibold text-slate-200 mt-6 mb-3">Recommended Libraries</h5>
                    {Array.isArray(ts.recommended_libraries) && ts.recommended_libraries.length > 0 ? (
                        <div className="space-y-3">
                            {ts.recommended_libraries.map((lib, i) => {
                                if (typeof lib === 'object' && lib !== null && 'name' in lib && 'purpose' in lib) {
                                    return (
                                        <div key={i} className="flex items-start p-3 bg-slate-900 rounded-lg border border-slate-800">
                                            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md bg-sky-900/50 mr-4">
                                                <PackageIcon className="text-sky-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-100">{String(lib.name)}</p>
                                                <p className="text-sm text-slate-400">{String(lib.purpose)}</p>
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <div key={i} className="flex items-start p-3 bg-slate-900 rounded-lg border border-slate-800">
                                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md bg-sky-900/50 mr-4">
                                            <PackageIcon className="text-sky-400" />
                                        </div>
                                        <p className="font-mono text-sm self-center">{typeof lib === 'object' ? JSON.stringify(lib) : String(lib)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic">No libraries specified.</p>
                    )}
                </Card>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </section>
  );
};
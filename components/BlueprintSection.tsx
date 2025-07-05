import React from "react";
import type { BlueprintData } from "../types";
import { Card } from "./Card";
import { BlueprintIcon, PackageIcon } from "./icons";
import { ColumnarMarkdownReport } from "./ColumnarMarkdownReport";
import { TabbedMarkdownReport } from "./TabbedMarkdownReport";

interface BlueprintSectionProps {
  data: BlueprintData | null;
}

export const BlueprintSection: React.FC<BlueprintSectionProps> = ({ data }) => {
  return (
    <section>
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center space-x-3">
        <BlueprintIcon />
        <span>Blueprint</span>
      </h2>
      {!data ? (
        <div className="p-6 md:p-8 text-center border-2 border-dashed border-slate-800 rounded-lg text-slate-500">
          <p className="text-sm md:text-base">
            Sin datos de blueprint disponibles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {data.sddDocuments.map((sdd) => (
            <React.Fragment key={sdd.id}>
              <Card
                title={`SDD Version ${sdd.version}`}
                className="xl:col-span-2"
              >
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <p className="text-xs md:text-sm text-slate-400 break-all">
                      Storage Path:{" "}
                      <code className="text-amber-400 bg-slate-800 p-1 rounded-md text-xs">
                        {sdd.storage_path}
                      </code>
                    </p>
                    {sdd.publicUrl && (
                      <a
                        href={sdd.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 md:px-4 py-2 border border-transparent text-xs md:text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 md:h-5 md:w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Descargar archivo .md
                      </a>
                    )}
                  </div>

                  {sdd.markdownContent ? (
                    <div className="mt-4 border-t border-slate-800 pt-4 overflow-hidden">
                      <ColumnarMarkdownReport markdown={sdd.markdownContent} />
                    </div>
                  ) : (
                    <div className="mt-4 border-t border-slate-800 pt-4 text-slate-500 italic text-center text-sm md:text-base">
                      No se pudo cargar el contenido del documento.
                    </div>
                  )}
                </div>
              </Card>

              {data.persuasionLayers
                .filter((pl) => pl.sdd_id === sdd.id)
                .map((pl) => (
                  <Card key={pl.id} title="Persuasion Layer">
                    <h4 className="font-bold text-slate-100 mb-2 text-sm md:text-base">
                      Color Palette
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(pl.color_palette).map(([name, hex]) => (
                        <div key={name} className="text-center">
                          <div
                            className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-slate-700"
                            style={{ backgroundColor: hex }}
                          ></div>
                          <span className="text-xs capitalize mt-1 block">
                            {name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <h4 className="font-bold text-slate-100 mt-4 mb-2 text-sm md:text-base">
                      Icon Style
                    </h4>
                    <p className="mb-4 text-sm md:text-base">{pl.icon_style}</p>
                    <h4 className="font-bold text-slate-100 mt-4 mb-2 text-sm md:text-base">
                      Design Brief
                    </h4>
                    <div className="overflow-hidden">
                      <TabbedMarkdownReport
                        markdown={pl.design_brief_markdown}
                      />
                    </div>
                  </Card>
                ))}

              {data.techStackRecommendations
                .filter((ts) => ts.sdd_id === sdd.id)
                .map((ts) => (
                  <Card key={ts.id} title="Tech Stack Recommendation">
                    <h4 className="font-bold text-sky-300 text-base md:text-lg break-words">
                      {ts.recommended_framework}
                    </h4>
                    <p className="text-slate-400 my-2 text-sm md:text-base">
                      {ts.justification}
                    </p>

                    <h5 className="font-semibold text-slate-200 mt-6 mb-3 text-sm md:text-base">
                      Recommended Libraries
                    </h5>
                    {Array.isArray(ts.recommended_libraries) &&
                    ts.recommended_libraries.length > 0 ? (
                      <div className="space-y-3">
                        {ts.recommended_libraries.map((lib, i) => {
                          if (
                            typeof lib === "object" &&
                            lib !== null &&
                            "name" in lib &&
                            "purpose" in lib
                          ) {
                            return (
                              <div
                                key={i}
                                className="flex items-start p-3 bg-slate-900 rounded-lg border border-slate-800"
                              >
                                <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-md bg-sky-900/50 mr-3 md:mr-4">
                                  <PackageIcon className="text-sky-400 w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-100 text-sm md:text-base break-words">
                                    {String(lib.name)}
                                  </p>
                                  <p className="text-xs md:text-sm text-slate-400 break-words">
                                    {String(lib.purpose)}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div
                              key={i}
                              className="flex items-start p-3 bg-slate-900 rounded-lg border border-slate-800"
                            >
                              <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-md bg-sky-900/50 mr-3 md:mr-4">
                                <PackageIcon className="text-sky-400 w-4 h-4 md:w-5 md:h-5" />
                              </div>
                              <p className="font-mono text-xs md:text-sm self-center break-all">
                                {typeof lib === "object"
                                  ? JSON.stringify(lib)
                                  : String(lib)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs md:text-sm text-slate-500 italic">
                        No libraries specified.
                      </p>
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

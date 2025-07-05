import React from "react";
import type { AppIdea } from "../types";
import { Loader } from "./Loader";

interface SidebarProps {
  appIdeas: AppIdea[];
  selectedAppIdeaId: string | null;
  onSelectIdea: (id: string) => void;
  loading: boolean;
  error: string | null;
}

const statusColorMap: Record<AppIdea["status"], string> = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  complete: "bg-green-500",
  error: "bg-red-500",
};

export const Sidebar: React.FC<SidebarProps> = ({
  appIdeas,
  selectedAppIdeaId,
  onSelectIdea,
  loading,
  error,
}) => {
  return (
    <nav className="flex-1 overflow-y-auto p-2">
      <h2 className="text-xs font-bold uppercase text-slate-500 px-2 mb-2">
        App Ideas
      </h2>
      {loading && (
        <div className="flex justify-center p-4">
          <Loader />
        </div>
      )}
      {error && <div className="text-red-400 px-2 text-sm">{error}</div>}
      {!loading && !error && (
        <ul className="space-y-1">
          {appIdeas.map((idea) => (
            <li key={idea.id}>
              <button
                onClick={() => onSelectIdea(idea.id)}
                className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors duration-200 ${
                  selectedAppIdeaId === idea.id
                    ? "bg-sky-500/20 text-sky-300"
                    : "hover:bg-slate-800/60 text-slate-400"
                }`}
              >
                <span className="flex-1 pr-2 text-sm leading-relaxed break-words">
                  {idea.idea_text}
                </span>
                <span
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    statusColorMap[idea.status]
                  }`}
                  title={idea.status}
                ></span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

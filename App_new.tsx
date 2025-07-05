import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { getAppIdeas } from "./services/supabaseService";
import type { AppIdea } from "./types";
import { Logo } from "./components/Logo";
import { MenuIcon, CloseIcon } from "./components/icons";

const App: React.FC = () => {
  const [appIdeas, setAppIdeas] = useState<AppIdea[]>([]);
  const [selectedAppIdeaId, setSelectedAppIdeaId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true);
      const ideas = await getAppIdeas();
      setAppIdeas(ideas);
      if (ideas.length > 0) {
        setSelectedAppIdeaId(ideas[0].id);
      }
    } catch (err) {
      setError("Failed to fetch app ideas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const selectedIdea = appIdeas.find(
    (idea: AppIdea) => idea.id === selectedAppIdeaId
  );

  const handleSelectIdea = (id: string) => {
    setSelectedAppIdeaId(id);
    setSidebarOpen(false); // Fecha o sidebar em mobile após selecionar
  };

  return (
    <div className="flex h-screen font-sans bg-slate-900 text-slate-300">
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        w-72 bg-slate-950 flex flex-col h-full border-r border-slate-800 z-50
        fixed lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo />
            <h1 className="text-xl font-bold text-white">Idea Hub</h1>
          </div>
          {/* Botão de fechar para mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <Sidebar
          appIdeas={appIdeas}
          selectedAppIdeaId={selectedAppIdeaId}
          onSelectIdea={handleSelectIdea}
          loading={loading}
          error={error}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto lg:ml-0">
        {/* Header para mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <Logo />
            <h1 className="text-lg font-bold text-white">Idea Hub</h1>
          </div>
        </div>

        <Dashboard key={selectedAppIdeaId} selectedAppIdea={selectedIdea} />
      </main>
    </div>
  );
};

export default App;

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { getAppIdeas } from './services/supabaseService';
import type { AppIdea } from './types';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [appIdeas, setAppIdeas] = useState<AppIdea[]>([]);
  const [selectedAppIdeaId, setSelectedAppIdeaId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true);
      const ideas = await getAppIdeas();
      setAppIdeas(ideas);
      if (ideas.length > 0) {
        setSelectedAppIdeaId(ideas[0].id);
      }
    } catch (err) {
      setError('Failed to fetch app ideas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const selectedIdea = appIdeas.find(idea => idea.id === selectedAppIdeaId);

  return (
    <div className="flex h-screen font-sans bg-slate-900 text-slate-300">
      <div className="w-72 bg-slate-950 flex flex-col fixed h-full border-r border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-2">
          <Logo />
          <h1 className="text-xl font-bold text-white">Idea Hub</h1>
        </div>
        <Sidebar
          appIdeas={appIdeas}
          selectedAppIdeaId={selectedAppIdeaId}
          onSelectIdea={setSelectedAppIdeaId}
          loading={loading}
          error={error}
        />
      </div>
      <main className="ml-72 flex-1 overflow-y-auto">
        <Dashboard key={selectedAppIdeaId} selectedAppIdea={selectedIdea} />
      </main>
    </div>
  );
};

export default App;

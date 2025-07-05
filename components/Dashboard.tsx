import React, { useState, useEffect, useCallback } from "react";
import type {
  AppIdea,
  ResearchData,
  BlueprintData,
  ProjectManagementData,
} from "../types";
import {
  getResearchData,
  getBlueprintDataForIdea,
  getProjectManagementDataForSdd,
} from "../services/supabaseService";
import { Loader } from "./Loader";
import { ResearchSection } from "./ResearchSection";
import { BlueprintSection } from "./BlueprintSection";
import { ProjectManagementSection } from "./ProjectManagementSection";

interface DashboardProps {
  selectedAppIdea: AppIdea | undefined;
}

export const Dashboard: React.FC<DashboardProps> = ({ selectedAppIdea }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [blueprintData, setBlueprintData] = useState<BlueprintData | null>(
    null
  );
  const [projectData, setProjectData] = useState<ProjectManagementData | null>(
    null
  );

  const fetchDataForIdea = useCallback(async (ideaId: string) => {
    try {
      setLoading(true);
      setError(null);
      setResearchData(null);
      setBlueprintData(null);
      setProjectData(null);

      const research = await getResearchData(ideaId);
      setResearchData(research);

      const blueprint = await getBlueprintDataForIdea(ideaId);
      setBlueprintData(blueprint);

      if (blueprint?.sddDocuments && blueprint.sddDocuments.length > 0) {
        const projectDataPromises = blueprint.sddDocuments.map((sdd) =>
          getProjectManagementDataForSdd(sdd.id)
        );
        const projectResults = await Promise.all(projectDataPromises);

        const combinedProjectData: ProjectManagementData = {
          projects: [],
          tasks: [],
        };
        projectResults.forEach((result) => {
          if (result) {
            combinedProjectData.projects.push(...result.projects);
            combinedProjectData.tasks.push(...result.tasks);
          }
        });

        if (combinedProjectData.projects.length > 0) {
          setProjectData(combinedProjectData);
        }
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to load data for this idea: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedAppIdea) {
      fetchDataForIdea(selectedAppIdea.id);
    }
  }, [selectedAppIdea, fetchDataForIdea]);

  if (!selectedAppIdea) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p>Select an idea from the sidebar to view its details.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-white break-words">
          {selectedAppIdea.idea_text}
        </h1>
        <p className="text-slate-400 mt-1 text-sm md:text-base">
          Created on:{" "}
          {new Date(selectedAppIdea.created_at).toLocaleDateString()}
        </p>
      </header>

      {loading && (
        <div className="flex justify-center items-center h-32 md:h-64">
          <Loader />
        </div>
      )}

      {error && (
        <div className="text-red-400 bg-red-900/50 p-4 rounded-lg text-sm md:text-base">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6 md:space-y-8 lg:space-y-10">
          <BlueprintSection data={blueprintData} />
          <ResearchSection data={researchData} />
          <ProjectManagementSection data={projectData} />
        </div>
      )}
    </div>
  );
};

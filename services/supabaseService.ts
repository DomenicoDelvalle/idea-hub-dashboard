import { supabase, researchClient, blueprintClient, projectManagementClient } from './supabaseClient';
import type { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';
import type { 
  AppIdea, 
  ResearchData, 
  BlueprintData, 
  ProjectManagementData,
  Competitor,
  Feature,
  UserFeedbackSnippet,
  MonetizationModel,
  TargetPersona,
  AsoAssets,
  VisualBriefing,
  UnifiedProductBriefing,
  SddDocument,
  PersuasionLayer,
  TechStackRecommendation,
  Project,
  ProjectTask,
} from '../types';

// Helper to handle Supabase errors
const handleSupabaseError = ({ error, functionName }: { error: PostgrestError | null; functionName: string }) => {
  if (error) {
    console.error(`Error in ${functionName}:`, error);
    throw new Error(error.message);
  }
};

export const getAppIdeas = async (): Promise<AppIdea[]> => {
  const { data, error }: PostgrestResponse<AppIdea> = await researchClient
    .from('app_ideas')
    .select('*')
    .order('created_at', { ascending: false });

  handleSupabaseError({ error, functionName: 'getAppIdeas' });
  
  return data || [];
};

export const getResearchData = async (appIdeaId: string): Promise<ResearchData | null> => {
  const [
    competitorsRes,
    featuresRes,
    userFeedbackRes,
    monetizationModelRes,
    targetPersonasRes,
    asoAssetsRes,
    visualBriefingRes,
    unifiedProductBriefingRes,
  ] = await Promise.all([
    researchClient.from('competitors').select('*').eq('app_idea_id', appIdeaId),
    researchClient.from('features').select('*').eq('app_idea_id', appIdeaId),
    researchClient.from('user_feedback_snippets').select('*').eq('app_idea_id', appIdeaId),
    researchClient.from('monetization_models').select('*').eq('app_idea_id', appIdeaId),
    researchClient.from('target_personas').select('*').eq('app_idea_id', appIdeaId),
    researchClient.from('aso_assets').select('*').eq('app_idea_id', appIdeaId),
    researchClient.from('visual_briefings').select('*').eq('app_idea_id', appIdeaId),
    researchClient.from('unified_product_briefings').select('*').eq('app_idea_id', appIdeaId),
  ]);

  handleSupabaseError({ error: competitorsRes.error, functionName: 'getResearchData.competitors' });
  handleSupabaseError({ error: featuresRes.error, functionName: 'getResearchData.features' });
  handleSupabaseError({ error: userFeedbackRes.error, functionName: 'getResearchData.user_feedback_snippets' });
  handleSupabaseError({ error: monetizationModelRes.error, functionName: 'getResearchData.monetization_models' });
  handleSupabaseError({ error: targetPersonasRes.error, functionName: 'getResearchData.target_personas' });
  handleSupabaseError({ error: asoAssetsRes.error, functionName: 'getResearchData.aso_assets' });
  handleSupabaseError({ error: visualBriefingRes.error, functionName: 'getResearchData.visual_briefings' });
  handleSupabaseError({ error: unifiedProductBriefingRes.error, functionName: 'getResearchData.unified_product_briefings' });

  const competitors = (competitorsRes.data as Competitor[]) || [];
  const features = (featuresRes.data as Feature[]) || [];
  const userFeedback = (userFeedbackRes.data as UserFeedbackSnippet[]) || [];
  const monetizationModel = ((monetizationModelRes.data as MonetizationModel[]) || [])[0] || undefined;
  const targetPersonas = (targetPersonasRes.data as TargetPersona[]) || [];
  const asoAssets = ((asoAssetsRes.data as AsoAssets[]) || [])[0] || undefined;
  const visualBriefing = ((visualBriefingRes.data as VisualBriefing[]) || [])[0] || undefined;
  const unifiedProductBriefing = ((unifiedProductBriefingRes.data as UnifiedProductBriefing[]) || [])[0] || undefined;

  const researchData: ResearchData = {
    competitors,
    features,
    userFeedback,
    monetizationModel,
    targetPersonas,
    asoAssets,
    visualBriefing,
    unifiedProductBriefing,
  };
  
  if (Object.values(researchData).every(val => (Array.isArray(val) ? val.length === 0 : val === undefined))) {
    return null;
  }

  return researchData;
};

export const getBlueprintDataForIdea = async (appIdeaId: string): Promise<BlueprintData | null> => {
  const { data: sddDocuments, error: sddError } = await blueprintClient
    .from('sdd_documents')
    .select('*')
    .eq('app_idea_id', appIdeaId);
  
  handleSupabaseError({ error: sddError, functionName: 'getBlueprintDataForIdea.sddDocuments' });
  
  const typedSddDocuments = (sddDocuments as SddDocument[]) || [];

  if (typedSddDocuments.length === 0) {
    return null;
  }

  const sddDocumentsWithContent: SddDocument[] = await Promise.all(
    typedSddDocuments.map(async (doc) => {
      // Construct the correct path dynamically as requested by the user.
      const correctStoragePath = `${doc.app_idea_id}_${doc.version}.md`;
      const { data: urlData } = supabase.storage.from('sdd-documents').getPublicUrl(correctStoragePath);
      const publicUrl = urlData.publicUrl;
      let markdownContent = '';

      if (publicUrl) {
        try {
          const response = await fetch(publicUrl);
          if (response.ok) {
            markdownContent = await response.text();
          } else {
            console.warn(`Failed to fetch markdown for ${publicUrl}: ${response.statusText}`);
            markdownContent = `*Error: Could not load content from ${publicUrl}. Status: ${response.status}*`;
          }
        } catch (fetchError) {
          console.error(`Fetch error for ${publicUrl}:`, fetchError);
          markdownContent = `*Error: A network error occurred while trying to load the content.*`;
        }
      }

      // Return the doc with the *correct* storage path and the fetched content.
      return { ...doc, storage_path: correctStoragePath, publicUrl, markdownContent };
    })
  );

  const sddIds = sddDocumentsWithContent.map(sdd => sdd.id);

  const [
    persuasionLayersRes,
    techStackRes,
  ] = await Promise.all([
    blueprintClient.from('persuasion_layers').select('*').in('sdd_id', sddIds),
    blueprintClient.from('tech_stack_recommendations').select('*').in('sdd_id', sddIds),
  ]);

  handleSupabaseError({ error: persuasionLayersRes.error, functionName: 'getBlueprintDataForIdea.persuasionLayers' });
  handleSupabaseError({ error: techStackRes.error, functionName: 'getBlueprintDataForIdea.techStackRecommendations' });
  
  const persuasionLayers = (persuasionLayersRes.data as PersuasionLayer[]) || [];
  const techStackRecommendations = (techStackRes.data as TechStackRecommendation[]) || [];

  const blueprintData: BlueprintData = {
    sddDocuments: sddDocumentsWithContent,
    persuasionLayers,
    techStackRecommendations,
  };

  return blueprintData;
};

export const getProjectManagementDataForSdd = async (sddId: string): Promise<ProjectManagementData | null> => {
  const { data: projectsData, error: projectError } = await projectManagementClient
    .from('projects')
    .select('*')
    .eq('sdd_id', sddId);

  handleSupabaseError({ error: projectError, functionName: 'getProjectManagementDataForSdd.projects' });
  
  const typedProjects: Project[] = (projectsData as Project[]) || [];

  if (typedProjects.length === 0) {
    return null;
  }
  
  const projectIds = typedProjects.map(project => project.id);
  
  const { data: tasksData, error: tasksError } = await projectManagementClient
    .from('project_tasks')
    .select('*')
    .in('project_id', projectIds);
    
  handleSupabaseError({ error: tasksError, functionName: 'getProjectManagementDataForSdd.tasks' });

  const tasks = (tasksData as ProjectTask[]) || [];

  const projectManagementData: ProjectManagementData = {
    projects: typedProjects,
    tasks,
  };

  return projectManagementData;
};
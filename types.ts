// research schema
export interface AppIdea {
  id: string;
  idea_text: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  created_at: string;
}

export interface Competitor {
  id: string;
  app_idea_id: string;
  competitor_name: string;
  app_store_url?: string;
  strengths: Record<string, any>;
  weaknesses: Record<string, any>;
  monetization_model: string;
  aso_keywords: string[];
  user_review_summary: string;
}

export interface Feature {
  id: string;
  app_idea_id: string;
  feature_name: string;
  category: 'Must-Have' | 'Should-Have' | 'Could-Have' | 'Wont-Have';
  justification: string;
}

export interface UserFeedbackSnippet {
  id: string;
  app_idea_id: string;
  original_quote: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  topic: string;
  underlying_pain_point: string;
}

export interface MonetizationModel {
  id: string;
  app_idea_id: string;
  report_markdown: string;
  created_at: string;
}

export interface TargetPersona {
  id: string;
  app_idea_id: string;
  persona_name: string;
  demographics: Record<string, any>;
  psychographics: Record<string, any>;
  day_in_the_life_narrative: string;
  monetization_propensity: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface AsoAssets {
  id: string;
  app_idea_id: string;
  name_suggestions: any;
  subtitle_suggestions: any;
  app_description: string;
  created_at: string;
}

export interface VisualBriefing {
  id: string;
  app_idea_id: string;
  briefing_markdown: string;
  created_at: string;
}

export interface UnifiedProductBriefing {
  id: string;
  app_idea_id: string;
  executive_summary_markdown: string;
  final_app_concept: Record<string, any>;
  created_at: string;
}

export interface ResearchData {
  competitors: Competitor[];
  features: Feature[];
  userFeedback: UserFeedbackSnippet[];
  monetizationModel?: MonetizationModel;
  targetPersonas: TargetPersona[];
  asoAssets?: AsoAssets;
  visualBriefing?: VisualBriefing;
  unifiedProductBriefing?: UnifiedProductBriefing;
}


// blueprint schema
export interface SddDocument {
  id: string;
  app_idea_id: string;
  version: string;
  storage_path: string;
  created_at: string;
  publicUrl?: string;
  markdownContent?: string;
}

export interface PersuasionLayer {
  id: string;
  sdd_id: string;
  design_brief_markdown: string;
  color_palette: Record<string, string>;
  icon_style: string;
  created_at: string;
}

export interface TechStackRecommendation {
  id: string;
  sdd_id: string;
  recommended_framework: string;
  justification: string;
  recommended_libraries: any[];
  created_at: string;
}

export interface BlueprintData {
  sddDocuments: SddDocument[];
  persuasionLayers: PersuasionLayer[];
  techStackRecommendations: TechStackRecommendation[];
}


// project_management schema
export interface Project {
  id: string;
  sdd_id: string;
  project_name: string;
  github_repo_url?: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  created_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  task_name?: string;
  description: string;
  dependencies: string[];
  category: string;
  status: 'Todo' | 'In Progress' | 'In Review' | 'Done';
  assigned_to?: string;
  acceptance_criteria: string[];
  github_pr_url?: string;
  created_at: string;
  updated_at: string;
  estimated_hours?: number;
  priority?: string;
}

export interface ProjectManagementData {
    projects: Project[];
    tasks: ProjectTask[];
}
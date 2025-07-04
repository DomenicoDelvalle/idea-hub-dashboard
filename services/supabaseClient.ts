import { createClient } from '@supabase/supabase-js';

// The user-provided URL had a typo 'ttps://', it has been corrected to 'https://'
const supabaseUrl = 'https://giyizrjznbqyophdtwht.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeWl6cmp6bmJxeW9waGR0d2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwODQ4MTYsImV4cCI6MjA2NjY2MDgxNn0.1V_GtxbRLPjSfNsO3ttzT81rVoNC0sjx0CXRJGaIJWY';

const createSchemaClient = (schema: string) => createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema }
});

export const researchClient = createSchemaClient('research');
export const blueprintClient = createSchemaClient('blueprint');
export const projectManagementClient = createSchemaClient('project_management');

// Default client for public schema and storage operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

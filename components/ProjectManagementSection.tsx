import React from 'react';
import type { ProjectManagementData, ProjectTask } from '../types';
import { Card } from './Card';
import { ProjectMgmtIcon } from './icons';

interface ProjectManagementSectionProps {
  data: ProjectManagementData | null;
}

const statusBadgeStyle: Record<ProjectTask['status'], string> = {
    'Todo': 'bg-slate-600 text-slate-200',
    'In Progress': 'bg-blue-500 text-white',
    'In Review': 'bg-purple-500 text-white',
    'Done': 'bg-green-500 text-white',
};

const priorityColorMap: Record<string, string> = {
    'High': 'bg-red-500/20 text-red-300 border border-red-500/30',
    'Medium': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    'Low': 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
};

const priorityBadge = (priority: string) => {
    const style = priorityColorMap[priority] || 'bg-slate-700 text-slate-300';
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${style}`}>{priority}</span>;
}

export const ProjectManagementSection: React.FC<ProjectManagementSectionProps> = ({ data }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-3">
        <ProjectMgmtIcon />
        <span>Project Management</span>
      </h2>
      {!data ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-lg text-slate-500">
          <p>Sin datos de project management disponibles.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.projects.map(project => {
            const projectTasks = data.tasks.filter(t => t.project_id === project.id);
            return (
              <Card key={project.id} title={`Project: ${project.project_name}`} className="lg:col-span-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-900">
                      <tr>
                        <th scope="col" className="px-4 py-3">Task Name</th>
                        <th scope="col" className="px-4 py-3">Description</th>
                        <th scope="col" className="px-4 py-3">Category</th>
                        <th scope="col" className="px-4 py-3">Priority</th>
                        <th scope="col" className="px-4 py-3 text-center">Est. Hours</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">Dependencies</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectTasks.length > 0 ? (
                        projectTasks.map(task => (
                          <tr key={task.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                            <td className="px-4 py-3 font-medium text-slate-200">{task.task_name || 'N/A'}</td>
                            <td className="px-4 py-3">{task.description}</td>
                            <td className="px-4 py-3 text-slate-400">{task.category}</td>
                            <td className="px-4 py-3">{task.priority ? priorityBadge(task.priority) : 'N/A'}</td>
                            <td className="px-4 py-3 text-center">{task.estimated_hours || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadgeStyle[task.status]}`}>
                                  {task.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {task.dependencies && task.dependencies.length > 0 ? task.dependencies.join(', ') : 'None'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                            Este proyecto aún no tiene tareas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};

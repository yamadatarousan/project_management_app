'use client';

import { useState, useEffect } from 'react';
import { getProjects, Project, deleteProject } from '@/utils/api';
import ProjectForm from '@/components/ProjectForm';
import EditProjectForm from '@/components/EditProjectForm';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        fetchProjects(); // 削除後に一覧を更新
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Project Management App</h1>
      {editingProject ? (
        <EditProjectForm
          project={editingProject}
          onProjectUpdated={() => {
            fetchProjects();
            setEditingProject(null);
          }}
          onCancel={handleCancelEdit}
        />
      ) : (
        <ProjectForm onProjectCreated={fetchProjects} />
      )}
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p className="text-gray-600">{project.description || 'No description'}</p>
                <p className="text-sm text-gray-500">
                  Due: {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'No due date'}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="py-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { getProjects, Project, deleteProject } from '@/utils/api';
import ProjectForm from '@/components/ProjectForm';
import EditProjectForm from '@/components/EditProjectForm';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [sortOption, setSortOption] = useState<
    'title-asc' | 'title-desc' | 'due_date-asc' | 'due_date-desc'
  >('title-asc'); // ソートオプション

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
      applyFilterAndSort(data, statusFilter, sortOption);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  // フィルタリングとソートを適用する関数
  const applyFilterAndSort = (
    data: Project[],
    filter: 'all' | 'in_progress' | 'completed',
    sort: 'title-asc' | 'title-desc' | 'due_date-asc' | 'due_date-desc'
  ) => {
    // フィルタリング
    let filtered = data;
    if (filter !== 'all') {
      filtered = data.filter((project) => project.status === filter);
    }

    // ソート
    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'title-asc') {
        return a.title.localeCompare(b.title);
      } else if (sort === 'title-desc') {
        return b.title.localeCompare(a.title);
      } else if (sort === 'due_date-asc') {
        const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        return dateA - dateB;
      } else if (sort === 'due_date-desc') {
        const dateA = a.due_date ? new Date(a.due_date).getTime() : -Infinity;
        const dateB = b.due_date ? new Date(b.due_date).getTime() : -Infinity;
        return dateB - dateA;
      }
      return 0;
    });

    setFilteredProjects(sorted);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFilterChange = (newFilter: 'all' | 'in_progress' | 'completed') => {
    setStatusFilter(newFilter);
    applyFilterAndSort(projects, newFilter, sortOption);
  };

  const handleSortChange = (newSort: 'title-asc' | 'title-desc' | 'due_date-asc' | 'due_date-desc') => {
    setSortOption(newSort);
    applyFilterAndSort(projects, statusFilter, newSort);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setDeletingId(id);
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete project');
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center sm:text-left">
          Project Management App
        </h1>
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
        <div className="mb-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center sm:justify-start">
          <div className="flex space-x-4">
            <button
              onClick={() => handleFilterChange('all')}
              className={`py-2 px-4 rounded-lg font-medium ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('in_progress')}
              className={`py-2 px-4 rounded-lg font-medium ${
                statusFilter === 'in_progress'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              In Progress
            </button>
            <button
              onClick={() => handleFilterChange('completed')}
              className={`py-2 px-4 rounded-lg font-medium ${
                statusFilter === 'completed'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              Completed
            </button>
          </div>
          <div>
            <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) =>
                handleSortChange(
                  e.target.value as 'title-asc' | 'title-desc' | 'due_date-asc' | 'due_date-desc'
                )
              }
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            >
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="due_date-asc">Due Date (Earliest)</option>
              <option value="due_date-desc">Due Date (Latest)</option>
            </select>
          </div>
        </div>
        {filteredProjects.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">No projects found.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <li
                key={project.id}
                className={`p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between ${
                  project.status === 'completed' ? 'bg-green-50' : 'bg-white'
                }`}
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h2>
                  <p className="text-gray-600 mb-3">{project.description || 'No description'}</p>
                  <p className="text-sm text-gray-500">
                    Due: {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'No due date'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status:{' '}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'completed'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {project.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </p>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    disabled={deletingId === project.id}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className={`flex-1 py-2 px-4 rounded-lg text-white ${
                      deletingId === project.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    } transition-colors duration-200`}
                    disabled={deletingId === project.id}
                  >
                    {deletingId === project.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
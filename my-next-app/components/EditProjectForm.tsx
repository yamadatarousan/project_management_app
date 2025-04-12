'use client';

import { useState } from 'react';
import { updateProject, Project } from '@/utils/api';

interface EditProjectFormProps {
  project: Project;
  onProjectUpdated: () => void; // 更新後に一覧を更新するためのコールバック
  onCancel: () => void; // 編集キャンセル用のコールバック
}

export default function EditProjectForm({ project, onProjectUpdated, onCancel }: EditProjectFormProps) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description || '');
  const [dueDate, setDueDate] = useState(project.due_date || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const updatedProject = {
        title,
        description: description || undefined,
        due_date: dueDate || undefined,
      };
      await updateProject(project.id, updatedProject);
      onProjectUpdated(); // 更新後に一覧を更新
    } catch (err) {
      setError('Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-semibold mb-4">Edit Project</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-2 px-4 rounded-md text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Updating...' : 'Update Project'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
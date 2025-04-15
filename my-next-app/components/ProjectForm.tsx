'use client';

import { useState } from 'react';
import { createProject, Project } from '@/utils/api';

interface ProjectFormProps {
  onProjectCreated: () => void;
}

export default function ProjectForm({ onProjectCreated }: ProjectFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'in_progress' | 'completed'>('in_progress'); // ステータスを追加
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const newProject = {
        title,
        description: description || undefined,
        due_date: dueDate || undefined,
        status, // ステータスを送信
      };
      await createProject(newProject);
      onProjectCreated();
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('in_progress'); // リセット
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10 p-6 bg-white border border-gray-200 rounded-xl shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Project</h2>
      {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-md">{error}</p>}
      <div className="mb-5">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          rows={3}
        />
      </div>
      <div className="mb-5">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'in_progress' | 'completed')}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
        >
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        } transition-colors duration-200`}
      >
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
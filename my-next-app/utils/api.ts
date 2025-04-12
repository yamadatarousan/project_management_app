import axios from 'axios';

// Laravel APIのベースURL
const API_URL = 'http://127.0.0.1:8000/api';

// axiosインスタンスを作成
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// プロジェクトの型定義
export interface Project {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

// プロジェクト一覧を取得
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data;
};

// 新しいプロジェクトを作成
export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
  const response = await api.post('/projects', project);
  return response.data;
};

export default api;
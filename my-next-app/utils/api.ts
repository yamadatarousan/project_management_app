import axios, { AxiosError } from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// エラーメッセージを抽出する関数
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response?.data) {
      const { message, errors } = axiosError.response.data;
      if (errors) {
        return Object.values(errors)
          .flat()
          .join(', ') || message;
      }
      return message;
    }
  }
  return 'An unexpected error occurred';
};

export interface Project {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
  try {
    const response = await api.post('/projects', project);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateProject = async (id: number, project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
  try {
    const response = await api.put(`/projects/${id}`, project);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteProject = async (id: number): Promise<void> => {
  try {
    await api.delete(`/projects/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export default api;
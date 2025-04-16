import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

export interface Project {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  status: 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  user_id?: number; // 追加
}

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

export const getProjects = async (params: {
  sort?: 'title' | 'due_date' | 'created_at';
  order?: 'asc' | 'desc';
  status?: 'in_progress' | 'completed';
} = {}): Promise<Project[]> => {
  try {
    const response = await api.get('/projects', { params });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createProject = async (
  project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<Project> => {
  try {
    const response = await api.post('/projects', project);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateProject = async (
  id: number,
  project: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
): Promise<Project> => {
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
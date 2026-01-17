export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface SearchResult {
  id: number;
  title: string;
  score: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  page: number;
  results: SearchResult[];
  total: number;
}

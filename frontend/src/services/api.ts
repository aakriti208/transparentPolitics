/**
 * API client for Political Transparency backend
 */
import axios from 'axios';
import { District, Candidate } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Districts API
 */
export const districtsApi = {
  /**
   * Get all districts
   */
  getAll: async (): Promise<District[]> => {
    const response = await apiClient.get<District[]>('/districts');
    return response.data;
  },

  /**
   * Get a specific district by ID
   */
  getById: async (districtId: string): Promise<District> => {
    const response = await apiClient.get<District>(`/districts/${districtId}`);
    return response.data;
  },

  /**
   * Get candidates for a specific district
   */
  getCandidates: async (districtId: string): Promise<Candidate[]> => {
    const response = await apiClient.get<Candidate[]>(
      `/districts/${districtId}/candidates`
    );
    return response.data;
  },
};

/**
 * Candidates API
 */
export const candidatesApi = {
  /**
   * Get full candidate details by ID
   */
  getById: async (candidateId: string): Promise<Candidate> => {
    const response = await apiClient.get<Candidate>(`/candidates/${candidateId}`);
    return response.data;
  },
};

export default apiClient;

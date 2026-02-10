/**
 * API client for Political Transparency backend
 */
import axios from 'axios';
import { District, Candidate, Bill, CandidateVote } from '../types';

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

/**
 * Contact API
 */
export const contactApi = {
  /**
   * Submit contact form
   */
  submit: async (data: { name: string; email: string; message: string }) => {
    const response = await apiClient.post('/contact', data);
    console.log(response);
    return response.data;
  },
};

/**
 * Bills API
 */
export const billsApi = {
  /**
   * Get all bills
   */
  getAll: async (): Promise<Bill[]> => {
    const response = await apiClient.get<Bill[]>('/bills');
    return response.data;
  },

  /**
   * Get a specific bill by ID
   */
  getById: async (billId: number): Promise<Bill> => {
    const response = await apiClient.get<Bill>(`/bills/${billId}`);
    return response.data;
  },
};

/**
 * Votes API
 */
export const votesApi = {
  /**
   * Get all votes by a specific candidate
   */
  getCandidateVotes: async (candidateId: string): Promise<CandidateVote[]> => {
    const response = await apiClient.get<CandidateVote[]>(`/candidates/${candidateId}/votes`);
    return response.data;
  },
};

export default apiClient;

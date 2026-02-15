/**
 * Custom hooks for candidate data
 */
import { useQuery } from '@tanstack/react-query';
import { Candidate } from '../types';
import { candidatesApi } from '../services/api';

/**
 * Hook to fetch a specific candidate by ID
 */
export const useCandidate = (candidateId: string | null) => {
  return useQuery<Candidate, Error>({
    queryKey: ['candidate', candidateId],
    queryFn: async () => {
      if (!candidateId) throw new Error('No candidate ID provided');
      return await candidatesApi.getById(candidateId);
    },
    enabled: !!candidateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

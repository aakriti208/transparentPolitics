/**
 * Custom hooks for candidate data
 */
import { useQuery } from '@tanstack/react-query';
import { candidatesApi } from '../services/api';
import { Candidate } from '../types';

/**
 * Hook to fetch a specific candidate by ID
 */
export const useCandidate = (candidateId: string | null) => {
  return useQuery<Candidate, Error>({
    queryKey: ['candidate', candidateId],
    queryFn: () => candidatesApi.getById(candidateId!),
    enabled: !!candidateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

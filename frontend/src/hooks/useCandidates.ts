/**
 * Custom hooks for candidate data
 */
import { useQuery } from '@tanstack/react-query';
import { Candidate } from '../types';
import { texasCandidates } from '../data/texasCandidates';

/**
 * Hook to fetch a specific candidate by ID
 */
export const useCandidate = (candidateId: string | null) => {
  return useQuery<Candidate, Error>({
    queryKey: ['candidate', candidateId],
    queryFn: async () => {
      if (!candidateId) throw new Error('No candidate ID provided');

      const candidate = texasCandidates.find(c => c.id === candidateId);
      if (!candidate) throw new Error('Candidate not found');

      return candidate;
    },
    enabled: !!candidateId,
    staleTime: Infinity, // Static data
  });
};

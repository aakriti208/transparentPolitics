/**
 * Custom hooks for district data
 */
import { useQuery } from '@tanstack/react-query';
import { Candidate } from '../types';
import { texasDistrictsData } from '../utils/texasDistricts';
import { texasDistricts } from '../data/texasDistricts';
import { texasCandidates } from '../data/texasCandidates';

/**
 * Hook to fetch all districts (returns GeoJSON)
 */
export const useDistricts = () => {
  return useQuery<any, Error>({
    queryKey: ['districts'],
    queryFn: async () => {
      // Return the imported GeoJSON data directly
      return texasDistrictsData;
    },
    staleTime: Infinity, // Data is static, no need to refetch
  });
};

/**
 * Hook to fetch a specific district by ID
 */
export const useDistrict = (districtId: string | null) => {
  return useQuery<any, Error>({
    queryKey: ['district', districtId],
    queryFn: async () => {
      if (!districtId) return null;

      // Find the district in the local data
      const district = texasDistricts.find(d => d.id === districtId);
      return district || null;
    },
    enabled: !!districtId,
    staleTime: Infinity,
  });
};

/**
 * Hook to fetch candidates for a district
 */
export const useDistrictCandidates = (districtId: string | null) => {
  return useQuery<Candidate[], Error>({
    queryKey: ['districtCandidates', districtId],
    queryFn: async () => {
      if (!districtId) return [];

      // Filter candidates by district ID
      const candidates = texasCandidates.filter(c => c.district_id === districtId);
      return candidates;
    },
    enabled: !!districtId,
    staleTime: Infinity,
  });
};

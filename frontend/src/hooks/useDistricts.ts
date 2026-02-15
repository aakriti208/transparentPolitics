/**
 * Custom hooks for district data
 */
import { useQuery } from '@tanstack/react-query';
import { Candidate, District } from '../types';
import { texasDistrictsData } from '../utils/texasDistricts';
import { districtsApi } from '../services/api';

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
  return useQuery<District, Error>({
    queryKey: ['district', districtId],
    queryFn: async () => {
      if (!districtId) throw new Error('No district ID provided');
      return await districtsApi.getById(districtId);
    },
    enabled: !!districtId,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      return await districtsApi.getCandidates(districtId);
    },
    enabled: !!districtId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

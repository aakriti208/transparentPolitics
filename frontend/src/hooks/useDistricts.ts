/**
 * Custom hooks for district data
 */
import { useQuery } from '@tanstack/react-query';
import { districtsApi } from '../services/api';
import { District, Candidate } from '../types';

/**
 * Hook to fetch all districts
 */
export const useDistricts = () => {
  return useQuery<District[], Error>({
    queryKey: ['districts'],
    queryFn: districtsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a specific district by ID
 */
export const useDistrict = (districtId: string | null) => {
  return useQuery<District, Error>({
    queryKey: ['district', districtId],
    queryFn: () => districtsApi.getById(districtId!),
    enabled: !!districtId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch candidates for a district
 */
export const useDistrictCandidates = (districtId: string | null) => {
  return useQuery<Candidate[], Error>({
    queryKey: ['districtCandidates', districtId],
    queryFn: () => districtsApi.getCandidates(districtId!),
    enabled: !!districtId,
    staleTime: 5 * 60 * 1000,
  });
};

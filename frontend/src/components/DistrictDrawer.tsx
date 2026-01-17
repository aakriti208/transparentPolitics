/**
 * DistrictDrawer Component - Slide-in drawer showing district information and candidates
 */
import React from 'react';
import { useDistrict, useDistrictCandidates } from '../hooks/useDistricts';
import CandidateCard from './CandidateCard';
import { Candidate } from '../types';

interface DistrictDrawerProps {
  districtId: string | null;
  onClose: () => void;
  onCandidateClick: (candidateId: string) => void;
}

const DistrictDrawer: React.FC<DistrictDrawerProps> = ({
  districtId,
  onClose,
  onCandidateClick,
}) => {
  const { data: district, isLoading: districtLoading } = useDistrict(districtId);
  const { data: candidates, isLoading: candidatesLoading } =
    useDistrictCandidates(districtId);

  const isOpen = !!districtId;

  if (!isOpen) return null;

  const currentCandidates =
    candidates?.filter((c: Candidate) => c.status === 'current') || [];
  const futureCandidates =
    candidates?.filter((c: Candidate) => c.status === 'future') || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-start z-10">
          <div className="flex-1">
            {districtLoading ? (
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900">
                  {district?.name}
                </h2>
                <p className="text-sm text-gray-600">{district?.state}</p>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close drawer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* District Information */}
        {district && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Population</p>
                <p className="text-lg font-semibold">
                  {district.population.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  Median Income
                </p>
                <p className="text-lg font-semibold">
                  ${district.median_income.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Candidates */}
        <div className="p-4">
          {candidatesLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Current Representatives */}
              {currentCandidates.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    Current Representative
                    {currentCandidates.length > 1 ? 's' : ''}
                  </h3>
                  <div className="space-y-3">
                    {currentCandidates.map((candidate: Candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onClick={() => onCandidateClick(candidate.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Future Candidates */}
              {futureCandidates.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    Candidates
                  </h3>
                  <div className="space-y-3">
                    {futureCandidates.map((candidate: Candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onClick={() => onCandidateClick(candidate.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {candidates?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No candidates found for this district
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DistrictDrawer;

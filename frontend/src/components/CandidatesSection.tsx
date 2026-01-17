/**
 * CandidatesSection Component - Section showing district information and candidates
 */
import React, { useState } from 'react';
import { useDistrict, useDistrictCandidates } from '../hooks/useDistricts';
import CandidateCard from './CandidateCard';
import CandidateModal from './CandidateModal';
import { Candidate } from '../types';

interface CandidatesSectionProps {
  districtId: string | null;
}

const CandidatesSection: React.FC<CandidatesSectionProps> = ({ districtId }) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const { data: district, isLoading: districtLoading } = useDistrict(districtId);
  const { data: candidates, isLoading: candidatesLoading } = useDistrictCandidates(districtId);

  // Don't show section if no district is selected
  if (!districtId) {
    return (
      <div className="w-full bg-gray-50 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-400 mb-2">
            Select a district on the map
          </h2>
          <p className="text-gray-500">
            Click on any district marker to view representatives and candidates
          </p>
        </div>
      </div>
    );
  }

  const currentCandidates = candidates?.filter((c: Candidate) => c.status === 'current') || [];
  const futureCandidates = candidates?.filter((c: Candidate) => c.status === 'future') || [];

  return (
    <>
      <div className="w-full bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* District Header */}
          <div className="mb-8">
            {districtLoading ? (
              <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse mb-2" />
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {district?.name}
                </h2>
                <p className="text-lg text-gray-600">{district?.state}</p>
              </>
            )}
          </div>

          {/* District Information */}
          {district && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                District Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">Population</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {district.population.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">Median Income</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${district.median_income.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Candidates */}
          <div>
            {candidatesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* Current Representatives */}
                {currentCandidates.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                      Current Representative{currentCandidates.length > 1 ? 's' : ''}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentCandidates.map((candidate: Candidate) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          onClick={() => setSelectedCandidateId(candidate.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Future Candidates */}
                {futureCandidates.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                      Candidates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {futureCandidates.map((candidate: Candidate) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          onClick={() => setSelectedCandidateId(candidate.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {candidates?.length === 0 && (
                  <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <p className="text-lg text-gray-500">
                      No candidates found for this district
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Modal */}
      <CandidateModal
        candidateId={selectedCandidateId}
        onClose={() => setSelectedCandidateId(null)}
      />
    </>
  );
};

export default CandidatesSection;

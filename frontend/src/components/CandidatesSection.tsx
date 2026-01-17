/**
 * CandidatesSection Component - Section showing district information and candidates
 */
import React from 'react';
import { useDistrict, useDistrictCandidates } from '../hooks/useDistricts';
import CandidateCard from './CandidateCard';
import { Candidate } from '../types';

interface CandidatesSectionProps {
  districtId: string | null;
  onCandidateClick: (candidateId: string) => void;
}

const CandidatesSection: React.FC<CandidatesSectionProps> = ({ districtId, onCandidateClick }) => {
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

          {/* Candidates - Two Column Layout */}
          <div>
            {candidatesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse mb-4" />
                  <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
                </div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse mb-4" />
                  <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            ) : (
              <>
                {candidates?.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <p className="text-lg text-gray-500">
                      No candidates found for this district
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Current in Office */}
                    <div>
                      <h3 className="text-2xl font-semibold mb-6 text-gray-900 border-b-2 border-blue-600 pb-2">
                        Current in Office
                      </h3>
                      {currentCandidates.length > 0 ? (
                        <div className="space-y-4">
                          {currentCandidates.map((candidate: Candidate) => (
                            <CandidateCard
                              key={candidate.id}
                              candidate={candidate}
                              onClick={() => onCandidateClick(candidate.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">No current representative</p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Future Candidates */}
                    <div>
                      <h3 className="text-2xl font-semibold mb-6 text-gray-900 border-b-2 border-green-600 pb-2">
                        Future Candidates
                      </h3>
                      {futureCandidates.length > 0 ? (
                        <div className="space-y-4">
                          {futureCandidates.map((candidate: Candidate) => (
                            <CandidateCard
                              key={candidate.id}
                              candidate={candidate}
                              onClick={() => onCandidateClick(candidate.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">No future candidates</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidatesSection;

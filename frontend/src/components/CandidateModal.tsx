/**
 * CandidateModal Component - Detailed candidate information modal
 */
import React from 'react';
import { useCandidate } from '../hooks/useCandidates';
import { getPartyColor, getPartyBgColor } from '../utils/partyColors';

interface CandidateModalProps {
  candidateId: string | null;
  onClose: () => void;
}

const CandidateModal: React.FC<CandidateModalProps> = ({
  candidateId,
  onClose,
}) => {
  const { data: candidate, isLoading } = useCandidate(candidateId);

  const isOpen = !!candidateId;

  if (!isOpen) return null;

  const partyColor = candidate ? getPartyColor(candidate.party) : '';
  const partyBgColor = candidate ? getPartyBgColor(candidate.party) : '';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="p-8 space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : candidate ? (
            <>
              {/* Header */}
              <div className="relative">
                <div
                  className="h-32"
                  style={{ backgroundColor: partyBgColor }}
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 bg-white rounded-full p-2"
                  aria-label="Close modal"
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

                {/* Profile Section */}
                <div className="px-6 pb-6">
                  <div className="flex items-start gap-4 -mt-12">
                    <img
                      src={candidate.image_url}
                      alt={candidate.name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    <div className="mt-12 flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {candidate.name}
                      </h2>
                      <div className="flex gap-2 mt-2">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: partyBgColor,
                            color: partyColor,
                          }}
                        >
                          {candidate.party}
                        </span>
                        {candidate.status === 'current' && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Current Representative
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 space-y-6">
                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Biography
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {candidate.bio}
                  </p>
                </div>

                {/* Contact */}
                {(candidate.website || candidate.email) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Contact
                    </h3>
                    <div className="space-y-1">
                      {candidate.website && (
                        <p className="text-sm">
                          <span className="text-gray-600">Website:</span>{' '}
                          <a
                            href={candidate.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {candidate.website}
                          </a>
                        </p>
                      )}
                      {candidate.email && (
                        <p className="text-sm">
                          <span className="text-gray-600">Email:</span>{' '}
                          <a
                            href={`mailto:${candidate.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {candidate.email}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Campaign Funding */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Campaign Funding
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mb-3">
                    ${candidate.funding.total.toLocaleString()}
                  </p>
                  <div className="space-y-2">
                    {candidate.funding.sources.map((source, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {source.name}
                          </p>
                          <p className="text-xs text-gray-500 uppercase">
                            {source.type}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${source.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voting Record */}
                {candidate.voting_record && candidate.voting_record.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Recent Voting Record
                    </h3>
                    <div className="space-y-2">
                      {candidate.voting_record.map((vote, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {vote.bill_name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {vote.bill_id} • {vote.date}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                                vote.vote === 'yes'
                                  ? 'bg-green-100 text-green-800'
                                  : vote.vote === 'no'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {vote.vote}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Candidate not found
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CandidateModal;

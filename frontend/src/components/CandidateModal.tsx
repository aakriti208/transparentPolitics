/**
 * CandidateModal Component - Detailed candidate information modal
 */
import React, { useState, useEffect } from 'react';
import { useCandidate } from '../hooks/useCandidates';
import { getPartyColor, getPartyBgColor } from '../utils/partyColors';
import { votesApi } from '../services/api';
import { CandidateVote } from '../types';

interface CandidateModalProps {
  candidateId: string | null;
  onClose: () => void;
}

const CandidateModal: React.FC<CandidateModalProps> = ({
  candidateId,
  onClose,
}) => {
  const { data: candidate, isLoading } = useCandidate(candidateId);
  const [votes, setVotes] = useState<CandidateVote[]>([]);
  const [votesLoading, setVotesLoading] = useState(false);

  const isOpen = !!candidateId;

  // Fetch votes when candidate changes
  useEffect(() => {
    const fetchVotes = async () => {
      if (!candidateId) return;

      try {
        setVotesLoading(true);
        const data = await votesApi.getCandidateVotes(candidateId);
        setVotes(data);
      } catch (error) {
        console.error('Error fetching votes:', error);
        setVotes([]);
      } finally {
        setVotesLoading(false);
      }
    };

    fetchVotes();
  }, [candidateId]);

  if (!isOpen) return null;

  const partyColor = candidate ? getPartyColor(candidate.party) : '';
  const partyBgColor = candidate ? getPartyBgColor(candidate.party) : '';

  // Topic color mapping (same as PolicyImpactDashboard)
  const getTopicColor = (topic: string) => {
    const colors: { [key: string]: string } = {
      'Healthcare': '#3b82f6',
      'Climate & Environment': '#10b981',
      'Tax & Economy': '#f59e0b',
      'Defense & Security': '#ef4444',
      'Infrastructure': '#8b5cf6',
      'Budget & Spending': '#06b6d4',
      'Other': '#6b7280'
    };
    return colors[topic] || colors['Other'];
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
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
              {/* Close Button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
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
              </div>

              {/* Top Section: Image and Basic Info */}
              <div className="px-8 pb-6">
                <div className="flex gap-6">
                  {/* Image on leftmost corner */}
                  <div className="flex-shrink-0">
                    <img
                      src={candidate.image_url}
                      alt={candidate.name}
                      className="w-32 h-32 rounded-lg object-cover shadow-lg"
                    />
                  </div>

                  {/* Three rows of information */}
                  <div className="flex-1 flex flex-col justify-center space-y-3">
                    {/* Row 1: Name */}
                    <h2 className="text-3xl font-bold text-gray-900">
                      {candidate.name}
                    </h2>

                    {/* Row 2: Political Affiliation */}
                    <div className="flex items-center gap-3">
                      <span
                        className="px-4 py-1.5 rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: partyBgColor,
                          color: partyColor,
                        }}
                      >
                        {candidate.party}
                      </span>
                      {candidate.status === 'current' && (
                        <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          Current Representative
                        </span>
                      )}
                    </div>

                    {/* Row 3: Highlights */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Key Highlights</p>
                      <p className="text-sm text-blue-800">
                        {candidate.bio.split('.')[0]}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 mx-8"></div>

              {/* Bottom Section: Two Columns */}
              <div className="px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Current Policies */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Current Policies
                    </h3>

                    {/* Biography/Platform */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase">
                        Platform
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {candidate.bio}
                      </p>
                    </div>

                    {/* Policy Impact - Voting Record */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase flex items-center justify-between">
                        <span>Impact of Policies</span>
                        {candidate.status === 'current' && (
                          <span className="text-xs font-normal text-gray-500 normal-case">
                            {votes.length} votes recorded
                          </span>
                        )}
                      </h4>
                      {votesLoading ? (
                        <div className="space-y-2">
                          <div className="h-20 bg-gray-200 rounded animate-pulse" />
                          <div className="h-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                      ) : votes.length > 0 ? (
                        <div className="space-y-3">
                          {votes.map((vote) => (
                            <div
                              key={vote.vote_id}
                              className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              {/* Topic Badge */}
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <span
                                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: `${getTopicColor(vote.bill.topic)}20`,
                                    color: getTopicColor(vote.bill.topic)
                                  }}
                                >
                                  {vote.bill.topic}
                                </span>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    vote.vote_choice.toLowerCase() === 'yes'
                                      ? 'bg-green-100 text-green-800'
                                      : vote.vote_choice.toLowerCase() === 'no'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {vote.vote_choice}
                                </span>
                              </div>

                              {/* Bill Info */}
                              <div className="mb-2">
                                <p className="font-semibold text-gray-900 text-sm mb-1">
                                  {vote.bill.bill_code}
                                </p>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {vote.bill.simple_summary || vote.bill.official_title}
                                </p>
                              </div>

                              {/* Vote Notes */}
                              {vote.notes && (
                                <div className="mb-2 pl-3 border-l-2 border-blue-300">
                                  <p className="text-xs text-gray-600 italic">
                                    "{vote.notes}"
                                  </p>
                                </div>
                              )}

                              {/* Footer */}
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-500">
                                  {new Date(vote.vote_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                                {vote.bill.full_text_url && (
                                  <a
                                    href={vote.bill.full_text_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                  >
                                    View Bill
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : candidate.status === 'current' ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                          <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-sm text-gray-600">No voting record available</p>
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-700">
                            Candidate is running for office. Voting record will be available once elected.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Contact Information */}
                    {(candidate.website || candidate.email) && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase">
                          Contact
                        </h4>
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
                  </div>

                  {/* Right Column: Impact of Policies (Box) */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Impact of Policies
                    </h3>

                    {/* Campaign Funding Impact */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                        Campaign Funding
                      </h4>
                      <div className="bg-white rounded-lg p-4 shadow-sm mb-3">
                        <p className="text-2xl font-bold text-gray-900">
                          ${candidate.funding.total.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Total Raised</p>
                      </div>
                      <div className="space-y-2">
                        {candidate.funding.sources.map((source, index) => (
                          <div
                            key={index}
                            className="bg-white rounded p-3 shadow-sm"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">
                                  {source.name}
                                </p>
                                <p className="text-xs text-gray-500 uppercase">
                                  {source.type}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900 text-sm">
                                ${source.amount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Statistics */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                        Key Statistics
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="text-sm text-gray-600">Funding Sources</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {candidate.funding.sources.length}
                          </span>
                        </div>
                        {candidate.status === 'current' && (
                          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <span className="text-sm text-gray-600">Recorded Votes</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {votesLoading ? '...' : votes.length}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Status</span>
                          <span className="text-sm font-semibold text-gray-900 capitalize">
                            {candidate.status === 'current' ? 'Current Representative' : 'Running for Office'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

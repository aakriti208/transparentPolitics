/**
 * CandidateCard Component - Summary card for a candidate
 */
import React from 'react';
import { Candidate } from '../types';
import { getPartyColor, getPartyBgColor } from '../utils/partyColors';

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onClick }) => {
  const partyColor = getPartyColor(candidate.party);
  const partyBgColor = getPartyBgColor(candidate.party);

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="flex items-start gap-3">
        {/* Profile Image */}
        <img
          src={candidate.image_url}
          alt={candidate.name}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
        />

        {/* Candidate Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {candidate.name}
          </h4>

          {/* Party Badge */}
          <div
            className="inline-block px-2 py-1 rounded text-xs font-medium mt-1"
            style={{
              backgroundColor: partyBgColor,
              color: partyColor,
            }}
          >
            {candidate.party}
          </div>

          {/* Status Badge */}
          {candidate.status === 'current' && (
            <div className="inline-block px-2 py-1 rounded text-xs font-medium mt-1 ml-2 bg-green-100 text-green-800">
              Incumbent
            </div>
          )}

          {/* Funding Summary */}
          <p className="text-sm text-gray-600 mt-2">
            Campaign Funding: ${candidate.funding.total.toLocaleString()}
          </p>
        </div>

        {/* Arrow Icon */}
        <svg
          className="w-5 h-5 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
};

export default CandidateCard;

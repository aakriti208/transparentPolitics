/**
 * CandidatesSection Component - Section showing district information and candidates
 */
import React, { useState } from 'react';
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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');

  // Mock reviews data (will be replaced with API call later)
  const mockReviews = [
    {
      id: 1,
      candidateName: "Future Candidate",
      reviewerName: "John Doe",
      rating: 5,
      comment: "Excellent track record on education policy. Looking forward to their representation.",
      date: "2024-01-15"
    },
    {
      id: 2,
      candidateName: "Future Candidate",
      reviewerName: "Jane Smith",
      rating: 4,
      comment: "Strong stance on healthcare, but would like to see more details on infrastructure plans.",
      date: "2024-01-10"
    }
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call to submit review
    console.log('Review submitted:', { reviewerName, reviewRating, reviewText });
    // Reset form
    setReviewText('');
    setReviewRating(5);
    setReviewerName('');
    setShowReviewForm(false);
  };

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
                <div className="relative inline-block group">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 cursor-help">
                    {district?.name}
                  </h2>

                  {/* Tooltip popup */}
                  {district && (
                    <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border-2 border-blue-300 p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="space-y-3">
                        <div className="border-b border-gray-200 pb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{district.name}</h3>
                          <p className="text-sm text-gray-600">{district.state}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-600 uppercase font-medium">Population</p>
                              <p className="text-xl font-bold text-gray-900">{district.population.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-600 uppercase font-medium">Median Income</p>
                              <p className="text-xl font-bold text-gray-900">${district.median_income.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500 text-center italic">
                            View details
                          </p>
                        </div>
                      </div>

                      {/* Arrow pointer */}
                      <div className="absolute -top-2 left-8 w-4 h-4 bg-white border-l-2 border-t-2 border-blue-300 transform rotate-45"></div>
                    </div>
                  )}
                </div>
                <p className="text-lg text-gray-600">{district?.state}</p>
              </>
            )}
          </div>


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
                    {/* Left Column: Future Candidates */}
                    <div>
                      <h3 className="text-2xl font-semibold mb-6 text-gray-900 border-b-2 border-green-600 pb-2">
                        Future Candidates
                      </h3>
                      {futureCandidates.length > 0 ? (
                        <>
                          <div className="space-y-4 mb-8">
                            {futureCandidates.map((candidate: Candidate) => (
                              <CandidateCard
                                key={candidate.id}
                                candidate={candidate}
                                onClick={() => onCandidateClick(candidate.id)}
                              />
                            ))}
                          </div>

                          {/* Reviews Section */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 shadow-md">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-xl font-bold text-gray-900">
                                Candidate Reviews
                              </h4>
                              <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Write Review
                              </button>
                            </div>

                            {/* Review Form */}
                            {showReviewForm && (
                              <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                                <form onSubmit={handleSubmitReview}>
                                  <div className="mb-3">
                                    <label htmlFor="reviewerName" className="block text-sm font-medium text-gray-700 mb-1">
                                      Your Name
                                    </label>
                                    <input
                                      type="text"
                                      id="reviewerName"
                                      value={reviewerName}
                                      onChange={(e) => setReviewerName(e.target.value)}
                                      required
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                      placeholder="Enter your name"
                                    />
                                  </div>

                                  <div className="mb-3">
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                                      Rating
                                    </label>
                                    <div className="flex items-center gap-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          onClick={() => setReviewRating(star)}
                                          className="focus:outline-none"
                                        >
                                          <svg
                                            className={`w-6 h-6 ${
                                              star <= reviewRating
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                            />
                                          </svg>
                                        </button>
                                      ))}
                                      <span className="text-sm text-gray-600 ml-2">
                                        {reviewRating} {reviewRating === 1 ? 'star' : 'stars'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mb-3">
                                    <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">
                                      Your Review
                                    </label>
                                    <textarea
                                      id="reviewText"
                                      value={reviewText}
                                      onChange={(e) => setReviewText(e.target.value)}
                                      required
                                      rows={4}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                      placeholder="Share your thoughts about this candidate..."
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      type="submit"
                                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                      Submit Review
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setShowReviewForm(false)}
                                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              </div>
                            )}

                            {/* Existing Reviews */}
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {mockReviews.length > 0 ? (
                                mockReviews.map((review) => (
                                  <div key={review.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <p className="font-semibold text-gray-900 text-sm">
                                          {review.reviewerName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {new Date(review.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                          })}
                                        </p>
                                      </div>
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                          <svg
                                            key={i}
                                            className={`w-4 h-4 ${
                                              i < review.rating
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                            />
                                          </svg>
                                        ))}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {review.comment}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                                  <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                  </svg>
                                  <p className="text-sm text-gray-600">
                                    No reviews yet. Be the first to review!
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">No future candidates</p>
                        </div>
                      )}
                      
                    </div>
                    {/* Right Column: Current in Office */}
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

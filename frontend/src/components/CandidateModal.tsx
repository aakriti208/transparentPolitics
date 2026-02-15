/**
 * CandidateModal Component - Detailed candidate information modal
 */
import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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
  const [isFundingExpanded, setIsFundingExpanded] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isBillTableExpanded, setIsBillTableExpanded] = useState(false);

  const isOpen = !!candidateId;

  // Topic color mapping (same as PolicyImpactDashboard)
  const TOPIC_COLORS: { [key: string]: string } = {
    'Healthcare': '#3b82f6',
    'Climate & Environment': '#10b981',
    'Tax & Economy': '#f59e0b',
    'Defense & Security': '#ef4444',
    'Infrastructure': '#8b5cf6',
    'Budget & Spending': '#06b6d4',
    'Other': '#6b7280'
  };

  const getTopicColor = (topic: string) => {
    return TOPIC_COLORS[topic] || TOPIC_COLORS['Other'];
  };

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

  // Calculate pie chart data from votes
  interface PieChartData {
    name: string;
    value: number;
    color: string;
  }

  const pieChartData: PieChartData[] = useMemo(() => {
    if (!votes || votes.length === 0) return [];

    const topicCounts = votes.reduce((acc, vote) => {
      const topic = vote.bill.topic;
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(topicCounts).map(([name, value]) => ({
      name,
      value,
      color: getTopicColor(name)
    }));
  }, [votes]);

  // Filter votes by selected topic
  const filteredVotes = useMemo(() => {
    if (!selectedTopic) return [];
    return votes.filter(vote => vote.bill.topic === selectedTopic);
  }, [votes, selectedTopic]);

  // Handle pie chart slice click
  const handlePieClick = (data: PieChartData) => {
    if (selectedTopic === data.name) {
      // Deselect if clicking the same slice
      setSelectedTopic(null);
      setIsBillTableExpanded(false);
    } else {
      setSelectedTopic(data.name);
      setIsBillTableExpanded(true);
    }
  };

  if (!isOpen) return null;

  const partyColor = candidate ? getPartyColor(candidate.party) : '';
  const partyBgColor = candidate ? getPartyBgColor(candidate.party) : '';

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

              {/* Bottom Section: Full Width Impact of Policies */}
              <div className="px-8 py-6">
                <div className="w-full">
                  {/* Impact of Policies - Full Width */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Impact of Policies
                    </h3>

                    {/* Pie Chart Visualization */}
                    {votesLoading ? (
                      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                        <div className="h-64 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ) : pieChartData.length > 0 ? (
                      <>
                        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase text-center">
                            Votes by Topic
                            <span className="text-xs font-normal text-gray-500 normal-case ml-2">
                              ({votes.length} total votes)
                            </span>
                          </h4>
                          <p className="text-xs text-center text-gray-500 mb-3">
                            Click on a slice to view bills for that topic
                          </p>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                onClick={(data) => handlePieClick(data)}
                                style={{ cursor: 'pointer' }}
                              >
                                {pieChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    opacity={selectedTopic && selectedTopic !== entry.name ? 0.3 : 1}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value: number | undefined) => {
                                  if (value === undefined) return ['', ''];
                                  return [`${value} bills`, 'Count'];
                                }}
                              />
                              <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => <span className="text-xs">{value}</span>}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Interactive Bill Table */}
                        {selectedTopic && isBillTableExpanded && (
                          <div className="bg-white rounded-lg shadow-sm mb-6 border-2 border-blue-300">
                            <button
                              onClick={() => setIsBillTableExpanded(!isBillTableExpanded)}
                              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className="inline-flex items-center px-3 py-1 rounded text-sm font-medium"
                                  style={{
                                    backgroundColor: `${getTopicColor(selectedTopic)}20`,
                                    color: getTopicColor(selectedTopic)
                                  }}
                                >
                                  {selectedTopic}
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {filteredVotes.length} {filteredVotes.length === 1 ? 'Bill' : 'Bills'}
                                </span>
                              </div>
                              <svg
                                className={`w-5 h-5 transition-transform ${isBillTableExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {isBillTableExpanded && (
                              <div className="border-t border-gray-200">
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Topic
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Bill Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Summary
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Vote
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Details
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {filteredVotes.map((vote) => (
                                        <tr key={vote.vote_id} className="hover:bg-gray-50 transition-colors">
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            <span
                                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                                              style={{
                                                backgroundColor: `${getTopicColor(vote.bill.topic)}20`,
                                                color: getTopicColor(vote.bill.topic)
                                              }}
                                            >
                                              {vote.bill.topic}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4">
                                            <p className="text-sm font-semibold text-gray-900">
                                              {vote.bill.bill_code}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {new Date(vote.vote_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                              })}
                                            </p>
                                          </td>
                                          <td className="px-4 py-4 max-w-md">
                                            <p className="text-sm text-gray-700 line-clamp-3">
                                              {vote.bill.simple_summary || vote.bill.official_title}
                                            </p>
                                            {vote.notes && (
                                              <p className="text-xs text-gray-500 italic mt-1">
                                                Note: {vote.notes}
                                              </p>
                                            )}
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
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
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap">
                                            {vote.bill.full_text_url && (
                                              <a
                                                href={vote.bill.full_text_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                                              >
                                                View Bill
                                                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                              </a>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : candidate.status === 'current' ? (
                      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                        <div className="text-center py-4">
                          <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-sm text-gray-600">No voting record available</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                        <div className="text-center py-4">
                          <p className="text-sm text-blue-700">
                            Candidate is running for office. Voting record will be available once elected.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Campaign Funding - Collapsible */}
                    <div className="mb-6">
                      <button
                        onClick={() => setIsFundingExpanded(!isFundingExpanded)}
                        className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 mb-3 uppercase hover:text-gray-900 transition-colors"
                      >
                        <span>Campaign Funding</span>
                        <svg
                          className={`w-5 h-5 transition-transform ${isFundingExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isFundingExpanded && (
                        <>
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
                        </>
                      )}
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

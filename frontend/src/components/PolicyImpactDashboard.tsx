/**
 * PolicyImpactDashboard Component
 * Visualizes policy data through an interactive Pie Chart and synchronized Detail Table
 */
import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { billsApi } from '../services/api';
import { Bill, PolicyImpact } from '../types';

// Topic color mapping
const TOPIC_COLORS: { [key: string]: string } = {
  'Healthcare': '#3b82f6',      // Blue
  'Climate & Environment': '#10b981',  // Green
  'Tax & Economy': '#f59e0b',   // Amber
  'Defense & Security': '#ef4444',     // Red
  'Infrastructure': '#8b5cf6',  // Purple
  'Budget & Spending': '#06b6d4',      // Cyan
  'Other': '#6b7280'            // Gray
};

const TOPICS = [
  'Immigration',
  'Foreign Policy',
  'Tax',
  'Education',
  'Healthcare',
  'Business'
];

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface ActiveShape {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: PieChartData;
  percent: number;
  value: number;
}

const PolicyImpactDashboard: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Fetch bills data
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const data = await billsApi.getAll();
        setBills(data);
      } catch (err) {
        console.error('Error fetching bills:', err);
        setError('Failed to load bill data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  // Transform bills to policy impacts
  const policyImpacts: PolicyImpact[] = useMemo(() => {
    return bills.map(bill => {
      // Determine vote result
      let voteResult = 'Pending';
      if (bill.status === 'Enacted') {
        voteResult = 'Passed';
      } else if (bill.status === 'Failed') {
        voteResult = 'Failed';
      } else if (bill.vote_result_yes > bill.vote_result_no) {
        voteResult = 'Passed';
      } else if (bill.vote_result_no > bill.vote_result_yes) {
        voteResult = 'Failed';
      }

      return {
        topic: bill.topic,
        billName: bill.bill_code,
        description: bill.simple_summary || bill.official_title,
        voteResult: voteResult,
        officialLink: bill.full_text_url || `https://www.congress.gov/bill/${bill.congress_session}th-congress/house-bill/${bill.bill_code.toLowerCase().replace('h.r.', '')}`
      };
    });
  }, [bills]);

  // Calculate pie chart data
  const pieChartData: PieChartData[] = useMemo(() => {
    const topicCounts = policyImpacts.reduce((acc, policy) => {
      acc[policy.topic] = (acc[policy.topic] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(topicCounts).map(([name, value]) => ({
      name,
      value,
      color: TOPIC_COLORS[name] || TOPIC_COLORS['Other']
    }));
  }, [policyImpacts]);

  // Filter policies by selected topic
  const filteredPolicies = useMemo(() => {
    if (!selectedTopic) return policyImpacts;
    return policyImpacts.filter(policy => policy.topic === selectedTopic);
  }, [policyImpacts, selectedTopic]);

  // Handle pie chart click
  const handlePieClick = (data: PieChartData, index: number) => {
    if (selectedTopic === data.name) {
      // Deselect if clicking the same slice
      setSelectedTopic(null);
      setActiveIndex(null);
    } else {
      setSelectedTopic(data.name);
      setActiveIndex(index);
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === '') {
      setSelectedTopic(null);
      setActiveIndex(null);
    } else {
      setSelectedTopic(value);
      const index = pieChartData.findIndex(d => d.name === value);
      setActiveIndex(index);
    }
  };

  // Custom active shape renderer for highlighting
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-semibold">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs">
          {`${value} bills`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading policy data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Policy Impact Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Interactive visualization of legislative bills by policy topic
          </p>
        </div>

        {/* Pie Chart Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Bills by Topic
          </h2>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={(data, index) => handlePieClick(data, index)}
                  style={{ cursor: 'pointer' }}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={activeIndex !== null && activeIndex !== index ? 0.6 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined, name: string | undefined) => {
                    if (value === undefined || name === undefined) return ['', ''];
                    return [`${value} bills`, name];
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {selectedTopic && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setSelectedTopic(null);
                  setActiveIndex(null);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Show All Topics
              </button>
            </div>
          )}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Bill Details
              {selectedTopic && (
                <span className="ml-2 text-base font-normal text-gray-600">
                  - Filtered by {selectedTopic}
                </span>
              )}
            </h2>

            {/* Dropdown Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="topic-filter" className="text-sm font-medium text-gray-700">
                Filter by Topic:
              </label>
              <select
                id="topic-filter"
                value={selectedTopic || ''}
                onChange={handleDropdownChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">All Topics</option>
                {pieChartData.map((topic) => (
                  <option key={topic.name} value={topic.name}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Empty State */}
          {filteredPolicies.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bills found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No bills match the selected topic.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Simple Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vote Result
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPolicies.map((policy, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${TOPIC_COLORS[policy.topic] || TOPIC_COLORS['Other']}20`,
                            color: TOPIC_COLORS[policy.topic] || TOPIC_COLORS['Other']
                          }}
                        >
                          {policy.topic}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {policy.billName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                        <div className="line-clamp-2">
                          {policy.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            policy.voteResult === 'Passed'
                              ? 'bg-green-100 text-green-800'
                              : policy.voteResult === 'Failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {policy.voteResult}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={policy.officialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                          View Details
                          <svg
                            className="ml-2 -mr-1 w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {filteredPolicies.length} of {policyImpacts.length} bills
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyImpactDashboard;

/**
 * TypeScript type definitions for the Political Transparency application
 */

export interface Geometry {
  type: string;
  coordinates: number[][][];
}

export interface District {
  id: string;
  name: string;
  state: string;
  geometry: Geometry;
  population: number;
  median_income: number;
}

export interface FundingSource {
  name: string;
  amount: number;
  type: 'individual' | 'PAC' | 'party';
}

export interface Funding {
  total: number;
  sources: FundingSource[];
}

export interface VotingRecord {
  bill_id: string;
  bill_name: string;
  vote: 'yes' | 'no' | 'abstain';
  date: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  district_id: string;
  status: 'current' | 'future';
  image_url: string;
  bio: string;
  voting_record: VotingRecord[] | null;
  funding: Funding;
  website?: string;
  email?: string;
}

export interface CandidateSummary {
  id: string;
  name: string;
  party: string;
  district_id: string;
  status: 'current' | 'future';
  image_url: string;
}

export type PartyColor = {
  [key: string]: {
    primary: string;
    light: string;
    dark: string;
  };
};

export interface Bill {
  bill_id: number;
  bill_code: string;
  official_title: string;
  simple_summary: string;
  full_text_url: string | null;
  status: string;
  congress_session: number | null;
  introduced_date: string | null;
  vote_date: string | null;
  vote_result_yes: number;
  vote_result_no: number;
  vote_result_present: number;
  vote_result_absent: number;
  topic: string;
  topics: string[];
}

export interface PolicyImpact {
  topic: string;
  billName: string;
  description: string;
  voteResult: string;
  officialLink: string;
}

export interface CandidateVote {
  vote_id: number;
  vote_choice: string;
  vote_date: string;
  notes: string | null;
  bill: {
    bill_id: number;
    bill_code: string;
    official_title: string;
    simple_summary: string;
    status: string;
    topic: string;
    full_text_url: string | null;
  };
}

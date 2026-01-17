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

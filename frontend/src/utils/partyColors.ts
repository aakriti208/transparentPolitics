/**
 * Party color definitions for consistent styling
 */
import { PartyColor } from '../types';

export const PARTY_COLORS: PartyColor = {
  Democratic: {
    primary: '#2563eb', // blue-600
    light: '#dbeafe', // blue-50
    dark: '#1e40af', // blue-800
  },
  Republican: {
    primary: '#dc2626', // red-600
    light: '#fee2e2', // red-50
    dark: '#991b1b', // red-800
  },
  Independent: {
    primary: '#7c3aed', // violet-600
    light: '#ede9fe', // violet-50
    dark: '#5b21b6', // violet-800
  },
  Green: {
    primary: '#16a34a', // green-600
    light: '#dcfce7', // green-50
    dark: '#166534', // green-800
  },
  Libertarian: {
    primary: '#ca8a04', // yellow-600
    light: '#fef9c3', // yellow-50
    dark: '#854d0e', // yellow-800
  },
};

/**
 * Get party color by party name
 */
export const getPartyColor = (party: string): string => {
  return PARTY_COLORS[party]?.primary || '#6b7280'; // gray-500 as default
};

/**
 * Get party background color (light variant)
 */
export const getPartyBgColor = (party: string): string => {
  return PARTY_COLORS[party]?.light || '#f3f4f6'; // gray-100 as default
};

/**
 * Get party dark color
 */
export const getPartyDarkColor = (party: string): string => {
  return PARTY_COLORS[party]?.dark || '#374151'; // gray-700 as default
};

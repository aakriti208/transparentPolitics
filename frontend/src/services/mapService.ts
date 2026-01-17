/**
 * Map service utilities for Leaflet
 */
import { District } from '../types';

/**
 * Convert districts array to GeoJSON FeatureCollection
 */
export const districtsToGeoJSON = (districts: District[]): GeoJSON.FeatureCollection => {
  return {
    type: 'FeatureCollection',
    features: districts.map((district) => ({
      type: 'Feature',
      id: district.id,
      properties: {
        id: district.id,
        name: district.name,
        state: district.state,
        population: district.population,
        median_income: district.median_income,
      },
      geometry: district.geometry as GeoJSON.Geometry,
    })),
  };
};

/**
 * Get default map center and zoom
 */
export const getDefaultMapConfig = () => {
  return {
    center: [39.8283, -98.5795] as [number, number], // Center of US (lat, lng for Leaflet)
    zoom: 4,
  };
};

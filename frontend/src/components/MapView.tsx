/**
 * MapView Component - Interactive Leaflet map with district boundaries
 */
import React, { useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useDistricts } from '../hooks/useDistricts';
import { districtsToGeoJSON, getDefaultMapConfig } from '../services/mapService';

interface MapViewProps {
  onDistrictClick: (districtId: string) => void;
}

// Component to handle map events
const MapEvents: React.FC<{ onDistrictClick: (districtId: string) => void }> = ({
  onDistrictClick,
}) => {
  const map = useMap();

  return null;
};

const MapView: React.FC<MapViewProps> = ({ onDistrictClick }) => {
  const { data: districts, isLoading, error } = useDistricts();
  const hoveredLayerRef = useRef<L.Layer | null>(null);

  const { center, zoom } = getDefaultMapConfig();

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const districtId = feature.properties?.id;
    const districtName = feature.properties?.name;

    // Hover effects
    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          fillOpacity: 0.5,
        });

        if (hoveredLayerRef.current) {
          hoveredLayerRef.current = target;
        }

        // TODO: Implement tooltip component
        console.log('Hovering over:', districtName);
      },
      mouseout: (e) => {
        const target = e.target;
        target.setStyle({
          fillOpacity: 0.2,
        });
      },
      click: () => {
        if (districtId) {
          onDistrictClick(districtId);
        }
      },
    });
  };

  const style = {
    fillColor: '#627BC1',
    weight: 2,
    opacity: 1,
    color: '#627BC1',
    fillOpacity: 0.2,
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-red-600">
          Error loading districts: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {districts && (
          <GeoJSON
            data={districtsToGeoJSON(districts)}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}

        <MapEvents onDistrictClick={onDistrictClick} />
      </MapContainer>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-gray-600">Loading districts...</div>
        </div>
      )}

      {/* Map Controls/Legend */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
        <h2 className="text-lg font-semibold mb-2">
          Congressional Districts
        </h2>
        <p className="text-sm text-gray-600">
          Click on a district to view candidates
        </p>
      </div>
    </div>
  );
};

export default MapView;

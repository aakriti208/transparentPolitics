/**
 * MapView Component - Interactive Leaflet map with district markers
 */
import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useDistricts } from '../hooks/useDistricts';
import { getDefaultMapConfig } from '../services/mapService';

interface MapViewProps {
  onDistrictClick: (districtId: string) => void;
}

// Generate different shades of red for each district
const getRedShade = (index: number, total: number): string => {
  // Generate colors from dark red to light red/pink
  const hue = 0; // Red hue
  const saturation = 70 + (index % 5) * 5; // Vary saturation
  const lightness = 35 + (index * 40) / total; // Vary lightness from 35% to 75%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const MapView: React.FC<MapViewProps> = ({ onDistrictClick }) => {
  const { data: districtsData, isLoading, error } = useDistricts();

  const { center, zoom } = getDefaultMapConfig();

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-red-600">
          Error loading districts: {error.message}
        </div>
      </div>
    );
  }

  const totalDistricts = districtsData?.features?.length || 0;

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

        {districtsData && districtsData.features && districtsData.features.map((feature: any, index: number) => {
          const [lng, lat] = feature.geometry.coordinates;
          const districtName = feature.properties.name;
          // Extract district number from name (e.g., "District 21" -> "21")
          const districtNumber = districtName.match(/\d+/)?.[0];
          const districtId = districtNumber ? `TX-${districtNumber}` : `district-${index + 1}`;
          const fillColor = getRedShade(index, totalDistricts);

          // Simple display name: "Texas 21"
          const displayName = districtNumber ? `Texas ${districtNumber}` : districtName;

          return (
            <CircleMarker
              key={districtId}
              center={[lat, lng]}
              radius={15}
              pathOptions={{
                fillColor: fillColor,
                fillOpacity: 0.9,
                color: '#8B0000', // Dark red border
                weight: 3,
              }}
              eventHandlers={{
                click: () => onDistrictClick(districtId),
                mouseover: (e) => {
                  e.target.setStyle({
                    fillOpacity: 1,
                    radius: 20,
                    weight: 4,
                  });
                },
                mouseout: (e) => {
                  e.target.setStyle({
                    fillOpacity: 0.9,
                    radius: 15,
                    weight: 3,
                  });
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                <span className="text-sm font-semibold">{displayName}</span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-[1000]">
          <div className="text-gray-600">Loading districts...</div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
        <h3 className="text-sm font-semibold mb-2">Texas Congressional Districts</h3>
        <p className="text-xs text-gray-600">
          {totalDistricts} districts shown
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Click a marker to view candidates
        </p>
      </div>
    </div>
  );
};

export default MapView;

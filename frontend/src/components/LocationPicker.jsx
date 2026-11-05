import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Check } from 'lucide-react';

const pinIcon = L.divIcon({
  className: 'custom-picker-pin',
  html: `
    <div style="
      background-color: #f97316;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    ">
      <span style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 14px;">📍</span>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const MapEvents = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const LocationPicker = ({
  initialLat = 28.6139,
  initialLng = 77.2090,
  onLocationSelect,
  city = 'Metropolis',
  address = '',
}) => {
  const [position, setPosition] = useState([initialLat, initialLng]);

  const handleMapClick = (lat, lng) => {
    setPosition([lat, lng]);
    if (onLocationSelect) {
      onLocationSelect(lat, lng);
    }
  };

  // Quick preset neighborhoods
  const presets = [
    { name: 'Metropolis Central', lat: 28.6139, lng: 77.2090 },
    { name: 'North Hills', lat: 28.6250, lng: 77.2180 },
    { name: 'West Valley', lat: 28.6290, lng: 77.1930 },
    { name: 'East Riverview', lat: 28.6040, lng: 77.2380 },
    { name: 'South Gateway', lat: 28.5920, lng: 77.2190 },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-orange-500" />
          Pin Precise Assistance Location on Map
        </label>
        <span className="text-[11px] text-slate-500 font-medium">
          Click map to adjust pin coordinates
        </span>
      </div>

      {/* Preset Neighborhood Quick Select */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[11px] text-slate-400 self-center mr-1">Quick Sectors:</span>
        {presets.map((p) => (
          <button
            type="button"
            key={p.name}
            onClick={() => handleMapClick(p.lat, p.lng)}
            className={`text-[11px] px-2 py-1 rounded-md border font-medium transition ${
              Math.abs(position[0] - p.lat) < 0.001
                ? 'bg-orange-50 text-orange-700 border-orange-300 font-bold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="h-56 w-full rounded-xl overflow-hidden border border-slate-300 relative">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onSelect={handleMapClick} />
          <Marker position={position} icon={pinIcon} />
        </MapContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
        <div>
          <span className="font-semibold text-slate-700">Selected Coordinates:</span>{' '}
          <code>{position[0].toFixed(4)}, {position[1].toFixed(4)}</code>
        </div>
        <div className="text-emerald-600 font-medium flex items-center gap-1">
          <Check className="w-3.5 h-3.5" /> Privacy Shield Enabled (Exact address hidden publicly)
        </div>
      </div>
    </div>
  );
};

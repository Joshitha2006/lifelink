import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom SVG Icons for Leaflet markers
const createCustomIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 13px;
        ">${label || '•'}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const requestIcon = (priority) => {
  let color = '#3b82f6';
  if (priority === 'Critical') color = '#dc2626';
  else if (priority === 'High') color = '#f97316';
  else if (priority === 'Medium') color = '#eab308';
  return createCustomIcon(color, '!');
};

const centerIcon = createCustomIcon('#0d9488', 'H');
const volunteerIcon = createCustomIcon('#6366f1', 'V');
const donationIcon = createCustomIcon('#10b981', 'D');

// Component to recenter map dynamically when markers change
const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
};

export const MapViewer = ({
  center = [28.6139, 77.2090],
  zoom = 13,
  requests = [],
  supportCenters = [],
  donations = [],
  volunteers = [],
  selectedPoint = null,
  onMarkerClick = null,
  height = '500px',
}) => {
  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedPoint && (
          <RecenterAutomatically lat={selectedPoint[0]} lng={selectedPoint[1]} />
        )}

        {/* Support Centers */}
        {supportCenters.map((c) => (
          <Marker
            key={c._id || c.name}
            position={[c.lat, c.lng]}
            icon={centerIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick({ type: 'center', data: c }),
            }}
          >
            <Popup>
              <div className="p-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                  {c.type}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1">{c.name}</h4>
                <p className="text-xs text-slate-600">{c.address}, {c.city}</p>
                <div className="mt-2 text-xs">
                  <strong>Hours:</strong> {c.operationalHours} | <strong>Capacity:</strong> {c.capacity}
                </div>
                {c.resourcesAvailable && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {c.resourcesAvailable.map((r, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Help Requests (Privacy-protected: approximate location shown) */}
        {requests.map((r) => {
          if (!r.location?.lat || !r.location?.lng) return null;
          return (
            <Marker
              key={r._id}
              position={[r.location.lat, r.location.lng]}
              icon={requestIcon(r.priority)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick({ type: 'request', data: r }),
              }}
            >
              <Popup>
                <div className="p-1 max-w-xs">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                      {r.priority} Priority
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {r.requestId}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{r.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">{r.description}</p>
                  <div className="mt-2 text-[11px] text-slate-500">
                    <strong>Area:</strong> {r.location.city} (Precise address protected)
                  </div>
                  <div className="mt-1">
                    <span className="text-[11px] font-semibold text-teal-600">
                      Status: {r.status}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Resource Donations */}
        {donations.map((d) => {
          if (!d.pickupLocation?.lat || !d.pickupLocation?.lng) return null;
          return (
            <Marker
              key={d._id}
              position={[d.pickupLocation.lat, d.pickupLocation.lng]}
              icon={donationIcon}
            >
              <Popup>
                <div className="p-1">
                  <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    Resource: {d.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{d.title}</h4>
                  <p className="text-xs text-slate-600">Available: {d.quantity} {d.unit}</p>
                  <p className="text-xs text-slate-500 mt-1">Pickup City: {d.pickupLocation.city}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

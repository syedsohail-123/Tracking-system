import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMarkerColor = (type) => {
    switch(type) {
        case 'Start': return '#3b82f6'; // blue
        case 'Pickup': return '#f59e0b'; // amber
        case 'Dropoff': return '#10b981'; // green
        case 'Fuel': return '#ef4444'; // red
        case 'Break': return '#8b5cf6'; // purple
        case 'Rest': return '#6366f1'; // indigo
        default: return '#6b7280'; // gray
    }
};

const createCustomIcon = (type) => {
    const color = getMarkerColor(type);
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });
};

const MapView = ({ mapData }) => {
    // Default center to US
    const defaultCenter = [39.8283, -98.5795];
    const defaultZoom = 4;

    const hasData = mapData && mapData.route_geometry && mapData.route_geometry.length > 0;
    
    // Process route geometries (OpenRouteService returns coordinates as [lon, lat])
    // Leaflet expects [lat, lon]
    let allCoordinates = [];
    if (hasData) {
        mapData.route_geometry.forEach(geom => {
            if (geom && geom.coordinates) {
                const latLons = geom.coordinates.map(c => [c[1], c[0]]);
                allCoordinates.push(latLons);
            }
        });
    }

    // Determine map bounds based on markers
    let bounds = null;
    if (hasData && mapData.markers.length > 0) {
        const markerCoords = mapData.markers.map(m => [m.coordinates[1], m.coordinates[0]]);
        if (markerCoords.length > 0) {
            bounds = L.latLngBounds(markerCoords);
        }
    }

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden shadow-lg border border-slate-100 relative bg-slate-100">
            <MapContainer 
                bounds={bounds} 
                center={bounds ? undefined : defaultCenter} 
                zoom={bounds ? undefined : defaultZoom} 
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                
                {hasData && allCoordinates.map((path, idx) => (
                    <Polyline 
                        key={idx} 
                        positions={path} 
                        color="#14b8a6" 
                        weight={5} 
                        opacity={0.8}
                        lineCap="round"
                    />
                ))}

                {hasData && mapData.markers && mapData.markers.map((marker, idx) => (
                    <Marker 
                        key={idx} 
                        position={[marker.coordinates[1], marker.coordinates[0]]}
                        icon={createCustomIcon(marker.type)}
                    >
                        <Popup>
                            <div className="font-semibold">{marker.type}</div>
                            <div className="text-sm text-slate-600">{marker.description}</div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;

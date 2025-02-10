import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { locations } from '../data/locations';
import { Navigation, MapPin, AlertCircle } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet default icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteProps {
  start: [number, number] | null;
  end: [number, number] | null;
}

function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, 16);
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function RouteLayer({ start, end }: RouteProps) {
  const map = useMap();

  useEffect(() => {
    if (start && end) {
      const bounds = L.latLngBounds([start, end]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [start, end, map]);

  return start && end ? (
    <Polyline
      positions={[start, end]}
      color="blue"
      weight={3}
      opacity={0.7}
      dashArray="10"
    />
  ) : null;
}

export function Map() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted' || result.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation([position.coords.latitude, position.coords.longitude]);
              setLocationError(null);
            },
            (error) => {
              let errorMessage = 'Unable to get your location. ';
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage += 'Please enable location access to use navigation features.';
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage += 'Location information is unavailable.';
                  break;
                case error.TIMEOUT:
                  errorMessage += 'Location request timed out.';
                  break;
                default:
                  errorMessage += 'An unknown error occurred.';
              }
              setLocationError(errorMessage);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        }
      });
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleGetDirections = (coordinates: [number, number]) => {
    if (!userLocation) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation([position.coords.latitude, position.coords.longitude]);
            setSelectedLocation(coordinates);
            setShowDirections(true);
            setLocationError(null);
          },
          () => {
            setLocationError('Please enable location access to use navigation features.');
          }
        );
      } else {
        setLocationError('Geolocation is not supported by your browser.');
      }
    } else {
      setSelectedLocation(coordinates);
      setShowDirections(true);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative">
      {locationError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{locationError}</p>
        </div>
      )}
      <MapContainer
        center={[10.9368, 76.7432]}
        zoom={16}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker key={location.id} position={location.coordinates}>
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{location.name}</h3>
                {location.image && (
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <p className="text-sm mb-3">{location.description}</p>
                <button
                  onClick={() => handleGetDirections(location.coordinates)}
                  className="flex items-center justify-center w-full gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        {showDirections && userLocation && selectedLocation && (
          <RouteLayer start={userLocation} end={selectedLocation} />
        )}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
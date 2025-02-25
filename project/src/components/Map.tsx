"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import GeoJsonLayer from "./GeoJsonLayer";

const overpassUrl =
  "https://overpass-api.de/api/interpreter?data=[out:json];(way[\"highway\"](10.931108646049164,76.73996329307558,10.938261261895269,76.74901843070985););out body;>;out skel qt;";

const userIcon = new L.Icon({
  iconUrl: "/user-location.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const destinationIcon = new L.Icon({
  iconUrl: "/destination.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const UserLocationMarker = ({ setUserPosition }: { setUserPosition: (pos: [number, number]) => void }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPos: [number, number] = [latitude, longitude];
          setPosition(newPos);
          setUserPosition(newPos);
          map.setView(newPos, 16);
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, [map, setUserPosition]);

  return position ? (
    <Marker position={position} icon={userIcon}>
      <Popup>You are here!</Popup>
    </Marker>
  ) : null;
};

const DestinationSelector = ({ setDestination }: { setDestination: (pos: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      setDestination([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
};

const Route = ({ userPosition, destination }: { userPosition: [number, number] | null; destination: [number, number] | null }) => {
  const map = useMap();
  const [route, setRoute] = useState<L.Routing.Control | null>(null);

  useEffect(() => {
    if (userPosition && destination) {
      if (route) {
        map.removeControl(route);
      }

      const newRoute = L.Routing.control({
        waypoints: [L.latLng(userPosition), L.latLng(destination)],
        routeWhileDragging: true,
        lineOptions: { styles: [{ color: "blue", weight: 5 }] },
        createMarker: () => null,
        show: false,
        addWaypoints: false,
        router: L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
          profile: "foot",
          useHints: false,
          allowUTurns: false,
        }),
      }).addTo(map);

      setRoute(newRoute);

      return () => map.removeControl(newRoute);
    }
  }, [userPosition, destination]);

  return null;
};


export function Map() {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white p-3 rounded-lg shadow-md">
        <span>Click on the map to set a destination!</span>
      </div>

      <MapContainer center={[10.9368, 76.7432]} zoom={16} className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <UserLocationMarker setUserPosition={setUserPosition} />
        <DestinationSelector setDestination={setDestination} />
        {destination && <Marker position={destination} icon={destinationIcon}><Popup>Destination</Popup></Marker>}
        {userPosition && destination && <Route userPosition={userPosition} destination={destination} />}
        <GeoJsonLayer overpassUrl={overpassUrl} />
      </MapContainer>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";

interface GeoJsonLayerProps {
  overpassUrl: string;
}

const GeoJsonLayer = ({ overpassUrl }: GeoJsonLayerProps) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const map = useMap();

  useEffect(() => {
    const fetchOverpassData = async () => {
      try {
        const response = await fetch(overpassUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch Overpass data: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data || !data.elements) {
          throw new Error("Invalid Overpass API response");
        }

        // Convert Overpass JSON to GeoJSON (Filtered)
        const geoJson = overpassToGeoJson(data);
        setGeoJsonData(geoJson);

        // Fit map to features
        if (geoJson.features.length > 0) {
          setTimeout(() => {
            const bounds = L.geoJSON(geoJson).getBounds();
            map.fitBounds(bounds, { padding: [50, 50] });
          }, 500);
        }
      } catch (error) {
        console.error("Error loading Overpass data:", error);
      }
    };

    fetchOverpassData();
  }, [overpassUrl]); // Only fetch when URL changes

  return geoJsonData ? (
    <GeoJSON data={geoJsonData} style={{ color: "blue", weight: 3 }} />
  ) : null;
};

// Convert Overpass API response to GeoJSON
const overpassToGeoJson = (overpassData: { elements: any[] }) => {
  const nodes: Record<number, [number, number]> = {};
  const features: any[] = [];

  const allowedWays = new Set([
    899693518, 1072528099, 441055458, 899693521, 899693515, 1341145265,
    1341145264, 899693519, 899693520, 1072528100, 441055454, 1341145266,
    1360672442, 1360671634, 1341145257
  ]);

  // Store all nodes with their coordinates
  overpassData.elements.forEach((element) => {
    if (element.type === "node") {
      nodes[element.id] = [element.lon, element.lat];
    }
  });

  // Convert allowed ways to GeoJSON LineStrings
  overpassData.elements.forEach((element) => {
    if (element.type === "way" && allowedWays.has(element.id)) {
      const coordinates = element.nodes.map((nodeId: number) => nodes[nodeId]).filter(Boolean);

      if (coordinates.length > 1) {
        features.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
          properties: element.tags || {},
        });
      }
    }
  });

  return {
    type: "FeatureCollection",
    features: features,
  };
};

export default GeoJsonLayer;

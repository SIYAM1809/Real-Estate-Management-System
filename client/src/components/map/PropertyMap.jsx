// client/src/components/map/PropertyMap.jsx
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { fixLeafletIcons } from "./leafletIconFix";

export default function PropertyMap({ lat, lng, title }) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return (
      <div className="mt-6 bg-gray-50 border rounded-lg p-4 text-center text-gray-600">
        Map location not provided yet.
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg overflow-hidden border">
      <div style={{ height: 320 }}>
        <MapContainer center={[lat, lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            <Popup>{title || "Land Location"}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

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
      <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400 font-medium">
        Location data unavailable
      </div>
    );
  }

  return (
    <div className="h-full w-full">
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
  );
}

// client/src/components/map/MapPicker.jsx
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { fixLeafletIcons } from "./leafletIconFix";

function ClickToPick({ value, onChange }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  if (!value) return null;
  return <Marker position={[value.lat, value.lng]} />;
}

export default function MapPicker({
  value,
  onChange,
  center = [23.8103, 90.4125], // Dhaka default
  zoom = 12,
  height = 320,
}) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  return (
    <div className="w-full">
      <div className="text-sm text-gray-600 mb-2">
        Click on the map to set land location.
        {value ? (
          <span className="ml-2 font-semibold text-gray-800">
            Selected: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
          </span>
        ) : (
          <span className="ml-2 text-red-600 font-semibold">
            (Not selected)
          </span>
        )}
      </div>

      <div style={{ height }} className="rounded-lg overflow-hidden border">
        <MapContainer center={value ? [value.lat, value.lng] : center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPick value={value} onChange={onChange} />
        </MapContainer>
      </div>
    </div>
  );
}

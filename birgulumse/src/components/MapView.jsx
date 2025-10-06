import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

export function MapView({ latitude, longitude, label }) {
  if (!latitude || !longitude) {
    return (
      <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/50 p-6 text-sm text-brand-600">
        Harita için konum bilgisi bekleniyor. Manuel giriş yapıldıysa sadece metinsel adres paylaşılır.
      </div>
    );
  }

  const position = [latitude, longitude];

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom className="h-64 w-full rounded-3xl">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={markerIcon}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  );
}

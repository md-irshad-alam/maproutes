import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
const FlyToLocation = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 13);
    }
  }, [lat, lng, map]);
  return null;
};
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const RouteMap = ({ origin, destination, routeCoords }) => {
  const mapRef = useRef(null);

  return (
    <MapContainer
      center={[origin?.lat || 0, origin?.lng || 0]}
      zoom={5}
      scrollWheelZoom={true}
      whenCreated={(map) => (mapRef.current = map)}
      className="w-full h-96 rounded-lg shadow"
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Markers */}
      {origin && (
        <Marker position={[origin.lat, origin.lng]}>
          <Popup>Source</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={[destination.lat, destination.lng]}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {/* Real route polyline */}
      {routeCoords && routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" />
      )}

      {/* Auto focus */}
      {origin && <FlyToLocation lat={origin.lat} lng={origin.lng} />}
    </MapContainer>
  );
};

export default RouteMap;

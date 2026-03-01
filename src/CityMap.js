import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function CityMap({ city }) {
  const cityCoords = {
    Delhi: [28.7041, 77.1025],
    Mumbai: [19.0760, 72.8777],
    Chennai: [13.0827, 80.2707],
    Bangalore: [12.9716, 77.5946]
  };

  if (!city) return null;

  return (
    <div style={{ margin: "40px auto", width: "90%" }}>
      <MapContainer
        center={cityCoords[city]}
        zoom={10}
        style={{
          height: "400px",
          borderRadius: "20px",
          boxShadow: "0 0 40px rgba(0,191,255,0.5)"
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={cityCoords[city]}>
          <Popup>{city} Intelligence Zone</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
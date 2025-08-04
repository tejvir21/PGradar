import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedPG } from "../store/mapSlice";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/styles";

// Make sure marker images are present in public/
// If not, comment out and use default
const defaultIcon = new L.Icon({
  iconUrl: "/default-marker.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  // shadowUrl: "/marker-shadow.png",
  shadowSize: [41, 41],
});

const selectedIcon = new L.Icon({
  iconUrl: "/selected-marker.png",
  iconSize: [35, 50],
  iconAnchor: [17, 50],
  popupAnchor: [1, -34],
  // shadowUrl: "/marker-shadow.png",
  shadowSize: [50, 50],
});

function MapView() {
  const { pgs = [], selectedPG } = useSelector((state) => state.map);
  const dispatch = useDispatch();

  // YOU PROBABLY WANT [lat, lng], not [lng, lat].
  // If you log the coordinates and they look like [77.1, 28.6] it is wrong order.
  // They should be [28.6, 77.1].

  return (
    <MapContainer
      center={[28.541334379458988, 77.33832605817665]}
      zoom={13}
      scrollWheelZoom
      style={{ height: "70vh", width: "100%", zIndex: 0 }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      <MarkerClusterGroup>
        {pgs.map((pg) => {
          // Debug print; comment in if confused:
          // console.log(pg.name, pg.coordinates);

          if (
            !pg.coordinates ||
            !Array.isArray(pg.coordinates) ||
            pg.coordinates.length !== 2
          )
            return null;

          // Make sure to use [lat, lng]!
          const [lat, lng] = pg.coordinates;
          return (
            <Marker
              key={pg._id}
              position={[lat, lng]} // This is correct if coordinates = [lat, lng]
              icon={
                selectedPG && selectedPG._id === pg._id
                  ? selectedIcon
                  : defaultIcon
              }
              eventHandlers={{
                click: () => dispatch(setSelectedPG(pg)),
              }}
            >
              {selectedPG && selectedPG._id === pg._id && (
                <Popup>
                  <b>{pg.name}</b>
                  <br />
                  {pg.address}
                  <br />₹{pg.price}/mo
                  <br />
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                        "_blank"
                      )
                    }
                  >
                    Get Directions
                  </button>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      <FlyToPG selectedPG={selectedPG} />
    </MapContainer>
  );
}

function FlyToPG({ selectedPG }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPG && selectedPG.coordinates) {
      // Make sure [lat, lng], not [lng, lat]
      const [lat, lng] = selectedPG.coordinates;
      map.flyTo([lat, lng], 18, {
        duration: 1.2,
      });
    }
  }, [selectedPG, map]);

  return null;
}

export default MapView;

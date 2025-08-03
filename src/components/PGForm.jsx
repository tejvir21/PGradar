import React, { useState } from "react";
import { apiFetch, getToken } from "../utils/api";

function PGForm({ pg = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    _id: pg._id || '',
    name: pg.name || "",
    address: pg.address || "",
    contact: pg.contact || "",
    amenities: pg.amenities?.join(",") || "",
    price: pg.price || "",
    coordinates: pg.coordinates || [28.6, 77.2],
    images: pg.images || [],
  });
  const [imgData, setImgData] = useState("");
  const [locationError, setLocationError] = useState("");

  // Fetch current location and update coordinates in form
  const fetchCurrentLocation = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setForm((f) => ({ ...f, coordinates: [latitude, longitude] }));
        if (accuracy > 100) {
          setLocationError(
            "Location may not be accurate. Try again or enter manually."
          );
        }
      },
      (error) => {
        setLocationError(
          "Unable to retrieve your location. " +
            (error.message ? error.message : "")
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Upload image and append new URL to images array
  const uploadImg = async () => {
    if (!imgData) return;
    try {
      const { url } = await apiFetch(
        "/upload",
        {
          method: "POST",
          body: JSON.stringify({ data: imgData }),
        },
        getToken()
      );
      setForm((f) => ({ ...f, images: [...f.images, url] }));
      setImgData(""); // clear selected image data after upload
    } catch (err) {
      alert("Image upload failed: " + err.message);
    }
  };

  return (
    <div className="p-2 border rounded max-w-md mx-auto">
      {/* ... all your input fields ... */}

      <input
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        className="mb-2 p-1 w-full border rounded"
        placeholder="Name"
      />
      <input
        value={form.address}
        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
        className="mb-2 p-1 w-full border rounded"
        placeholder="Address"
      />
      <input
        value={form.contact}
        onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
        className="mb-2 p-1 w-full border rounded"
        placeholder="Contact"
      />
      <input
        value={form.amenities}
        onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))}
        className="mb-2 p-1 w-full border rounded"
        placeholder="Amenities (comma separated)"
      />
      <input
        value={form.price}
        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        className="mb-2 p-1 w-full border rounded"
        placeholder="Price"
        type="number"
        min="0"
      />
      <div className="mb-2 flex items-center space-x-2">
        <input
          value={form.coordinates[0]}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              coordinates: [Number(e.target.value), f.coordinates[1]],
            }))
          }
          className="p-1 border rounded w-1/2"
          placeholder="Latitude"
          type="number"
          step="any"
          min="-90"
          max="90"
        />
        <input
          value={form.coordinates[1]}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              coordinates: [f.coordinates[0], Number(e.target.value)],
            }))
          }
          className="p-1 border rounded w-1/2"
          placeholder="Longitude"
          type="number"
          step="any"
          min="-180"
          max="180"
        />
      </div>
      <button
        type="button"
        onClick={fetchCurrentLocation}
        className="mb-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Use Current Location
      </button>
      {locationError && (
        <p className="mb-2 text-red-600 text-sm">{locationError}</p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImgData(ev.target.result);
            reader.readAsDataURL(file);
          }
        }}
        className="mb-2"
      />

      <button
        type="button"
        disabled={!imgData}
        className="bg-gray-400 text-white m-2 px-3 py-1 rounded disabled:opacity-50"
        onClick={uploadImg}
      >
        Upload Image
      </button>

      {form.images.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {form.images.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`PG Image ${idx + 1}`}
              className="w-20 h-20 object-cover rounded border"
            />
          ))}
        </div>
      )}

      <div className="flex space-x-4">
        <button
          className="bg-blue-600 text-white m-2 px-4 py-2 rounded hover:bg-blue-700 flex-1"
          onClick={() =>
            onSave({
              ...form,
              amenities: form.amenities
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean),
            })
          }
        >
          Save
        </button>

        <button
          className="bg-gray-500 text-white m-2 px-4 py-2 rounded hover:bg-gray-600 flex-1"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default PGForm;

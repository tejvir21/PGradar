// src/components/PGDetail.js
import React from "react";
import { useSelector } from "react-redux";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRupeeSign,
  FaRegStar,
  FaRegCheckCircle,
} from "react-icons/fa";

function PGDetail() {
  const pg = useSelector((state) => state.map.selectedPG);

  if (!pg)
    return (
      <div className="w-full text-center text-gray-500 py-20 bg-white rounded shadow">
        Select a PG
      </div>
    );

  return (
    <aside className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto mb-12">
      {/* Image */}
      {pg.images && pg.images.length > 0 ? (
        <img
          src={pg.images[0]}
          alt={pg.name}
          className="w-full h-48 object-cover rounded-md mb-4 shadow-sm border"
        />
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-md mb-4 border text-gray-300">
          No Image Available
        </div>
      )}

      {/* Title and Address */}
      <h2 className="font-bold text-2xl mb-1 text-blue-800">{pg.name}</h2>
      <p className="flex items-center text-gray-700 mb-2">
        <FaMapMarkerAlt className="mr-2 text-blue-500" />
        {pg.address}
      </p>
      <p className="flex items-center text-gray-700 mb-1">
        <FaPhoneAlt className="mr-2 text-green-500" />
        <span className="truncate">{pg.contact}</span>
      </p>

      {localStorage.getItem("jwt") && pg && (
        <>
          {/* Amenities */}
          {pg.amenities?.length > 0 && (
            <div className="my-2">
              <div className="text-gray-600 font-semibold mb-1">Amenities</div>
              <ul className="flex flex-wrap gap-2">
                {pg.amenities.map((a) => (
                  <li
                    key={a}
                    className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    <FaRegCheckCircle className="mr-1 text-blue-400" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price & Rating */}
          <div className="flex items-center justify-between my-3">
            <span className="flex items-center text-lg font-semibold text-green-700">
              <FaRupeeSign className="mr-1" /> {pg.price}/mo
            </span>
            {typeof pg.rating === "number" && (
              <span className="flex items-center text-yellow-500 font-medium">
                <FaRegStar className="mr-1" /> {pg.rating.toFixed(1)}
              </span>
            )}
          </div>
          <p>
            <strong>Last Updated On:</strong> {pg.updatedAt
              ? new Date(pg.updatedAt).toLocaleDateString()
              : "No data available"}
          </p>
        </>
      )}

      {/* Directions Button */}
      <button
        onClick={() =>
          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${pg.coordinates[0]},${pg.coordinates[1]}`,
            "_blank"
          )
        }
        className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 active:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
      >
        <FaMapMarkerAlt />
        Get Directions
      </button>
    </aside>
  );
}

export default PGDetail;

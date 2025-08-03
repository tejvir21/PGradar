import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPGs, setSelectedPG } from "../store/mapSlice";
import SearchBar from "../components/SearchBar";
import MapView from "../components/MapView";
import PGDetail from "../components/PGDetail";

export default function MapPage() {
  const dispatch = useDispatch();
  const { pgs, selectedPG } = useSelector((state) => state.map);

  useEffect(() => {
    dispatch(
      fetchPGs({
        lat: 28.541334379458988,
        lng: 77.33832605817665,
        radius: 5000,
      })
    );
  }, [dispatch]);

  return (
    <div className="container mx-auto my-4 relative z-0 pb-12">
      <SearchBar
        onSelectPG={(id) => {
          dispatch(setSelectedPG(pgs.find((pg) => pg._id === id)));
        }}
      />

      <div className="flex flex-col md:flex-row flex-wrap relative z-0 gap-4 overflow-hidden">
        <div className="flex-1 min-w-0">
          <MapView />
        </div>
        <div className="w-full md:w-96 flex-shrink-0 relative z-0">
          <PGDetail pg={selectedPG} />
        </div>
      </div>
    </div>
  );
}

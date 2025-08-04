// src/components/SearchBar.js
import AsyncSelect from "react-select/async";
import { apiFetch } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedPG } from "../store/mapSlice";

function SearchBar() {
  const dispatch = useDispatch();
  const pgs = useSelector((state) => state.map.pgs);

  const loadOptions = async (inputValue) => {
    const data = await apiFetch(
      `/search/suggestions?q=${encodeURIComponent(inputValue)}`
    );
    return data.map((pg) => ({ value: pg._id, label: pg.name }));
  };

  const handleSelect = (id) => {
    const pg = pgs.find((pg) => pg._id === id);
    dispatch(setSelectedPG(pg));
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      onChange={(opt) => opt && handleSelect(opt.value)}
      placeholder="Search PG by name…"
      aria-label="Search"
      className="mb-2 relative z-50"
    />
  );
}

export default SearchBar;

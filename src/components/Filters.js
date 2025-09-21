import React from "react";

export default function Filters({
  allTypes,
  allLocations,
  filters,
  setFilters,
}) {
  const toggle = (key, value) => {
    setFilters((f) => {
      const set = new Set(f[key]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...f, [key]: Array.from(set) };
    });
  };

  return (
    <>
      <h3>Job Type</h3>
      <div className="filter-group">
        {allTypes.map((t) => (
          <label className="check" key={t}>
            <input
              type="checkbox"
              checked={filters.types.includes(t)}
              onChange={() => toggle("types", t)}
            />
            {t}
          </label>
        ))}
      </div>

      <h3>Location</h3>
      <div className="filter-group">
        {allLocations.map((l) => (
          <label className="check" key={l}>
            <input
              type="checkbox"
              checked={filters.locations.includes(l)}
              onChange={() => toggle("locations", l)}
            />
            {l}
          </label>
        ))}
      </div>
    </>
  );
}

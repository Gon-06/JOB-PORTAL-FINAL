import React from "react";

export default function JobList({ jobs, onSelect, onDelete, role }) {
  return (
    <div className="items">
      {jobs.map((j) => (
        <article className="job" key={j.id}>
          <div className="job-head">
            <div>
              <div className="job-title">{j.title}</div>
              <div className="company">{j.company}</div>
            </div>
            <div className="chips">
              {(j.tags || []).slice(0, 4).map((t) => (
                <span className="chip" key={t}>{t}</span>
              ))}
            </div>
          </div>

          <div className="meta">
            <span>📍 {j.location}</span>
            <span>🕒 {j.type}</span>
            {j.salary && <span>💰 {j.salary}</span>}
            <span>📅 {j.date}</span>
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button className="btn apply" onClick={() => onSelect(j)}>View</button>
            {role === "Recruiter" && (
              <button className="btn danger" onClick={() => onDelete(j.id)}>Delete</button>
            )}
          </div>
        </article>
      ))}

      {!jobs.length && <div className="muted" style={{ padding: 10 }}>No jobs match your filters.</div>}
    </div>
  );
}
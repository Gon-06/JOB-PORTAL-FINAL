import React from "react";

export default function JobDetail({ job, onApply, canEdit, onEdit, onDelete }) {
  return (
    <div>
      <div className="badge">{job.salary || "—"}</div>
      <h2 style={{ margin: "10px 0 0 0" }}>{job.title}</h2>
      <div className="company">{job.company}</div>

      <div className="meta" style={{ marginTop: 8 }}>
        <span>📍 {job.location}</span>
        <span>🕒 {job.type}</span>
        <span>📅 {job.date}</span>
      </div>

      <div className="stack">
        <section>
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </section>

        <section>
          <h3>Requirements</h3>
          <ul>
            {(job.requirements || []).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Benefits</h3>
          <ul>
            {(job.benefits || []).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </section>

        <div className="actions">
          <button className="btn apply" onClick={onApply}>
            Apply for this Position
          </button>
          {canEdit && (
            <>
              <button className="btn outline" onClick={onEdit}>
                Edit
              </button>
              <button className="btn danger" onClick={onDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

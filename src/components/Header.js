import React from "react";

export default function Header({ role, setRole }) {
  return (
    <nav className="nav">
      <div className="row">
        <div className="brand">JobHub</div>
        <div className="links">
          <a href="#jobs">Jobs</a>
          <a href="#companies">Companies</a>
          <a href="#salary">Salary</a>
          <a href="#resources">Resources</a>
          <button
            className="btn ghost"
            onClick={() => setRole(role === "Recruiter" ? "Job Seeker" : "Recruiter")}
          >
            Switch to {role === "Recruiter" ? "Job Seeker" : "Recruiter"}
          </button>
          <button className="btn primary">Post a Job</button>
        </div>
      </div>
    </nav>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Filters from "./components/Filters";
import JobList from "./components/JobList";
import JobDetail from "./components/JobDetail";
import JobForm from "./components/JobForm";

const API_URL = "https://jsonfakery.com/jobs";

const FALLBACK = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    type: "Full Time",
    location: "San Francisco, CA",
    tags: ["React", "Typescript", "Next.js"],
    salary: "$120k - $180k",
    description:
      "We're looking for a skilled Senior Frontend Developer to build modern web UIs.",
    requirements: [
      "5+ years with React & JavaScript",
      "Experience with TypeScript and Next.js",
      "State mgmt (Redux/Zustand)",
    ],
    benefits: [
      "Competitive salary & equity",
      "Health, dental, vision",
      "Flexible work arrangements",
    ],
    date: "2025-01-12",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateLabs",
    type: "Full Time",
    location: "New York, NY",
    tags: ["Strategy", "Analytics", "Leadership"],
    salary: "$130k - $200k",
    description: "Own the roadmap and ship customer-loving features.",
    requirements: ["4+ years PM", "Great comms", "Data-informed decisions"],
    benefits: ["L&D budget", "Hybrid work"],
    date: "2025-01-10",
  },
];

function normalize(data) {
  return (Array.isArray(data) ? data : []).map((j, i) => ({
    id: j.id ?? i + 1000,
    title: j.title ?? j.job_title ?? "Untitled Job",
    company: j.company ?? j.company_name ?? "Unknown Company",
    type: j.type ?? j.job_type ?? "Full Time",
    location: j.location ?? j.city ?? j.place ?? "Remote",
    tags:
      j.tags ??
      j.skills ??
      (j.stack
        ? String(j.stack)
            .split(",")
            .map((s) => s.trim())
        : []) ??
      [],
    salary: j.salary ?? j.pay ?? "",
    description:
      j.description ?? j.job_description ?? "No description provided.",
    requirements: j.requirements ??
      j.req ?? ["Good fundamentals", "Team player"],
    benefits: j.benefits ?? ["Health", "PTO"],
    date: (j.posted_at || j.date || new Date().toISOString()).slice(0, 10),
  }));
}

export default function App() {
  const [role, setRole] = useState("Job Seeker"); // or "Recruiter"
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ types: [], locations: [] });
  const [sortBy, setSortBy] = useState("date"); // 'date' | 'title'
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch(API_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const n = normalize(data);
        if (live) {
          setJobs(n.length ? n : FALLBACK);
          setErr("");
        }
      } catch (e) {
        setJobs(FALLBACK);
        setErr("Using fallback data (API not stable).");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  const addJob = (payload) => {
    const job = {
      id: Date.now(),
      ...payload,
      tags:
        payload.tags
          ?.split(",")
          .map((t) => t.trim())
          .filter(Boolean) ?? [],
      date: new Date().toISOString().slice(0, 10),
    };
    setJobs((prev) => [job, ...prev]);
    setSelected(job);
  };

  const updateJob = (updated) => {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    setSelected(updated);
  };

  const deleteJob = (id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  // Apply
  const apply = (id) => {
    const key = "appliedJobs";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    if (!arr.includes(id)) {
      arr.push(id);
      localStorage.setItem(key, JSON.stringify(arr));
      alert("✅ Applied!");
    } else {
      alert("⚠️ Already applied.");
    }
  };

  const allTypes = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.type))).sort(),
    [jobs]
  );
  const allLocations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))).sort(),
    [jobs]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = jobs.filter((j) => {
      const typeOk = !filters.types.length || filters.types.includes(j.type);
      const locOk =
        !filters.locations.length || filters.locations.includes(j.location);
      const qOk =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q);
      return typeOk && locOk && qOk;
    });
    list.sort((a, b) => {
      if (sortBy === "title")
        return (a.title || "").localeCompare(b.title || "");
      return new Date(b.date) - new Date(a.date);
    });
    return list;
  }, [jobs, search, filters, sortBy]);

  return (
    <>
      <Header role={role} setRole={setRole} />
      <div className="wrap">
        {err && <div className="banner">{err}</div>}
        <div className="grid">
          <aside className="card filters">
            <Filters
              allTypes={allTypes}
              allLocations={allLocations}
              filters={filters}
              setFilters={setFilters}
            />
          </aside>

          <main className="card list">
            <div className="list-header">
              <h2>Latest Job Openings</h2>
              <div className="muted">{visible.length} jobs found</div>
              <div className="controls">
                <input
                  className="search"
                  placeholder="Search title, company, description…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort: Newest</option>
                  <option value="title">Sort: Title</option>
                </select>
                {role === "Recruiter" && (
                  <button
                    className="btn outline"
                    onClick={() =>
                      setSelected({
                        // open form as “new”
                        id: null,
                        title: "",
                        company: "",
                        type: allTypes[0] || "Full Time",
                        location: allLocations[0] || "Remote",
                        tags: [],
                        salary: "",
                        description: "",
                        requirements: [],
                        benefits: [],
                      })
                    }
                  >
                    + Post a Job
                  </button>
                )}
              </div>
            </div>

            <JobList
              jobs={visible}
              onSelect={setSelected}
              onDelete={deleteJob}
              role={role}
            />
          </main>

          <aside className="card detail">
            {selected ? (
              selected.id ? (
                <JobDetail
                  job={selected}
                  onApply={() => apply(selected.id)}
                  canEdit={role === "Recruiter"}
                  onEdit={() => setSelected({ ...selected, __editing: true })}
                  onDelete={() => deleteJob(selected.id)}
                />
              ) : (
                <JobForm
                  initial={selected}
                  onCancel={() => setSelected(null)}
                  onSubmit={(payload) => addJob(payload)}
                />
              )
            ) : (
              <div className="muted">Select a job to see details.</div>
            )}

            {/* editing mode */}
            {selected?.__editing && (
              <JobForm
                initial={selected}
                onCancel={() => setSelected({ ...selected, __editing: false })}
                onSubmit={(payload) =>
                  updateJob({
                    ...selected,
                    ...payload,
                    tags:
                      payload.tags
                        ?.split(",")
                        .map((t) => t.trim())
                        .filter(Boolean) ?? selected.tags,
                    __editing: false,
                  })
                }
              />
            )}
          </aside>
        </div>
      </div>

      {loading && <div className="loading">Loading…</div>}
    </>
  );
}

import React, { useState } from "react";

export default function JobForm({ initial, onSubmit, onCancel }) {
const [form, setForm] = useState({
title: initial?.title || "",
company: initial?.company || "",
type: initial?.type || "Full Time",
location: initial?.location || "Remote",
tags: Array.isArray(initial?.tags) ? initial.tags.join(", ") : (initial?.tags || ""),
salary: initial?.salary || "",
description: initial?.description || "",
requirements: Array.isArray(initial?.requirements) ? initial.requirements.join("\n") : "",
benefits: Array.isArray(initial?.benefits) ? initial.benefits.join("\n") : ""
});

const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));

const submit = (e) => {
e.preventDefault();
onSubmit({
...form,
requirements: form.requirements
? form.requirements.split("\n").map((s) => s.trim()).filter(Boolean)
: [],
benefits: form.benefits
? form.benefits.split("\n").map((s) => s.trim()).filter(Boolean)
: []
});
};

return (
<form onSubmit={submit} className="form">
<h2 style={{ marginTop: 0 }}>{initial?.id ? "Edit Job" : "Create Job"}</h2>
<div className="grid2">
<label>Title<input value={form.title} onChange={(e) => change("title", e.target.value)} required /></label>
<label>Company<input value={form.company} onChange={(e) => change("company", e.target.value)} required /></label>
<label>Type<input value={form.type} onChange={(e) => change("type", e.target.value)} placeholder="Full Time / Contract" /></label>
<label>Location<input value={form.location} onChange={(e) => change("location", e.target.value)} /></label>
<label>Salary<input value={form.salary} onChange={(e) => change("salary", e.target.value)} placeholder="$120k - $180k" /></label>
<label>Tags (comma separated)<input value={form.tags} onChange={(e) => change("tags", e.target.value)} placeholder="React, TypeScript, Next.js" /></label>
</div>

<label>Description<textarea rows="4" value={form.description} onChange={(e) => change("description", e.target.value)} /></label>
<label>Requirements (one per line)<textarea rows="3" value={form.requirements} onChange={(e) => change("requirements", e.target.value)} /></label>
<label>Benefits (one per line)<textarea rows="3" value={form.benefits} onChange={(e) => change("benefits", e.target.value)} /></label>

<div className="actions" style={{ marginTop: 12 }}>
<button className="btn apply" type="submit">{initial?.id ? "Save" : "Create"}</button>
<button className="btn outline" type="button" onClick={onCancel}>Cancel</button>
</div>
</form>
);
}
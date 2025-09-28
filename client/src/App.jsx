import { useState } from "react";

// Use env var in production, empty in local dev (Vite proxy handles /api)
const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", city: "", state: "" });
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Saving...");
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // If server returned HTML error page, avoid res.json() crash
      const contentType = res.headers.get("content-type") || "";
      const parseJSON = contentType.includes("application/json");

      if (!res.ok) {
        const data = parseJSON ? await res.json() : {};
        throw new Error(data.error || "Request failed");
      }

      setMsg("✅ Saved Successfully. We will contact you!");
      setForm({ name: "", email: "", whatsapp: "", city: "", state: "" });
    } catch (err) {
      setMsg("❌ " + (err?.message || "Failed"));
    }
  }

  return (
    <div className="card">
      <h2>Lead Form</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input placeholder="WhatsApp" value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})}/>
        <input placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/>
        <input placeholder="State" value={form.state} onChange={e=>setForm({...form,state:e.target.value})}/>
        <button>Submit</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

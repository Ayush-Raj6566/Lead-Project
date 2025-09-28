import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", city: "", state: "" });
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Saving...");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setMsg("✅ Saved Successfully. We will contact you!");
      setForm({ name: "", email: "", whatsapp: "", city: "", state: "" });
    } else {
      const data = await res.json();
      setMsg("❌ " + (data.error || "Failed"));
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

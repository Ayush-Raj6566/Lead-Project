export function validateLead(body) {
  const errors = {};
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const whatsapp = (body.whatsapp || "").trim();
  const city = (body.city || "").trim();
  const state = (body.state || "").trim();

  if (!name) errors.name = "Name is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) errors.email = "Email is required";
  else if (!emailRegex.test(email)) errors.email = "Invalid email";

  const phoneDigits = whatsapp.replace(/\D/g, "");
  if (!whatsapp) errors.whatsapp = "WhatsApp is required";
  else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.whatsapp = "WhatsApp should be 10–15 digits";
  }

  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";

  return { valid: Object.keys(errors).length === 0, errors, data: { name, email, whatsapp: phoneDigits, city, state } };
}

import { Router } from "express";
import { validateLead } from "../validators/lead.js";
import { appendLeadRow } from "../utils/sheets.js";

const router = Router();

router.post('/', async (req, res) => {
  const { valid, errors, data } = validateLead(req.body || {});
  if (!valid) return res.status(400).json({ errors });
  try {
    const result = await appendLeadRow(data);
    return res.status(201).json({ ok: true, range: result.updatedRange });
  } catch (err) {
    console.error('Sheets error:', err?.message, err?.errors || err);
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
});


export default router;

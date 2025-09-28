import { google } from "googleapis";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const KEYFILE = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./credentials/service-account.json";
const SHEET_NAME = "Leads";

function getAuth() {
  if (!fs.existsSync(KEYFILE)) throw new Error(`Missing Google key at: ${KEYFILE}`);
  return new google.auth.GoogleAuth({
    keyFile: KEYFILE,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function ensureHeaderRow(sheets) {
  const get = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:F1`,
  });
  const row = get.data.values?.[0];
  if (!row) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1:F1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["Timestamp", "Name", "Email", "WhatsApp", "City", "State"]],
      },
    });
  }
}

export async function appendLeadRow(lead) {
  const auth = await getAuth();
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  // ensure tab exists
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const hasTab = meta.data.sheets?.some(s => s.properties?.title === SHEET_NAME);
  if (!hasTab) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] },
    });
  }

  await ensureHeaderRow(sheets);

  const values = [[new Date().toISOString(), lead.name, lead.email, lead.whatsapp, lead.city, lead.state]];

  return sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:F`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
}

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

// Helper to get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for local cross-origin development (e.g. frontend dev server on port 5173 calling backend on port 5000)
app.use(cors());
app.use(express.json());

// API Endpoints

// 1. GET /api/incidents - Retrieve all crowdsourced incidents
app.get('/api/incidents', async (req, res) => {
  try {
    const list = await db.getIncidents();
    res.json(list);
  } catch (error) {
    console.error('API Error: GET /api/incidents failed:', error);
    res.status(500).json({ error: 'Failed to retrieve incidents database.' });
  }
});

// 2. POST /api/incidents - Add a new citizen-reported incident
app.post('/api/incidents', async (req, res) => {
  try {
    const { type, area, desc, time } = req.body;
    if (!type || !area || !desc) {
      return res.status(400).json({ error: 'Parameters type, area, and desc are required.' });
    }
    const newInc = await db.addIncident(type, area, desc, time);
    res.status(201).json(newInc);
  } catch (error) {
    console.error('API Error: POST /api/incidents failed:', error);
    res.status(500).json({ error: 'Failed to write incident to database.' });
  }
});

// 3. PUT /api/incidents/:id/resolve - Mark a crowdsourced incident as resolved (GRAP enforcement action)
app.put('/api/incidents/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db.resolveIncident(id);
    if (!updated) {
      return res.status(404).json({ error: 'Incident not found.' });
    }
    res.json(updated);
  } catch (error) {
    console.error(`API Error: PUT /api/incidents/${req.params.id}/resolve failed:`, error);
    res.status(500).json({ error: 'Failed to update database incident state.' });
  }
});

// Serve compiled static Vite production files
const DIST_PATH = path.join(__dirname, '../dist');
app.use(express.static(DIST_PATH));

// SPA routing fallback - Serve index.html for any unmatched non-API routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

// Start listening
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 VaayuAI unified server is listening on port ${PORT}`);
    console.log(`👉 Development Client calling APIs at: http://localhost:5173`);
    console.log(`👉 Production Static Portal hosted at: http://localhost:${PORT}`);
    console.log(`==================================================`);
  });
}

export default app;

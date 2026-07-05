import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'incidents.json');

// Default starting incidents list
const DEFAULT_INCIDENTS = [
  { id: 1, type: 'Garbage Burning', area: 'Anand Vihar', desc: 'Heavy smoke plume near pocket 3 park due to trash burning.', time: '12 mins ago', status: 'pending' },
  { id: 2, type: 'Construction Dust', area: 'Noida Sector 18', desc: 'Uncovered sand piling at local commercial complex site.', time: '28 mins ago', status: 'pending' },
  { id: 3, type: 'Vehicle Idling', area: 'Rajiv Chowk', desc: 'Multiple tour buses idling with ACs on for over an hour near gate 2.', time: '1 hour ago', status: 'resolved' }
];

class Database {
  constructor() {
    this.incidents = [];
    this.initPromise = this.init();
  }

  async init() {
    try {
      // 1. Create data directory if missing
      await fs.mkdir(DATA_DIR, { recursive: true });

      // 2. Read or create file database
      try {
        const rawData = await fs.readFile(DB_FILE, 'utf-8');
        this.incidents = JSON.parse(rawData);
        console.log(`Database: Successfully loaded ${this.incidents.length} incidents from ${DB_FILE}`);
      } catch (err) {
        if (err.code === 'ENOENT') {
          // File does not exist, write default seeding data
          this.incidents = [...DEFAULT_INCIDENTS];
          await this.save();
          console.log('Database: Seeding default incidents database file.');
        } else {
          throw err;
        }
      }
    } catch (error) {
      console.error('Database initialization failed:', error);
      this.incidents = [...DEFAULT_INCIDENTS]; // Fallback to memory
    }
  }

  async save() {
    try {
      await fs.writeFile(DB_FILE, JSON.stringify(this.incidents, null, 2), 'utf-8');
    } catch (error) {
      console.error('Database failed to write to file:', error);
    }
  }

  async getIncidents() {
    await this.initPromise;
    return this.incidents;
  }

  async addIncident(type, area, desc, time = 'Just now') {
    await this.initPromise;
    const newIncident = {
      id: Date.now(),
      type,
      area,
      desc,
      time,
      status: 'pending'
    };
    this.incidents.unshift(newIncident);
    await this.save();
    return newIncident;
  }

  async resolveIncident(id) {
    await this.initPromise;
    let found = null;
    this.incidents = this.incidents.map(inc => {
      if (inc.id === Number(id)) {
        found = { ...inc, status: 'resolved' };
        return found;
      }
      return inc;
    });
    if (found) {
      await this.save();
    }
    return found;
  }
}

export const db = new Database();

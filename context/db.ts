import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // configure no Render
  ssl: { rejectUnauthorized: false }
});

export default pool;

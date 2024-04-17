import pg from 'pg'
const { Client } = pg
import 'dotenv/config'

const connectionString = process.env.PG_URL;

export const getClient = () => new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false 
  }
});

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE === 'no-verify' ? { rejectUnauthorized: false } : false
});

client.connect();

module.exports = client;
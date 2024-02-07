
const { Client: ApiClient } = require('pg')

const client = new ApiClient({
    connectionString: process.env.DB_CONNECTION_STRING || 'postgres://localhost:5432/juicebox-dev',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});



module.exports = client;

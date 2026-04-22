const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'explorapedia';

let client;
let db;

async function connectToMongo() {
    if (!mongoUri) {
        throw new Error('Missing MONGODB_URI. Add it to your .env file.');
    }

    if (db) {
        return db;
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db(dbName);

    console.log(`Connected to MongoDB database: ${dbName}`);
    return db;
}

function getDb() {
    if (!db) {
        throw new Error('Database is not connected yet.');
    }

    return db;
}

module.exports = {
    connectToMongo,
    getDb,
};

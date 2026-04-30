const { getDb } = require('../mongo');

// Minimal helper functions for `users` collection using the existing mongo connection
async function createUser(user) {
    const db = getDb();
    const result = await db.collection('users').insertOne(user);
    return result.insertedId;
}

async function findUserByEmail(email) {
    const db = getDb();
    return db.collection('users').findOne({ email });
}

module.exports = {
    createUser,
    findUserByEmail,
};

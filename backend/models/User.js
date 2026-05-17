const { ObjectId } = require('mongodb');
const { getDb } = require('../mongo');

// Minimal helper functions for `users` collection using the existing mongo connection
async function createUser(user) {
    const db = getDb();
    const result = await db.collection('users').insertOne({
        ...user,
        friends: [] // Initialize empty friends array
    });
    return result.insertedId;
}

async function findUserByEmail(email) {
    const db = getDb();
    return db.collection('users').findOne({ email });
}

async function findUserById(userId) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new ObjectId(userId) });
}

async function addFriend(userId, friendId) {
    const db = getDb();
    // Check if already friends
    const user = await findUserById(userId);
    if (user?.friends?.some(f => f.toString() === friendId.toString())) {
        return null; // Already friends
    }

    // Add friend to user's friend list
    const result = await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $addToSet: { friends: new ObjectId(friendId) } },
        { returnDocument: 'after' }
    );
    return result.value;
}

async function getFriends(userId) {
    const db = getDb();
    const user = await findUserById(userId);
    if (!user?.friends?.length) return [];

    return db.collection('users').find(
        { _id: { $in: user.friends } },
        { projection: { password: 0 } }
    ).toArray();
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    addFriend,
    getFriends,
};

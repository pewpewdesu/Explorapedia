const { ObjectId } = require('mongodb');
const { getDb } = require('../mongo');

async function createTrip({ name, city, userId }) {
    const db = getDb();
    const result = await db.collection('trips').insertOne({
        name,
        city,
        userId: new ObjectId(userId),
        attractions: [],
        createdAt: new Date(),
    });

    return result.insertedId;
}

async function getTripsByUser(userId) {
    const db = getDb();
    return db
        .collection('trips')
        .find({ userId: new ObjectId(userId) })
        .toArray();
}

async function getTripById(tripId) {
    const db = getDb();
    return db.collection('trips').findOne({ _id: new ObjectId(tripId) });
}

async function addAttractionToTrip(tripId, attraction) {
    const db = getDb();
    const result = await db.collection('trips').findOneAndUpdate(
        { _id: new ObjectId(tripId) },
        { $push: { attractions: attraction } },
        { returnDocument: 'after' }
    );
    return result.value;
}

async function removeAttractionFromTrip(tripId, fsq_id) {
    const db = getDb();
    const result = await db.collection('trips').findOneAndUpdate(
        { _id: new ObjectId(tripId) },
        { $pull: { attractions: { fsq_id } } },
        { returnDocument: 'after' }
    );
    return result.value;
}

async function deleteTrip(tripId, userId) {
    const db = getDb();
    const res = await db.collection('trips').deleteOne({
        _id: new ObjectId(tripId),
        userId: new ObjectId(userId),
    });
    return res.deletedCount === 1;
}

module.exports = {
    createTrip,
    getTripsByUser,
    getTripById,
    addAttractionToTrip,
    removeAttractionFromTrip,
    deleteTrip,
};

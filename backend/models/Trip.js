const { ObjectId } = require('mongodb');
const { getDb } = require('../mongo');

async function createTrip({ name, city, userId, startDate, endDate, visibility = 'private' }) {
    const db = getDb();
    const result = await db.collection('trips').insertOne({
        name,
        city,
        userId: new ObjectId(userId),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        visibility, // 'private', 'friends', 'public'
        itinerary: [], // array of { day: number, items: [{ id, name, address, time, notes, fsq_id }] }
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

async function addToItinerary(tripId, dayNum, item) {
    const db = getDb();
    // item should have: name, address, fsq_id, time (optional), notes (optional)
    const itemWithId = { id: new ObjectId(), ...item };

    const result = await db.collection('trips').findOneAndUpdate(
        { _id: new ObjectId(tripId) },
        {
            $push: {
                'itinerary.$[day].items': itemWithId,
            },
        },
        {
            arrayFilters: [{ 'day.day': dayNum }],
            returnDocument: 'after',
        }
    );

    // If no day exists, create it
    if (!result.value) {
        const addDayResult = await db.collection('trips').findOneAndUpdate(
            { _id: new ObjectId(tripId) },
            {
                $push: {
                    itinerary: { day: dayNum, items: [itemWithId] },
                },
            },
            { returnDocument: 'after' }
        );
        return addDayResult.value;
    }

    return result.value;
}

async function editItineraryItem(tripId, dayNum, itemId, updates) {
    const db = getDb();
    const result = await db.collection('trips').findOneAndUpdate(
        { _id: new ObjectId(tripId), 'itinerary.day': dayNum },
        {
            $set: {
                'itinerary.$[day].items.$[item]': {
                    ...updates,
                    id: new ObjectId(itemId),
                },
            },
        },
        {
            arrayFilters: [
                { 'day.day': dayNum },
                { 'item.id': new ObjectId(itemId) },
            ],
            returnDocument: 'after',
        }
    );
    return result.value;
}

async function removeItineraryItem(tripId, dayNum, itemId) {
    const db = getDb();
    const result = await db.collection('trips').findOneAndUpdate(
        { _id: new ObjectId(tripId) },
        {
            $pull: {
                'itinerary.$[day].items': { id: new ObjectId(itemId) },
            },
        },
        {
            arrayFilters: [{ 'day.day': dayNum }],
            returnDocument: 'after',
        }
    );
    return result.value;
}

async function updateTripVisibility(tripId, userId, visibility) {
    const db = getDb();
    const result = await db.collection('trips').findOneAndUpdate(
        { _id: new ObjectId(tripId), userId: new ObjectId(userId) },
        { $set: { visibility } },
        { returnDocument: 'after' }
    );
    return result.value;
}

async function getPublicTrips(limit = 20, skip = 0) {
    const db = getDb();
    return db
        .collection('trips')
        .find({ visibility: 'public' })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();
}

async function getPublicTripById(tripId) {
    const db = getDb();
    const trip = await db.collection('trips').findOne({
        _id: new ObjectId(tripId),
        visibility: 'public',
    });
    return trip;
}

async function deleteTrip(tripId, userId) {
    const db = getDb();
    const res = await db.collection('trips').deleteOne({
        _id: new ObjectId(tripId),
        userId: new ObjectId(userId),
    });
    return res.deletedCount === 1;
}

async function getSharedTripsFromFriends(userId, friendIds) {
    const db = getDb();
    // Get trips from friends that are marked as 'friends' visibility
    return db
        .collection('trips')
        .find({
            userId: { $in: friendIds.map(id => new ObjectId(id)) },
            visibility: 'friends'
        })
        .sort({ createdAt: -1 })
        .toArray();
}

module.exports = {
    createTrip,
    getTripsByUser,
    getTripById,
    addToItinerary,
    editItineraryItem,
    removeItineraryItem,
    updateTripVisibility,
    getPublicTrips,
    getPublicTripById,
    deleteTrip,
    getSharedTripsFromFriends,
};

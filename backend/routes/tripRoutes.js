const express = require('express');
const axios = require('axios');
const { ObjectId } = require('mongodb');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Trip = require('../models/Trip');
const catchAsyncErrors = require('../middleware/errorHandler');

// Create a trip
router.post('/', authMiddleware, catchAsyncErrors(async (req, res) => {
    const { name, city, startDate, endDate } = req.body;
    const userId = req.user.userId;

    if (!name || !city) {
        return res.status(400).json({ message: 'Missing name or city' });
    }

    const tripId = await Trip.createTrip({ name, city, userId, startDate, endDate, visibility: 'private' });
    res.status(201).json({ tripId });
}));

// Get trips for current user
router.get('/', authMiddleware, catchAsyncErrors(async (req, res) => {
    const userId = req.user.userId;
    const trips = await Trip.getTripsByUser(userId);
    res.json(trips);
}));

// Get a single trip
router.get('/:id', authMiddleware, catchAsyncErrors(async (req, res) => {
    const trip = await Trip.getTripById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(trip);
}));

// Add item to itinerary for a specific day (fetch from Foursquare if needed)
router.post('/:id/itinerary/:day', authMiddleware, catchAsyncErrors(async (req, res) => {
    const tripId = req.params.id;
    const dayNum = parseInt(req.params.day, 10);
    const trip = await Trip.getTripById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    let item = req.body.item;

    if (!item && req.body.fsq_id) {
        // fetch details from Foursquare
        const fsqId = req.body.fsq_id;
        const response = await axios.get(`https://api.foursquare.com/v3/places/${fsqId}`, {
            headers: { Authorization: process.env.FOURSQUARE_API_KEY },
        });
        const data = response.data;

        item = {
            fsq_id: fsqId,
            name: data.name,
            address: data.location?.formatted_address || null,
            lat: data.geocodes?.main?.latitude || null,
            lon: data.geocodes?.main?.longitude || null,
            time: req.body.time || null,
            notes: req.body.notes || null,
        };
    }

    if (!item) {
        return res.status(400).json({ message: 'No item data provided' });
    }

    const updated = await Trip.addToItinerary(tripId, dayNum, item);
    res.json(updated);
}));

// Edit itinerary item
router.put('/:id/itinerary/:day/:itemId', authMiddleware, catchAsyncErrors(async (req, res) => {
    const tripId = req.params.id;
    const dayNum = parseInt(req.params.day, 10);
    const itemId = req.params.itemId;
    const trip = await Trip.getTripById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Trip.editItineraryItem(tripId, dayNum, itemId, req.body);
    res.json(updated);
}));

// Remove itinerary item
router.delete('/:id/itinerary/:day/:itemId', authMiddleware, catchAsyncErrors(async (req, res) => {
    const tripId = req.params.id;
    const dayNum = parseInt(req.params.day, 10);
    const itemId = req.params.itemId;
    const trip = await Trip.getTripById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Trip.removeItineraryItem(tripId, dayNum, itemId);
    res.json(updated);
}));

// Update trip visibility
router.put('/:id/visibility', authMiddleware, catchAsyncErrors(async (req, res) => {
    const tripId = req.params.id;
    const { visibility } = req.body;
    const validVisibilities = ['private', 'friends', 'public'];
    if (!validVisibilities.includes(visibility)) {
        return res.status(400).json({ message: 'Invalid visibility option' });
    }

    const updated = await Trip.updateTripVisibility(tripId, req.user.userId, visibility);
    if (!updated) return res.status(404).json({ message: 'Trip not found' });
    res.json(updated);
}));

// Delete a trip
router.delete('/:id', authMiddleware, catchAsyncErrors(async (req, res) => {
    const success = await Trip.deleteTrip(req.params.id, req.user.userId);
    if (!success) return res.status(404).json({ message: 'Trip not found or not authorized' });
    res.json({ message: 'Trip deleted' });
}));

// ============= SHARED TRIPS (PUBLIC BROWSING) =============

// Get public trips feed (no auth required)
router.get('/shared/feed', catchAsyncErrors(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = parseInt(req.query.skip, 10) || 0;
    const trips = await Trip.getPublicTrips(limit, skip);
    res.json(trips);
}));

// Get a public trip by id (no auth required)
router.get('/shared/:id', catchAsyncErrors(async (req, res) => {
    const trip = await Trip.getPublicTripById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found or is private' });
    res.json(trip);
}));

module.exports = router;

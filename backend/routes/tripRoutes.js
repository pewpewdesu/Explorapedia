const express = require('express');
const axios = require('axios');
const { ObjectId } = require('mongodb');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Trip = require('../models/Trip');

// Create a trip
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, city } = req.body;
        const userId = req.user.userId;

        if (!name || !city) {
            return res.status(400).json({ message: 'Missing name or city' });
        }

        const tripId = await Trip.createTrip({ name, city, userId });
        res.status(201).json({ tripId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create trip' });
    }
});

// Get trips for current user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const trips = await Trip.getTripsByUser(userId);
        res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch trips' });
    }
});

// Get a single trip
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const trip = await Trip.getTripById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (trip.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(trip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch trip' });
    }
});

// Add an attraction to a trip by Foursquare place id (`fsq_id`) or pass full attraction object
router.put('/:id/attractions', authMiddleware, async (req, res) => {
    try {
        const tripId = req.params.id;
        const trip = await Trip.getTripById(tripId);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (trip.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        let attraction = req.body.attraction;

        if (!attraction && req.body.fsq_id) {
            // fetch details from Foursquare
            const fsqId = req.body.fsq_id;
            const response = await axios.get(`https://api.foursquare.com/v3/places/${fsqId}`, {
                headers: { Authorization: process.env.FOURSQUARE_API_KEY },
            });
            const data = response.data;

            attraction = {
                fsq_id: fsqId,
                name: data.name,
                categories: (data.categories || []).map((c) => c.name),
                address: data.location?.formatted_address || null,
                lat: data.geocodes?.main?.latitude || null,
                lon: data.geocodes?.main?.longitude || null,
                raw: data,
            };
        }

        if (!attraction) {
            return res.status(400).json({ message: 'No attraction data provided' });
        }

        const updated = await Trip.addAttractionToTrip(tripId, attraction);
        res.json(updated);
    } catch (error) {
        console.error(error.response?.data || error);
        res.status(500).json({ message: 'Failed to add attraction' });
    }
});

// Remove an attraction from a trip by fsq_id
router.delete('/:id/attractions/:fsq_id', authMiddleware, async (req, res) => {
    try {
        const tripId = req.params.id;
        const fsq_id = req.params.fsq_id;
        const trip = await Trip.getTripById(tripId);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        if (trip.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updated = await Trip.removeAttractionFromTrip(tripId, fsq_id);
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove attraction' });
    }
});

// Delete a trip
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const success = await Trip.deleteTrip(req.params.id, req.user.userId);
        if (!success) return res.status(404).json({ message: 'Trip not found or not authorized' });
        res.json({ message: 'Trip deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete trip' });
    }
});

module.exports = router;

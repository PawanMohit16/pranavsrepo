import express from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message.js';
import { authenticateJWT } from '../middleware/auth.js';
import { getFallbackMessages, createFallbackMessage } from '../dbFallback.js';

const router = express.Router();

// POST /api/messages: Public contact message submission
router.post('/', async (req, res) => {
  const { name, email, text } = req.body;
  if (!name || !email || !text) {
    return res.status(400).json({ error: 'Missing required fields in contact payload' });
  }

  if (mongoose.connection.readyState !== 1) {
    console.log('MongoDB offline, logging message to fallback JSON.');
    try {
      const savedMsg = createFallbackMessage({ name, email, text });
      return res.status(201).json({ success: true, message: 'Message logged successfully', data: savedMsg });
    } catch (error) {
      return res.status(500).json({ error: 'Server error processing contact transmission in fallback' });
    }
  }

  try {
    const newMessage = new Message({ name, email, text });
    await newMessage.save();
    res.status(201).json({ success: true, message: 'Message logged successfully' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Server error processing contact transmission' });
  }
});

// GET /api/messages: Retrieve all logs (Admin command terminal use only)
router.get('/', authenticateJWT, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    console.log('MongoDB offline, retrieving messages from fallback JSON.');
    const messages = getFallbackMessages().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return res.json(messages);
  }

  try {
    const messages = await Message.find({}).sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error retrieving contact database' });
  }
});

export default router;

// const axios = require('axios');
import axios from 'axios';
import { saveCache, getCache } from '../lib/cache.js';
import { captureException } from '../handlers/exceptionHandler.js';

export const participants = async (req, res) => {
  const { ispb } = req.params;

  if (!ispb || ispb.length !== 8 || !/^\d+$/.test(ispb)) {
    return res.status(400).json({ error: 'Invalid ISPB code' });
  }

  const cacheKey = `pix:participant:${ispb}`;
  const cacheData = await getCache(cacheKey);

  if (cacheData) {
    return res.json(JSON.parse(cacheData));
  }

  const participantsData = await fetchParticipants();

  if (!participantsData) {
    return res.status(503).json({ error: 'Service unavailable' });
  }

  const participant = participantsData.find(p => p.ispb === ispb);

  if (!participant) {
    return res.status(404).json({ error: 'Participant not found' });
  }

  saveCache(cacheKey, JSON.stringify(participant), 86400);

  res.json(participant);
}

async function fetchParticipants() {
  try {
    const response = await axios.get(process.env.BCB_PIX_URL + 'asdasda');
    return response.data;
  } catch (error) {
    captureException(error);
    return false;
  }
}
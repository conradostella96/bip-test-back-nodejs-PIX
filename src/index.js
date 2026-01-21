const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

let cache = null; // cache sem TTL (bug adicional)

app.get('/pix/participants/:ispb', async (req, res) => {
  const { ispb } = req.params;

  if (!ispb || ispb.length !== 8 || !/^\d+$/.test(ispb)) {
    return res.status(400).json({ error: 'Invalid ISPB code' });
  }

  console.log(`${process.env.BCB_PIX_URL}?@Data=${encodeURIComponent(`'2020-11-16'`)}&$filter=${encodeURIComponent(`ISPB eq '${ispb}'`)}&$format=json`);

  // if (!cache) {
    const response = await axios.get(`${process.env.BCB_PIX_URL}?@Data=${encodeURIComponent(`'2020-11-16'`)}&$filter=${encodeURIComponent(`ISPB eq '${ispb}'`)}&$format=json`);
    cache = response.data?.value;
  // }

  console.log(cache);
  const participant = cache.find(p => p.ispb === ispb); // BUG proposital

  if (!participant) {
    return res.status(404).json({ error: 'Participant not found' });
  }

  res.json(participant);
});

app.listen(PORT, () => {
  console.log(`PIX Service running on port ${PORT}`);
});

import express from 'express';
import { participants } from './services/pix.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/pix/participants/:ispb', participants);

app.listen(PORT, () => {
  console.log(`PIX Service running on port ${PORT}`);
});

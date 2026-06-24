import dotenv from 'dotenv';
import { createApp } from './app.js';

dotenv.config();

const app = createApp();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`DealSight API listening on port ${port}`);
});

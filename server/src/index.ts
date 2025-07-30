
import express from 'express';
import cors from 'cors';
import { config } from './config.js';

const app = express();
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// IMPORTANT: bind to 0.0.0.0 so Codespaces can forward the port
app.listen(config.PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${config.PORT}`);
});

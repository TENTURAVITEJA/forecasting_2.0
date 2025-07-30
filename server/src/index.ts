
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { forecastRouter } from './routes/forecast.js';

const app = express();
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/forecast', forecastRouter);

app.listen(config.PORT, () => {
  console.log(`Server listening on http://localhost:${config.PORT}`);
});

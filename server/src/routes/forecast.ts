
import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { readBufferAsRows } from '../utils/parse.js';
import { resample } from '../utils/resample.js';
import { forecast } from '../utils/forecast.js';
import { Frequency } from '../types.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const schema = z.object({
  dateCol: z.string().min(1),
  valueCol: z.string().min(1),
  frequency: z.enum(['D','W','M'] as [Frequency, Frequency, Frequency]),
  horizon: z.coerce.number().int().min(1).max(60),
});

export const forecastRouter = Router();

forecastRouter.post('/', upload.single('file'), async (req, res) => {
  try {
    const parsed = schema.parse(req.body);
    if (!req.file) return res.status(400).json({ error: 'file is required' });

    const rows = readBufferAsRows(req.file.buffer, req.file.originalname, parsed.dateCol, parsed.valueCol);
    const ts = resample(rows, parsed.frequency);
    const result = forecast(ts, parsed.frequency, parsed.horizon);
    return res.json({
      status: 'ok',
      order: result.order,
      validation_mape: result.validation_mape,
      points: ts.map(r => ({ date: r.date.toISOString(), value: r.value })),
      forecast: result.forecast.map(r => ({ date: r.date.toISOString(), value: r.value })),
    });
  } catch (e: any) {
    console.error(e);
    return res.status(400).json({ error: e.message || 'Bad Request' });
  }
});

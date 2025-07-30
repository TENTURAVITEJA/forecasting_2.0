
import _pkg from 'arima';
const ARIMA: any = (_pkg as any).default ?? (_pkg as any);
import { Frequency, Row } from '../types.js';
import { step } from './resample.js';
import { mape } from './metrics.js';

type FitResult = { order: [number, number, number], mape: number, model: any };

export function fitArimaAuto(series: number[]): FitResult {
  const candidates: [number, number, number][] = [];
  for (let p = 0; p <= 2; p++) for (let d = 0; d <= 1; d++) for (let q = 0; q <= 2; q++) {
    if (p === 0 && d === 0 && q === 0) continue;
    candidates.push([p, d, q]);
  }

  const valSize = Math.min(12, Math.max(0, Math.floor(series.length * 0.2)));
  const train = valSize > 0 ? series.slice(0, -valSize) : series.slice();
  const yTrue = valSize > 0 ? series.slice(-valSize) : [];

  let best: FitResult | null = null;
  for (const [p, d, q] of candidates) {
    try {
      const arima = new ARIMA({ p, d, q, verbose: false }).train(train);
      const [pred] = arima.predict(valSize || 1);
      const score = valSize ? mape(yTrue, Array.from(pred).slice(0, valSize) as number[]) : 0;
      if (!best || score < best.mape) best = { order: [p, d, q], mape: score, model: arima };
    } catch {}
  }
  if (!best) {
    const arima = new ARIMA({ p: 1, d: 1, q: 1, verbose: false }).train(series);
    return { order: [1, 1, 1], mape: Number.NaN, model: arima };
  }
  // retrain on full series
  const arima = new ARIMA({ p: best.order[0], d: best.order[1], q: best.order[2], verbose: false }).train(series);
  return { order: best.order, mape: best.mape, model: arima };
}

export function forecast(rows: Row[], freq: Frequency, horizon: number) {
  if (rows.length < 6) throw new Error('Not enough data points (min 6).');
  const series = rows.map(r => r.value);
  const fit = fitArimaAuto(series);
  const [pred] = fit.model.predict(horizon);

  const lastDate = rows[rows.length - 1].date;
  const out = [];
  let current = new Date(lastDate);
  for (let i = 0; i < horizon; i++) {
    current = step(current, freq);
    out.push({ date: new Date(current), value: Number(pred[i]) });
  }
  return { order: fit.order, validation_mape: fit.mape, forecast: out };
}

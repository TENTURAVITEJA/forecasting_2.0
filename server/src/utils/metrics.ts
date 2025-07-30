
export function mape(yTrue: number[], yPred: number[]): number {
  let s = 0, n = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const t = yTrue[i];
    const p = yPred[i];
    if (t !== 0) {
      s += Math.abs((t - p) / t);
      n++;
    }
  }
  return n ? (s / n) * 100 : Number.NaN;
}

export function mae(yTrue: number[], yPred: number[]): number {
  let s = 0;
  for (let i = 0; i < yTrue.length; i++) s += Math.abs(yTrue[i] - yPred[i]);
  return s / yTrue.length;
}

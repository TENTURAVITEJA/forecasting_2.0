
import fs from 'node:fs/promises';
import { parse as csvParse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { z } from 'zod';
import { Row } from '../types.js';

const schema = z.object({
  dateCol: z.string().min(1),
  valueCol: z.string().min(1),
});

export function readBufferAsRows(buf: Buffer, filename: string, dateCol: string, valueCol: string): Row[] {
  const ext = filename.toLowerCase();
  let rows: any[] = [];

  if (ext.endsWith('.csv')) {
    const recs = csvParse(buf, { columns: true, skip_empty_lines: true, trim: true });
    rows = recs;
  } else if (ext.endsWith('.xlsx') || ext.endsWith('.xls')) {
    const wb = XLSX.read(buf);
    const ws = wb.Sheets[wb.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(ws);
  } else {
    throw new Error(`Unsupported file type: ${filename}`);
  }

  const parsed: Row[] = [];
  for (const r of rows) {
    const d = new Date(String(r[dateCol]));
    const v = Number(String(r[valueCol]).replace(/[, ]/g, ''));
    if (Number.isFinite(d.getTime()) && Number.isFinite(v)) {
      parsed.push({ date: d, value: v });
    }
  }

  parsed.sort((a, b) => a.date.getTime() - b.date.getTime());
  return parsed;
}

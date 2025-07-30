
import React, { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import ForecastChart from '../shared/ForecastChart'

const schema = z.object({
  dateCol: z.string().min(1),
  valueCol: z.string().min(1),
  frequency: z.enum(['D','W','M']),
  horizon: z.coerce.number().int().min(1).max(60),
})

type FormValues = z.infer<typeof schema>

// was: const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
const API = import.meta.env.VITE_API_BASE || '/api';


export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { frequency: 'M', horizon: 6 }
  })

  const onSubmit = async (values: FormValues) => {
    if (!file) return alert('Please choose a CSV/XLSX file.')
    const form = new FormData()
    form.append('file', file)
    Object.entries(values).forEach(([k, v]) => form.append(k, String(v)))
    const res = await axios.post(`${API}/forecast`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
    setResult(res.data)
  }

  return (
    <div className="grid gap-6">
      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Upload your data</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Date column</label>
            <input className="mt-1 w-full border rounded px-3 py-2" placeholder="e.g., Date" {...register('dateCol')} />
            {errors.dateCol && <p className="text-red-600 text-sm mt-1">{errors.dateCol.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Value column</label>
            <input className="mt-1 w-full border rounded px-3 py-2" placeholder="e.g., Sales" {...register('valueCol')} />
            {errors.valueCol && <p className="text-red-600 text-sm mt-1">{errors.valueCol.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Frequency</label>
            <select className="mt-1 w-full border rounded px-3 py-2" {...register('frequency')}>
              <option value="D">Daily</option>
              <option value="W">Weekly</option>
              <option value="M">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Horizon</label>
            <input type="number" className="mt-1 w-full border rounded px-3 py-2" {...register('horizon')} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">File (CSV/XLSX)</label>
            <input type="file" accept=".csv,.xlsx,.xls" className="mt-1 w-full" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="rounded bg-black text-white px-4 py-2">Run Forecast</button>
          </div>
        </form>
      </section>

      {result && (
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Results</h2>
          <div className="text-sm text-gray-600 mb-4">
            Best ARIMA order: ({result.order.join(', ')}) • Validation MAPE: {Number(result.validation_mape || 0).toFixed(2)}%
          </div>
          <ForecastChart points={result.points} forecast={result.forecast} />
          <div className="mt-4 text-sm text-gray-600">Total historical points: {result.points.length}; Forecast horizon: {result.forecast.length}</div>
        </section>
      )}
    </div>
  )
}

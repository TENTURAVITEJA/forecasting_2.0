
import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'

type Point = { date: string, value: number }

export default function ForecastChart({ points, forecast }: { points: Point[], forecast: Point[] }) {
  const data = [
    ...points.map(p => ({ date: p.date.slice(0, 10), actual: p.value, forecast: null })),
    ...forecast.map(f => ({ date: f.date.slice(0, 10), actual: null, forecast: f.value }))
  ]
  return (
    <div style={{ width: '100%', height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" dot={false} />
          <Line type="monotone" dataKey="forecast" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

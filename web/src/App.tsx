
import React from 'react'
import UploadPage from './pages/UploadPage'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">AI Forecasting</h1>
          <nav className="text-sm text-gray-600">Upload • Forecast • Visualize</nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <UploadPage />
      </main>
      <footer className="py-6 text-center text-xs text-gray-500">© 2025 Forecast Inc.</footer>
    </div>
  )
}

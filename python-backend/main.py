from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import io

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, use your domain
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/forecast")
async def forecast_endpoint(
    file: UploadFile,
    date_column: str = Form(...),
    value_column: str = Form(...),
    frequency: str = Form(...),
    horizon: int = Form(...),
):
    try:
        # Read file into DataFrame
        contents = await file.read()
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            return JSONResponse({"error": "Unsupported file format"}, status_code=400)

        # Sample Forecast Logic (Replace with your model)
        df[date_column] = pd.to_datetime(df[date_column])
        df = df[[date_column, value_column]].dropna()
        df = df.sort_values(by=date_column)

        last_date = df[date_column].max()
        future_dates = pd.date_range(start=last_date, periods=horizon + 1, freq=frequency[0])[1:]
        forecast = [{"date": str(d.date()), "forecast": round(df[value_column].mean(), 2)} for d in future_dates]

        return {"forecast": forecast}

    e

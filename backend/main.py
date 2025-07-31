from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
from prophet import Prophet
import uvicorn
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to ["http://localhost:8080"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/forecast")
async def forecast_sales(
    date_column: str = Form(...),
    value_column: str = Form(...),
    frequency: str = Form(...),
    horizon: int = Form(...),
    file: UploadFile = File(...)
):
    try:
        contents = await file.read()
        filename = file.filename.lower()
        # Support both CSV and Excel
        if filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(contents.decode()))
        elif filename.endswith('.xlsx'):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            return JSONResponse(content={"error": "Unsupported file type."}, status_code=400)

        # Check columns
        if date_column not in df.columns or value_column not in df.columns:
            return JSONResponse(content={"error": "Column names not found in file."}, status_code=400)

        df = df[[date_column, value_column]].dropna()
        df.columns = ["ds", "y"]

        model = Prophet()
        model.fit(df)

        freq_map = {'Monthly': 'M', 'Weekly': 'W', 'Daily': 'D'}
        freq = freq_map.get(frequency, 'M')
        future = model.make_future_dataframe(periods=horizon, freq=freq)
        forecast = model.predict(future)

        output = forecast[["ds", "yhat"]].tail(horizon).to_dict(orient="records")
        return JSONResponse(content={"forecast": output})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

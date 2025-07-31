from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
from prophet import Prophet
import uvicorn
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust for production
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
    file: UploadFile = Form(...)
):
    contents = await file.read()
    df = pd.read_csv(pd.compat.StringIO(contents.decode()))

    df = df[[date_column, value_column]]
    df.columns = ["ds", "y"]

    model = Prophet()
    model.fit(df)

    future = model.make_future_dataframe(periods=horizon, freq='M' if frequency == 'Monthly' else 'W' if frequency == 'Weekly' else 'D')
    forecast = model.predict(future)

    output = forecast[["ds", "yhat"]].tail(horizon).to_dict(orient="records")
    return JSONResponse(content={"forecast": output})

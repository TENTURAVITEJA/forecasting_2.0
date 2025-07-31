from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from prophet import Prophet
import pandas as pd
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

@app.post("/forecast")
async def forecast(
    date_column: str = Form(...),
    value_column: str = Form(...),
    frequency: str = Form(...),
    horizon: int = Form(...),
    file: UploadFile = File(...)
):
    contents = await file.read()
    if file.filename.endswith(".csv"):
        df = pd.read_csv(io.BytesIO(contents))
    else:
        df = pd.read_excel(io.BytesIO(contents))

    df = df[[date_column, value_column]].rename(columns={date_column: "ds", value_column: "y"})
    df["ds"] = pd.to_datetime(df["ds"])

    if frequency == "Monthly":
        df = df.resample("MS", on="ds").sum().reset_index()
    elif frequency == "Weekly":
        df = df.resample("W", on="ds").sum().reset_index()

    model = Prophet()
    model.fit(df)

    future = model.make_future_dataframe(periods=horizon, freq={"Daily": "D", "Weekly": "W", "Monthly": "M"}[frequency])
    forecast = model.predict(future)

    return forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(horizon).to_dict(orient="records")

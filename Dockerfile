FROM python:3.10-slim
WORKDIR /app
COPY ./backend /app
RUN pip install --no-cache-dir -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

docker build -t forecast-ai .
docker run -p 8000:8000 forecast-ai


FROM mcr.microsoft.com/playwright/python:v1.60.0-noble

WORKDIR /app
COPY server/requirements.txt /app/server/requirements.txt
RUN pip install --no-cache-dir -r /app/server/requirements.txt && apt-get update && apt-get install -y --no-install-recommends fonts-noto-cjk && rm -rf /var/lib/apt/lists/*
COPY server /app/server
CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src
COPY .env.example .env

EXPOSE 3002

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "3002", "--reload"]
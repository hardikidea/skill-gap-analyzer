# Use lightweight Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install all dependencies from your requirements.txt
RUN pip install --no-cache-dir --upgrade pip && pip install -r requirements.txt
#RUN pip install --upgrade pip
#RUN pip install --no-cache-dir -r requirements.txt

# Copy your full application source code
COPY . .

# Expose the port (must match uvicorn)
EXPOSE 9090

# Run the FastAPI app with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9090"]

#FROM python:3.11-slim
#
#WORKDIR /app
#COPY . /app
#
#RUN pip install --no-cache-dir fastapi uvicorn langgraph
#
#EXPOSE 9090
#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9090"]

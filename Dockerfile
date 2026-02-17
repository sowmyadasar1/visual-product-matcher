FROM node:20

WORKDIR /app

# Install system deps + ONNX runtime
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install ONNX Runtime manually
RUN wget https://github.com/microsoft/onnxruntime/releases/download/v1.16.3/onnxruntime-linux-x64-1.16.3.tgz && \
    tar -xzf onnxruntime-linux-x64-1.16.3.tgz && \
    cp onnxruntime-linux-x64-1.16.3/lib/libonnxruntime.so* /usr/lib/ && \
    ldconfig

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]

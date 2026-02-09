FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

ENV NODE_OPTIONS="--max-old-space-size=2560"

ENV GENERATE_SOURCEMAP=false

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]
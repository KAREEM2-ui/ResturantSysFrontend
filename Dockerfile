FROM node:alpine
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source and build
COPY . .

arg MODE
arg VITE_API_BACKEND
arg VITE_GEO_API_URL



ENV VITE_API_BACKEND=$VITE_API_BACKEND
ENV VITE_GEO_API_URL=$VITE_GEO_API_URL
ENV MODE=$MODE




RUN npm run build

EXPOSE 5173
CMD ["npm", "start"]

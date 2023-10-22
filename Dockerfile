# Build dependencies
FROM node:18.14.2 as dependencies
WORKDIR /app
ENV PORT 8080
ENV HOST 0.0.0.0
COPY package.json .
# COPY ENV variable


# COPY .env.development ./
COPY . .
RUN npm install

# Set NODE_ENV environment variable
ENV DATABASE_URL="postgresql://postgres:c4c4d456@localhost:5432/tanum"
# ENV NODE_ENV production

# Build production image
# FROM dependencies as builder
# RUN npm run build
# EXPOSE 8080
# EXPOSE 3001

# start command
CMD ["npm", "run", "start:prod"]
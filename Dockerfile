# Build dependencies
FROM node:20.5.0-alpine as dependencies
WORKDIR /app
ENV PORT 4000
ENV HOST 0.0.0.0
COPY package.json .
COPY prisma ./prisma/

COPY . .
RUN npm install

RUN npx prisma generate

# Set NODE_ENV environment variable
ENV DATABASE_URL="postgresql://postgres:c4c4d456@localhost:5432/tanum"
# ENV NODE_ENV production

EXPOSE 4000
CMD ["npm", "run", "start:prod"]
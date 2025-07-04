FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

# Add build-time env vars
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

RUN npm install


COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
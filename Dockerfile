FROM tracks-fe:221123

ENV HOSTNAME "localhost"
ENV PORT "3000"

RUN mkdir -p /app/frontend
WORKDIR /app/frontend
COPY . .
RUN rm -rf .env.local

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
FROM node:16

WORKDIR /app

COPY . .

RUN npm install

RUN npm build

RUN cd /src
RUN npx prisma migrate dev --name "with-journal"

EXPOSE 8000

CMD ['npm', 'run', 'start']
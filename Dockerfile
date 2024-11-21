FROM node:16

WORKDIR /app

COPY . .

RUN npm install

RUN npm build

RUN cd /src
# RUN npx prisma migrate dev --name "with-journal"
# RUN npx prisma migrate deploy --name "first-migrate"

# run generate prisma types and migrate db from local to server
RUN npx prisma generate
RUN npx prisma migrate resolve --applied "20241119030225_update_with_article_source"
RUN npx prisma migrate deploy

EXPOSE 8000

CMD ['npm', 'run', 'start']
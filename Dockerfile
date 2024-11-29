FROM node:16

WORKDIR /app

COPY . .

RUN npm install

RUN npm build

RUN cd /src/database
# RUN npx prisma migrate dev --name "migrate-to-new-db-moodifyV2"

# change sudo root with user c014b4ky1824
# sudo chown $USER:$USER /home/c014b4ky1824/backend-v2/package-lock.json
# COPY --chown=user:user package-lock.json .

# run generate prisma types and migrate db from local to server
RUN npx prisma generate

# run when database not migrated yet
RUN npx prisma migrate resolve --applied "20241119030225_update_with_article_source"
RUN npx prisma migrate resolve --applied "20241128142733_update_user_with_refresh_token"

# npx prisma migrate resolve --applied "migrate-to-new-db-moodifyV2"
RUN npx prisma migrate deploy

EXPOSE 8000

CMD ['npm', 'run', 'start']
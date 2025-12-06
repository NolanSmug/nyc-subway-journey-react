FROM node:23-slim AS builder

WORKDIR /usr/src/app

# Ensure yarn 3.6.4 is being used
RUN corepack enable && corepack prepare yarn@3.6.4 --activate

COPY package.json yarn.lock .yarnrc.yml ./
COPY ./.yarn ./.yarn

ENV NODE_VERSION=22.12.0
ENV YARN_VERSION=3.6.4

RUN yarn install --immutable

COPY . .

RUN yarn build

FROM nginx:alpine

COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# start the app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

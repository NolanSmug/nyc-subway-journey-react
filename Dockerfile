FROM node:23-slim

WORKDIR /usr/src/app

# Ensure yarn 3.6.4 is being used
RUN corepack enable && corepack prepare yarn@3.6.4 --activate && yarn --version

COPY package.json yarn.lock .yarnrc.yml ./
COPY ./.yarn ./.yarn

ENV NODE_VERSION=22.12.0
ENV YARN_VERSION=3.6.4

RUN yarn install && yarn cache clean
COPY . .

EXPOSE 3000
CMD ["yarn", "start"]

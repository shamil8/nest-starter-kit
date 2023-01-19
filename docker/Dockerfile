FROM node:16-alpine

ADD ./ /app
WORKDIR /app

RUN rm -rf ./docker

RUN apk add git
RUN git config --global user.email "dockerbot@example.com"
RUN git config --global user.name "DockerBot"

RUN yarn install
RUN yarn build

# start nest
ENTRYPOINT ["yarn", "start:prod"]

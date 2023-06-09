# base image
FROM node:14.21.2 as build-deps

# set working directory
ENV NODE_ROOT /usr/src/app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Issue with babel mismatch in dependency
ENV SKIP_PREFLIGHT_CHECK=true

RUN yarn build

FROM nginxinc/nginx-unprivileged:1.23-alpine
USER root
RUN apk add coreutils
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
COPY --from=build-deps /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/static/env.js
RUN ln -s /tmp/env.js /usr/share/nginx/html/static/env.js
USER nginx
EXPOSE 80

RUN printenv

CMD ["sh", "-c", "envsubst < /usr/share/nginx/html/static/env.template.js > /tmp/env.js && exec nginx -g 'daemon off;'"]

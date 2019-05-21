FROM node:lts-alpine as build
MAINTAINER leo.lou@gov.bc.ca

WORKDIR /app
RUN apk update \
  && apk add alpine-sdk python ruby ruby-dev ruby-io-console ruby-irb ruby-json ruby-rake libffi libffi-dev \
  && git config --global url.https://github.com/.insteadOf git://github.com/ \
  && gem install --no-ri --no-rdoc ffi jekyll \
  && npm install -g node-sass browserify grunt-cli serve@1.4.0 \
  && mkdir -p /app \
  && git clone $FEATURESRC /tmp/repo1 \
  && git -C /tmp/repo1 pull \
  && cp -r /tmp/repo1/* /app \
  && rm -rf /tmp/repo1

ADD . /app

RUN npm install && npm update && grunt build -url ${BASEURL} --force

FROM abiosoft/caddy:no-stats
COPY --from=build /app /srv

EXPOSE 2015

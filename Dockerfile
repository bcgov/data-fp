FROM alpine:3.6
MAINTAINER leo.lou@gov.bc.ca

ADD . /app
WORKDIR /app
RUN apk update \
  && apk add alpine-sdk nodejs nodejs-npm python ruby ruby-dev ruby-io-console ruby-irb ruby-json ruby-rake ruby-rdoc libffi libffi-dev \
  && git config --global url.https://github.com/.insteadOf git://github.com/ \
  && gem update --system \
  && gem install ffi jekyll \
  && npm config set unsafe-perm true \
  && npm install -g node-sass browserify grunt-cli serve@1.4.0 \
  && mkdir -p /app \
  && git clone --branch $FEATURESRC_BRANCH $FEATURESRC /tmp/repo1 \
  && git -C /tmp/repo1 pull \
  && cp -r /tmp/repo1/* /app \
  && rm -rf /tmp/repo1 

RUN npm install && npm update && grunt build -url ${BASEURL} --force \
  && adduser -S jekyll \
  && chown -R jekyll:0 /app && chmod -R 770 /app \
  && apk del --purge alpine-sdk python ruby ruby-dev ruby-io-console ruby-irb ruby-json ruby-rake libffi libffi-dev  

USER jekyll

WORKDIR /app/_site
EXPOSE 3000
CMD serve -C -S -D -J --compress -f ./favicon.ico .

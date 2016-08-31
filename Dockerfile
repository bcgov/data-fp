FROM alpine:3.4
MAINTAINER leo.lou@gov.bc.ca

RUN apk update \
  && apk add alpine-sdk nodejs python ruby ruby-dev ruby-io-console ruby-irb ruby-json ruby-rake libffi libffi-dev \
  && git config --global url.https://github.com/.insteadOf git://github.com/ \
  && gem install --no-ri --no-rdoc ffi jekyll jekyll-sass \
  && npm install -g browserify bower grunt-cli serve

RUN mkdir -p /app
  
RUN git clone $FEATURESRC /tmp/repo1 \
  && cp -r /tmp/repo1/* /app \
  && rm -rf /tmp/repo1 
  
WORKDIR /app
ADD . /app
RUN npm install && npm update
RUN bower install --allow-root
RUN grunt build -url $BASEURL
RUN adduser -S jekyll
RUN chown -R jekyll:0 /app && chmod -R 770 /app
RUN apk del --purge alpine-sdk python ruby ruby-dev ruby-io-console ruby-irb ruby-json ruby-rake libffi libffi-dev  

USER jekyll
RUN grunt sass:build && grunt copy
WORKDIR /app/_site
EXPOSE 3000
CMD serve -C -D -J -S --compress -f .

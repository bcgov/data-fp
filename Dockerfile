FROM node:latest
RUN \
  DEBIAN_FRONTEND=noninteractive apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    curl \
    git \
    ruby \
    ruby-dev \
  && git config --global url.https://github.com/.insteadOf git://github.com/ \
  && gem install --no-ri --no-rdoc \
    jekyll \
  && mkdir /src \
  && DEBIAN_FRONTEND=noninteractive apt-get purge -y \
    build-essential \
    ruby-dev \
  && DEBIAN_FRONTEND=noninteractive apt-get autoremove -y \
  && DEBIAN_FRONTEND=noninteractive apt-get clean \
  && cd /src \
  && git clone https://github.com/BCDevOps/data-fp.git \
  && npm install -g bower \
  && npm install -g grunt-cli \
  && cd /src/data-fp \
  && npm install \
  && bower install --allow-root \
  && grunt build \
  && jekyll serve /src/data-fp --detach \
  && rm -Rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 4000
VOLUME /src
WORKDIR /src
ENTRYPOINT ["jekyll", "serve" "--detach"]

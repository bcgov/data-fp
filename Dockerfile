FROM openshift/base-centos7
MAINTAINER leo.lou@gov.bc.ca

RUN curl -sL https://rpm.nodesource.com/setup_4.x | bash -
RUN yum install -y nodejs ruby ruby-devel rubygems
RUN git config --global url.https://github.com/.insteadOf git://github.com/ \
  && gem install --no-ri --no-rdoc \
    jekyll \
  && npm install -g bower node-gyp grunt-cli serve

RUN git clone https://github.com/bcgov/data-fp-features.git /tmp/repo1 \
  && cp -r /tmp/repo1/* /opt/app-root \
  && rm -Rf /tmp/repo1  
ADD . /opt/app-root
RUN cd /opt/app-root && \
 npm install && \
 bower install --allow-root
RUN grunt build -url=$BASEURL
WORKDIR /opt/app-root
RUN chown -R 1001:0 /opt/app-root && chmod -R ug+rwx /opt/app-root
USER 1001
EXPOSE 4000
CMD serve -C -D -p 4000 --compress /opt/app-root/_site

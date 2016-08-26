FROM openshift/base-centos7
MAINTAINER leo.lou@gov.bc.ca

RUN curl -sL https://rpm.nodesource.com/setup_6.x | bash -
RUN yum install -y nodejs ruby ruby-devel rubygems
RUN git config --global url.https://github.com/.insteadOf git://github.com/ \
  && gem install --no-ri --no-rdoc \
    jekyll \
  && npm install -g bower \
  && npm install -g grunt-cli serve
  
ADD . /opt/app-root
RUN cd /opt/app-root && \
 npm install && \
 bower install --allow-root && \
 grunt build
WORKDIR /opt/app-root
RUN chown -R 1001:0 /opt/app-root && chmod -R ug+rwx /opt/app-root
USER 1001
EXPOSE 4000
CMD serve -C -D -p 8080 --compress /opt/app-root/_site

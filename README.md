[![Build Status](https://cis.data.gov.bc.ca/job/data-fp-test/badge/icon)](https://cis.data.gov.bc.ca/job/data-fp-test/)
[![Stories in Ready](https://badge.waffle.io/bcgov/ckanext-bcgov.png?label=ready&title=Ready)](https://waffle.io/bcgov/ckanext-bcgov)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/bcgov/data-fp/master/LICENSE)
<a rel="Inspiration" href="https://github.com/BCDevExchange/docs/blob/master/discussion/projectstates.md"><img alt="An idea being explored and shaped. Open for discussion, but may never go anywhere." style="border-width:0" src="http://bcdevexchange.org/badge/1.svg" title="An idea being explored and shaped. Open for discussion, but may never go anywhere." /></a>

# data-fp

This provides the frontpage of data.gov.bc.ca.

## Requirements
1. [Jekyll][0]
2. [npm][1]
3. [bower][2]
4. [Grunt][3]

There is also a [Vagrant box][4] available to make setup easier.

## Installation
1. Clone the repo and ```cd``` into the directory.
2. ```npm install```
3. ```bower install```
4. ```grunt build```

This will initialize the site files.

## Development

There is a ```grunt dev``` task that acts as a watcher for development purposes.  It will trigger a rebuild of the site as files change.

By default, the site is available at [http://localhost:4000](http://localhost:4000).

## Starting Jekyll

To serve the site using Jekyll, use the ```grunt serve --host=<host> --port=<port>``` command.  By default, it uses the following options:

```
host=0.0.0.0
port=4000
```

The site will be available at ```http://<host>:<port>```.

## Content

Content is not tracked inside this repo.  The site uses a custom post type called ```visualizations``` and is stored in Markdown format inside the ```_visualizations``` directory.

### Visualization front-matter

The ```visualization``` post type follows this format:

```
---
layout: visualization
title:
published:
source:
  name: 
  url: 
iframe_url: 
order: 
---
```

| Field 						| Explanation																										|
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| ```layout```					| The layout used when Jekyll generates the static HTML.  Leave as ```visualization```.								|
| ```title```					| The title of the visualization.                                                    								|
| ```published```				| Boolean value.  ```true``` shows the visualization on the front-page inside the carousel, ```false``` hides it.	|
| ```source```					| The source of the visualization.  The ```name``` provides a name, and ```url``` provides a link to the source.	|
| ```iframe_url```				| An embeddable version of the visualization.  This is included on the front-page of the site inside a carousel.	|
| ```order```					| An optional field that determines the order of the visualizations.  Ascending order.								|


Here is an example of a visualization:

```
---
layout: visualization
title: My Visualization
published: true
source:
  name: The name of my Visualization source
  url: http://link.to.my.visualization.source.com
iframe_url: http://link.to.my.visualization.frame.com
order: 100
---
```

[0]: http://jekyllrb.com/
[1]: https://www.npmjs.com/
[2]: http://bower.io/
[3]: http://gruntjs.com/
[4]: http://

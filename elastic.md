---
title: Installing Elasticsearch
layout: page
permalink: /elastic.html
---

### Writing to Elasticsearch and visualizing data with Kibana

The [To Elasticsearch]({{ site.baseurl }}/exercises/toElastic.html) exercise involves modifying the [Popular Places program]({{ site.baseurl }}/exercises/popularPlaces.html) so that it writes its results to an Elasticsearch index. [Elasticsearch](https://www.elastic.co/products/elasticsearch) is a popular distributed search engine available under Apache License. The following instructions show how to set up a local Elasticsearch instance.

#### Setup Elasticsearch

* Download Elasticsearch 2.4.3 [here](https://download.elastic.co/elasticsearch/release/org/elasticsearch/distribution/tar/elasticsearch/2.4.3/elasticsearch-2.4.3.tar.gz)

* Extract the archive file:

~~~bash
tar xvfz elasticsearch-2.4.3.tar.gz
~~~

* Enter the extracted directory and start Elasticsearch:

~~~bash
cd elasticsearch-2.4.3
./bin/elasticsearch &
~~~

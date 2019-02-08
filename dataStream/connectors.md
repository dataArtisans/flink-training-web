---
title: DataStream API Connectors
layout: page
permalink: /dataStream/connectors.html
---

Flink features connectors for several exernal storage systems to ingest and emit data streams. In this lesson you will learn

* which connectors Flink provides and their capabilities,
* how to include and use source and sink connectors in your program, and
* what consistency guarantees Flink can provide.

For the programming exercises you can

* [setup a local Apache Kafka instance]({{ site.baseurl }}/kafka.html) and [connect two streaming programs through Kafka]({{ site.baseurl }}/exercises/toFromKafka.html), and
* [setup a local Elasticsearch instance]({{ site.baseurl }}/elastic.html) and [write data to Elasticsearch and visualize it with Kibana]({{ site.baseurl }}/exercises/toElastic.html)

<iframe src="//www.slideshare.net/slideshow/embed_code/key/o8jb5Wb5iPK4ui" width="680" height="571" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>

### References

- [Kafka + Flink: A Practical, How-To Guide](https://ververica.com/blog/kafka-flink-a-practical-how-to)
- [Building real-time dashboard applications with Apache Flink, Elasticsearch, and Kibana](https://www.elastic.co/blog/building-real-time-dashboard-applications-with-apache-flink-elasticsearch-and-kibana)

- [Streaming Connectors (docs)]({{ site.docs }}/dev/connectors/index.html)
- [Linking with modules not contained in the binary distribution (docs)]({{ site.docs }}/dev/linking.html)
- [Apache Kafka Connector (docs)]({{ site.docs }}/dev/connectors/kafka.html)
- [Using Kafka timestamps and Flink event time in Kafka 0.10]({{ site.docs }}/dev/connectors/kafka.html#using-kafka-timestamps-and-flink-event-time-in-kafka-010)

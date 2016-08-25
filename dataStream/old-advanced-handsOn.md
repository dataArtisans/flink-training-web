---
title: 6. DataStream API Advanced - Hands-On
layout: page
permalink: /dataStreamAdvanced/handsOn.html
---

In this hands-on session you can continue to work on programming exercises or experiment with Flink's DataStream API features. 

### Continue working on programming exercises


Choose one of the remaining DataStream API exercises and try to solve it

- The [Popular Places exercise]({{ site.baseurl }}/exercises/popularPlaces.html) shows how to use window functions.
- The [To/From Kafka exercise]({{ site.baseurl }}/exercises/toFromKafka.html) shows how Flink programs can write to and read from [Apache Kafka](http://kafka.apache.org). Please follow the Apache Kafka setup guide below, before you start working on this exercise.

Alternatively, you can play around with features of the DataStream API such as:

- POJO or case classes data types
- Window operators
- Co-operators
- Kafka sources and sinks

### Setup a local Apache Kafka instance

[Apache Kafka](http://kafka.apache.org) is a central component in many infrastructures that process data streams. Kafka is a distributed and durable publish-subscribe system for data streams. A stream is called *topic* and can be populated from multiple sources and read from multiple consumers. Topics are persisted to harddisk and can be replayed.

Please follow these instructions to setup a local Kafka instance.

[Download](https://www.apache.org/dyn/closer.cgi?path=/kafka/0.8.2.2/kafka_2.10-0.8.2.2.tgz) Apache Kafka 0.8.2 for Scala 2.10 and un-tar it.

~~~bash
tar -xzf kafka_2.10-0.8.2.2.tgz
cd kafka_2.10-0.8.2.2
~~~

Start an Apache Zookeeper instance (Kafka coordinates itself with ZooKeeper) on `localhost:2181`.

~~~bash
./bin/zookeeper-server-start.sh config/zookeeper.properties &
~~~

Start a Kafka instance on `localhost:9092`.

~~~bash
./bin/kafka-server-start.sh config/server.properties &
~~~

By default, Kafka persists data stream topics to `/tmp/kafka_logs`. Topics can be removed by deleting this directory when Kafka is shutdown. You can stop Kafka and ZooKeeper by calling the `./bin/kafka-server-stop.sh` and `./bin/zookeeper-server-stop.sh` scripts (in that order!).

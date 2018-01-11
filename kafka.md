---
title: Installing Kafka
layout: page
permalink: /kafka.html
---

Some of these hands-on exercises expect that you first setup a local Kafka instance; see the exercises on [Writing to and Reading from Kafka]({{ site.baseurl }}/kafka.html).

### Connecting streaming programs through Kafka

[Apache Kafka](http://kafka.apache.org) is a central component in many data stream infrastructures. Kafka is a distributed publish-subscribe system for data streams based on the concept of durable logs. A stream is called *topic* and can be populated by multiple producers and read by multiple consumers. Topics are persisted to harddisks and can be replayed.

#### Setup a local Apache Kafka instance

The following instructions show how to setup a local Kafka instance in a few steps.

* Download Apache Kafka 0.11.0.2 for Scala 2.11 [here](https://www.apache.org/dyn/closer.cgi?path=/kafka/0.11.0.2/kafka_2.11-0.11.0.2.tgz).

* Extract the archive file and enter the extracted folder:

~~~bash
tar xvfz kafka_2.11-0.11.0.2.tgz
cd kafka_2.11-0.11.0.2
~~~

* Start an Apache Zookeeper instance (Kafka uses ZooKeeper for distributed coordination) on `localhost:2181`:

~~~bash
./bin/zookeeper-server-start.sh config/zookeeper.properties &
~~~

* Start a Kafka instance on `localhost:9092`:

~~~bash
./bin/kafka-server-start.sh config/server.properties &
~~~

### Deleting Kafka topics

Note that Kafka persists topics (i.e., data streams) to `/tmp/kafka_logs` by default. Should you need to, topics can be removed (or cleared) by shutting Kafka down and deleting this directory. You can stop Kafka and ZooKeeper by calling the `./bin/kafka-server-stop.sh` and `./bin/zookeeper-server-stop.sh` scripts (in that order!).

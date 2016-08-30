---
title: DataStream API Connectors - Hands-On
layout: page
permalink: /dataStream/3-handsOn.html
---

In this hands-on session, you will learn how to use Flink's connectors to write and read streams from and to external storage systems. The session consists of two tasks. First, you will setup a local Kafka instance, write data to a Kafka topic, and read it back. Later, we will show how to setup a local Elasticsearch instance, and write it to an Elasticsearch index to visualize it with Kibana.

### Writing a stream to Kafka and reading it back

[Apache Kafka](http://kafka.apache.org) is a central component in many data stream infrastructures. Kafka is a distributed publish-subscribe system for data streams based on the concept of durable logs. A stream is called *topic* and can be populated by multiple producers and read by multiple consumers. Topics are persisted to harddisks and can be replayed.

#### Setup a local Apache Kafka instance

The following instructions show how to setup a local Kafka instance in a few steps.

* Download Apache Kafka 0.9.0.1 for Scala 2.10 [here](https://www.apache.org/dyn/closer.cgi?path=/kafka/0.9.0.1/kafka_2.10-0.9.0.1.tgz).

* Extract the archive file and enter the extracted folder:

~~~bash
tar xvfz kafka_2.10-0.9.0.1.tgz 
cd kafka_2.10-0.9.0.1
~~~

* Start an Apache Zookeeper instance (Kafka uses ZooKeeper for distributed coordination) on `localhost:2181`:

~~~bash
./bin/zookeeper-server-start.sh config/zookeeper.properties &
~~~

* Start a Kafka instance on `localhost:9092`:

~~~bash
./bin/kafka-server-start.sh config/server.properties &
~~~

**Note:** Kafka persists topics (i.e., data streams) to `/tmp/kafka_logs` by default. Topics can be removed by shutting Kafka down and deleting this directory. You can stop Kafka and ZooKeeper by calling the `./bin/kafka-server-stop.sh` and `./bin/zookeeper-server-stop.sh` scripts (in that order!).

#### Write cleansed TaxiRides to a Kafka topic and read them back

Next, we modify your solutions for the previous two exercises and connect them through a Kafka topic.

1. The [TaxiRide Cleansing program]({{ site.baseurl }}/exercises/rideCleansing.html) shall write its result stream into a Kafka topic.
2. The [Popular Places program]( {{ site.baseurl }}/exercises/popularPlaces.html) shall read its input data (cleansed TaxiRides) from the Kafka topic.

The following **[exercise instructions]({{ site.baseurl }}/exercises/toFromKafka.html)** contain instructions and hints to adapt your programs.

### Writing to Elasticsearch (and visualizing data with Kibana)

The second exercise of this lesson is to modify the [Popular Places program]( {{ site.baseurl }}/exercises/popularPlaces.html) (either the original program or the version that reads from Kafka) such that it writes the result to an Elasticsearch index. [Elasticsearch](https://www.elastic.co/products/elasticsearch) is a popular distributed search engine available under Apache License. The following instructions show how to set up a local Elasticsearch instance.

#### Setup Elasticsearch

* Download Elasticsearch 2.3.5 [here](https://www.elastic.co/downloads/past-releases/elasticsearch-2-3-5)

* Extract the archive file:

~~~bash
tar xvfz elasticsearch-2.3.5.tar.gz
~~~

* Enter the extracted directory and start Elasticsearch:

~~~bash
cd elasticsearch-2.3.5
./bin/elasticsearch &
~~~

* Create an index called `nyc-idx`:

~~~bash
curl -XPUT "http://localhost:9200/nyc-idx"
~~~

* Create an index mapping called `popular-locations`:

~~~bash
curl -XPUT "http://localhost:9200/nyc-idx/_mapping/popular-locations" -d'
{
 "popular-locations" : {
   "properties" : {
      "cnt": {"type": "integer"},
      "location": {"type": "geo_point"},
      "time": {"type": "date"}
    }
 } 
}'
~~~

Elasticsearch is now set up and you can start writing data to the `nyc-idx` index.

#### Read TaxiRides from Kafka and write popular places to Elasticsearch

The following **[exercise instructions]( {{ site.baseurl }}/exercises/toElastic.html)** give guidance to modify your [Popular Places program]( {{ site.baseurl }}/exercises/popularPlaces.html) to write the resulting stream to our `nyc-idx` Elasticsearch index.

#### TODO: Visualize popular places on Kibana

This is a bonus task

*[Kibana](https://www.elastic.co/products/kibana) is a ...*


* Download Kibana 4.5.4 for your setup [here](https://www.elastic.co/downloads/past-releases/kibana-4-5-4)

* Extract the archive file and enter the extracted folder

* Start Kibana by running the start script

~~~bash
./bin/kibana
~~~

* Open [http://localhost:5601](http://localhost:5601) in your browser to access Kibana




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

#### Visualize popular places on Kibana

*[Kibana](https://www.elastic.co/products/kibana) is a web dashboard to visualize and explore data stored in Elasticsearch. In the following we show how to setup Kibana in a few steps and visualize popular places in New York on a map.

Just follow these instructions step-by-step:

* Download Kibana 4.5.4 for your setup [here](https://www.elastic.co/downloads/past-releases/kibana-4-5-4)

* Extract the archive file and enter the extracted folder

* Start Kibana by running the start script

~~~bash
./bin/kibana
~~~

* Open [http://localhost:5601](http://localhost:5601) in your browser to access Kibana

* The start page will ask you to configure an index pattern. Enter `nyc-idx` in the "Index name or pattern" text field and click the "Create" button without changing the "Time-field name".

<center>
<img src="{{ site.baseurl }}/images/kibana-1.png" width="85%">
</center>

* Click on the "Discover" button at the top. Kibana will tell you "No results found". This is because it only looks for data of the last 15 minutes while our TaxiRide records have a timestamp from January 2013. Click on the time picker in the upper right corner to select an absolute time range from `2013-01-01` to `2013-01-06` and click on the "Go" button.

<center>
<img src="{{ site.baseurl }}/images/kibana-2.png" width="85%">
</center>

* Click on the "Visualize" button at the top. Select "Tile map" and click on "From a new search". Kibana will show a map of the world. Next we will configure the visualization:
  * Click on "Value" and select "Sum" over the field `cnt` (this is the count we computed).
  * Select buckets type "Geo Coordinates" with "GeoHash" "Aggregation" on the `location` field (this is the coordinate of our count).

<center>
<img src="{{ site.baseurl }}/images/kibana-3.png" width="45%">
</center>

  * Click the green button with the triangle icon (play) and zoom the map on New York city.
  * You can try out Kibana's different visualizations by clicking on the "Options" button ans selecting a different "Map type".

<center>
<img src="{{ site.baseurl }}/images/kibana-4.png" width="85%">
</center>


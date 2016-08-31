---
layout: page
title: DataStream API - Write to Elasticsearch
permalink: /exercises/toElastic.html
---

The task of this exercise is to modify the [Popular Places program]({{ site.baseurl }}/exercises/popularPlaces.html) to write its results into an Elasticsearch index.

The [hands-on instructions]({{ site.baseurl }}/dataStream/3-handsOn.html) for the Connectors lesson give instructions for how to setup and start Elasticsearch. The following instruction help with the necessary modifications:

### Adding the Elasticsearch Connector dependency

Flink features connectors to several external systems. In order to keep the dependencies on the core slim, these connectors are organized in separate modules and have to be included as needed. The Elasticsearch connector can be used by adding the following dependency to your `pom.xml` file.

~~~xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-connector-elasticsearch2_2.10</artifactId>
  <version>1.1.1</version>
</dependency>
~~~

### Writing to Elasticsearch

The result of the Popular Places program is a `DataStream<Tuple5<Float, Float, Long, Boolean, Integer>>`. The program needs to be modified to write this `DataStream` into the `nyc-idx` Elasticsearch index instead of printing it to standard out.

Flink's Elasticsearch Connector provides the `ElasticsearchSink` class to write a `DataStream` to an Elasticsearch index. It can be used as follow:

{% highlight java %}

Map<String, String> config = new HashMap<>();
config.put("bulk.flush.max.actions", "1");   // flush inserts after every event
config.put("cluster.name", "elasticsearch"); // default cluster name

List<InetSocketAddress> transports = new ArrayList<>();
// set default connection details
transports.add(new InetSocketAddress(InetAddress.getByName("localhost"), 9300));

popularSpots.addSink(
  new ElasticsearchSink<>(config, transports, new PopularPlaceInserter()));

// ---- 

public static class PopularPlaceInserter
    implements ElasticsearchSinkFunction<Tuple5<Float, Float, Long, Boolean, Integer>> {

  // construct index request
  @Override
  public void process(
      Tuple5<Float, Float, Long, Boolean, Integer> record,
      RuntimeContext ctx,
      RequestIndexer indexer) {

    // construct JSON document to index
    Map<String, String> json = new HashMap<>();
    json.put("time", record.f2.toString());         // timestamp
    json.put("location", record.f1+","+record.f0);  // lat,lon pair
    json.put("isStart", record.f3.toString());      // isStart
    json.put("cnt", record.f4.toString());          // count

    IndexRequest rqst = Requests.indexRequest()
        .index("nyc-idx")           // index name
        .type("popular-locations")  // mapping name
        .source(json);

    indexer.add(rqst);
  }
}

{% endhighlight java %}

Please make sure that Elasticsearch is up and running before you start your program. 
Once the program is running, you can check how many events were added to the `nyc-idx` by running the following command:

~~~bash
curl localhost:9200/nyc-idx/_stats/docs
~~~

Your program is inserting data into Elasticsearch if the document count is larger than 0: 
(`"total":{"docs":{"count":6710,"deleted":0}}`).

### Reference Solution

Reference solutions are available at GitHub:

# TODO FIX LINKS

- Java: 
  - [PopularPlacesToES.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/kafka_inout/PopularPlacesToES.java)
- Scala: 
  - [PopularPlacesToES.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataartisans/flinktraining/exercises/datastream_scala/kafka_inout/PopularPlacesToES.scala)
  
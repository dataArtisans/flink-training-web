---
gated: true
layout: page
title: DataStream API - Write to Elasticsearch
permalink: /exercises/toElastic.html
---

The task of this exercise is to modify the [Popular Places program]({{ site.baseurl }}/exercises/popularPlaces.html) to write its results into an Elasticsearch index.

The [Elasticsearch installation instructions]({{ site.baseurl }}/elastic.html) explain how to setup and start Elasticsearch. The following instructions help with creating an index in Elasticsearch, and modifying the Popular Places program.

### Adding the Elasticsearch Connector dependency

Flink features connectors to several external systems. In order to keep the dependencies on the core slim, these connectors are organized in separate modules and have to be included as needed. The Elasticsearch connector can be used by adding the following dependency to your `pom.xml` file (it's already been added to the training exercises project):

~~~xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-connector-elasticsearch2_2.11</artifactId>
  <version>{{site.flink-version}}</version>
</dependency>
~~~

### Managing an index

Create an index called `nyc-places`:

~~~bash
curl -XPUT "http://localhost:9200/nyc-places"
~~~

Create an index mapping called `popular-locations`:

~~~bash
curl -XPUT "http://localhost:9200/nyc-places/_mapping/popular-locations" -d'
{
 "popular-locations" : {
   "properties" : {
      "cnt": {"type": "integer"},
      "location": {"type": "geo_point"},
      "isStart": {"type": "boolean"},
      "time": {"type": "date"}
    }
 }
}'
~~~

Elasticsearch is now set up and you can start writing data to the `nyc-places` index.

You can delete the `nyc-places` by running:

~~~bash
curl -XDELETE "http://localhost:9200/nyc-places"
~~~

### Writing to Elasticsearch

The result of the Popular Places program is a `DataStream<Tuple5<Float, Float, Long, Boolean, Integer>>`. The program needs to be modified to write this `DataStream` into the `nyc-places` Elasticsearch index instead of printing it to standard out.

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
        .index("nyc-places")           // index name
        .type("popular-locations")     // mapping name
        .source(json);

    indexer.add(rqst);
  }
}

{% endhighlight java %}

Please make sure that Elasticsearch is up and running before you start your program.
Once the program is running, you can check how many events were added to the `nyc-places` by running the following command:

~~~bash
curl localhost:9200/nyc-places/_stats/docs
~~~

Your program is inserting data into Elasticsearch if the document count is larger than 0:
(`"total":{"docs":{"count":6710,"deleted":0}}`).

### Visualizing popular places with Kibana

[Kibana](https://www.elastic.co/products/kibana) is a web dashboard to visualize and explore data stored in Elasticsearch. In the following we show how to setup Kibana in a few steps and visualize popular places in New York on a map.

Just follow these instructions step-by-step:

* Download Kibana 4.6.4 for your setup [here](https://www.elastic.co/downloads/past-releases/kibana-4-6-4)

* Extract the archive file and enter the extracted folder

* Start Kibana by running the start script

~~~bash
./bin/kibana &
~~~

* Open [http://localhost:5601](http://localhost:5601) in your browser to access Kibana

* The start page will ask you to configure an index pattern. Enter `nyc-places` in the "Index name or pattern" text field and click the "Create" button without changing the "Time-field name".

<center>
<img src="{{site.images}}/kibana-1.png" width="85%">
</center>

* Click on the "Discover" button at the top. Kibana will tell you "No results found". This is because it only looks for data of the last 15 minutes while our TaxiRide records have a timestamp from January 2013. Click on the time picker in the upper right corner to select "Last 5 years" from the "Quick" options and click on the "Go" button.

<center>
<img src="{{site.images}}/kibana-2.png" width="85%">
</center>

* Click on the "Visualize" button at the top. Select "Tile map" and click on "From a new search". Kibana will show a map of the world. Next we will configure the visualization:
  * Click on "Value" and select "Sum" over the field `cnt` (this is the count we computed).
  * Select buckets type "Geo Coordinates" with "GeoHash" "Aggregation" on the `location` field (this is the coordinate of our count).

<center>
<img src="{{site.images}}/kibana-3.png" width="45%">
</center>

  * Click the green button with the triangle icon (play) and zoom the map on New York city.
  * You can try out Kibana's different visualizations by clicking on the "Options" button ans selecting a different "Map type".

<center>
<img src="{{site.images}}/kibana-4.png" width="85%">
</center>


### Reference Solution

Reference solutions are available at GitHub:

- Java:
  - [PopularPlacesToES.java]({{site.javaexamples}}//datastream_java/connectors/PopularPlacesToES.java)
- Scala:
  - [PopularPlacesToES.scala]({{site.scalaexamples}}//datastream_scala/connectors/PopularPlacesToES.scala)

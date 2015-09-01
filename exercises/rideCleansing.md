---
layout: page
title: DataStream API - Taxi Ride Cleansing
permalink: /exercises/rideCleansing.html
---

The task of the "Taxi Ride Cleansing" exercise is to cleanse a stream of TaxiRide records by removing records which have a start location or end location  which are not within a certain area of New York City. Erroneous records with `0,0` start and end location coordinates are removed by this check as well. The cleansed TaxiRide stream is written to [Apache Kafka](http://kafka.apache.org) using a `KafkaSink`.

The `GeoUtils` utility class is included in the `flink-training-exercises` Maven dependency and provides a static method `isInNYC(float lon, float lat)` to check if a location is within the bounding box of the NYC area.

### Input Data

This exercise is based the Taxi Data Stream. The [Taxi Data Stream instructions]({{ site.baseurl }}/exercises/taxiData.html) show how to generate a stream of `TaxiRide` records.

### Expected Output

The result of the task should be a `DataStream<TaxiRide>` that only contains records of taxi rides which start and end in the New York City area as defined by `GeoUtils.isInNYC()`.

The output is to be written to an Apache Kafka data sink. The [hands-on instructions]({{ site.baseurl }}/dataStreamBasics/handsOn.html) for the basic DataStream API lesson give instructions for how to setup and start Kafka. 

A Kafka data sink is added to a Flink DataStream program as follows:

{% highlight java %}
DataStream<TaxiRide> filteredRides = ...
filteredRides.addSink(new KafkaSink<TaxiRide>(
	"localhost:9092",     // Kafka broker host:port
	"cleansedRides",      // Topic to write to
	new TaxiRideSchema()) // Serializer (provided as util)
	);  
{% endhighlight java %}

When you start a program that writes to a Kafka sink, the configured Kafka topic is populated with records. You can check if the Kafka topic is receiving data by starting a Kafka Console Consumer, which prints records of a topic to the console, as follows:

~~~bash
./bin/kafka-console-consumer.sh \
	--zookeeper localhost:2181 \
	--topic cleansedRides \
	--from-beginning
~~~

**Note:** A Kafka topic is designed as a durable log. When starting multiple programs writing to the same log, the topic is not overwritten but all records are appended.

### Implementation Hints

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingOne">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
Program Structure
        </a>
      </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
      <div class="panel-body" markdown="span">
This exercise program starts with a `TaxiRide` stream generator and requires a single transformation to filter all records that do not start and end within the New York City area. The filtered Stream is written to Apache Kafka.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
Obtaining a Taxi Ride Data Stream
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body" markdown="span">
The `DataStream<TaxiRide>` is generated using the `TaxiRideGenerator` as described in the [Taxi Data Stream instructions]({{ site.baseurl }}/exercises/taxtData.html).
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingThree">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
Filtering Records
        </a>
      </h4>
    </div>
    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <div class="panel-body" markdown="span">
Flink's DataStream API features a `DataStream.filter(FilterFunction)` transformation to filter records from a data stream. The `GeoUtils.isInNYC(TaxiRide)` function can be called within a Filter function to identify records that do not start or end within the New York City area.
      </div>
    </div>
  </div>
</div>


### Reference Solution

Reference solutions are available at GitHub:

- Java: [RideCleansing.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/dataStreamJava/rideCleansing/RideCleansing.java)
- Scala: [RideCleansing.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataStreamScala/rideCleansing/RideCleansing.scala)
---
layout: page
title: DataStream API - Average Taxi Ride Speed
permalink: /exercises/rideSpeed.html
---

The task of the "Average Ride Speed" exercise is to compute the average speed of taxi rides by collecting and combining their start and end records. The average speed is computed from the trip start time, which is contained in the start record, and the trip end time and traveled distance, which are available in the end record.

### Input Data

The input data of this exercise should be read as `TaxiRide` records from the Kafka topic that was written by the [Taxi Ride Cleansing exercise]({{ site.baseurl }}/exercises/rideCleansing.html).

A Kafka data source is added to a Flink DataStream program as follows:

{% highlight java %}
// set up streaming execution environment
StreamExecutionEnvironment env = 
	StreamExecutionEnvironment.getExecutionEnvironment();

// create a Kafka data source
DataStream<TaxiRide> rides = env.addSource(
	new KafkaSource<TaxiRide>(
		"localhost:2181",      // Zookeeper host:port 
		"cleansedRides",       // Topic to read from
		new TaxiRideSchema())  // Deserializer (provided as util)
	);
{% endhighlight java %}

**NOTE:** The Kafka source reads records of a Kafka a topic just once. If you restart the program, it will not start reading from the beginning of the topic but from the position it stopped reading the topic before. You can fill the topic again by running the [Ride Cleansing]({{ site.baseurl }}/exercises/rideCleansing.html) program again.

### Expected Output

The result of the exercise should be a `DataStream<Tuple2<Long, Float>>` where the first field of the `Tuple2` should be the id of the ride and the second field of the tuple should be the average speed of the ride.

The result can be written to standard out, Kafka, or to a file.

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
The exercise program starts with a Kafka source. In order to ensure that the start and the end records of a specific ride are processed by the same parallel task instance, the stream needs to be partitioned by key. Within each stream partition, the start records must "wait" for their matching end records in order to compute the average speed of a ride. 
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
Partition the Data Stream
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body" markdown="span">
Data streams can be partitioned by a key using `DataStream.groupBy(key)`. The right key in this case is `tripId` because records must be matched by their `tripId`.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingThree">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
Find Matching Records
        </a>
      </h4>
    </div>
    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <div class="panel-body" markdown="span">
A `FlatMap` function receives a single input record and returns zero or more records. We use a `FlatMap` function for matching ride records, because we emit one pair of ride records for each end record, i.e., we do not emit a record for a start record. The start records are collected and indexed by their `taskId`, for example in a regular Java `HashMap<Integer, TaxiRide>`. If an end record arrives, the corresponding start record is removed from the `HashMap` and both, the start and the end record are returned from the `FlatMapFunction`.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingFour">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
Compute Average Speed
        </a>
      </h4>
    </div>
    <div id="collapseFour" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">
      <div class="panel-body" markdown="span">
Given a pair of start and end records, the average ride speed can be computed in a `MapFunction` using the start and end time and the traveled distance.
      </div>
    </div>
  </div>
</div>

### Reference Solution

Reference solutions are available at GitHub:

- Java: [RideSpeed.java](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/java/com/dataArtisans/flinkTraining/exercises/dataStreamJava/rideSpeed/RideSpeed.java)

---
layout: page
title: DataStream API - Average Taxi Ride Speed
permalink: /exercises/rideSpeed.html
---

The task of the "Average Ride Speed" exercise is to compute the average speed of taxi rides by matching and combining their start and end records. The average speed is computed from the trip start time, which is contained in the start record, and the trip end time and traveled distance, which are available in the end record.

### Input Data

This exercise is based on a stream of taxi ride events. The [Taxi Data Stream instructions]({{ site.baseurl }}/exercises/taxiData.html) show how to setup the `TaxiRideGenerator` which generates a stream of `TaxiRide` records. The stream of taxi ride events should be filtered for events that started and ended in New York City.

### Expected Output

The result of the exercise should be a `DataStream<Tuple2<Long, Float>>` where the first field of the `Tuple2` should be the id of the ride and the second field of the tuple should be the average speed of the ride.

The result can be written to standard out or to a file.

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
The program starts with a `TaxiRide` stream generator and requires a filter transformation to remove all records that do not start or end within the New York City area. In order to match the start and stop event records of a taxi ride, we must ensure that both records are processed by the same parallel task instance. This is achieved by partitioning the stream by key. Within each stream partition, the start records must "wait" for their matching end records in order to compute the average speed of a ride. 
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingFive">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
Remove Rides outside New York City
        </a>
      </h4>
    </div>
    <div id="collapseFive" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFive">
      <div class="panel-body" markdown="span">
Taxi Rides that did not start or end in New York City can be removed using a `FilterFunction` that uses the static `isInNYC(float lon, float lat)` utility function of the `GeoUtils` class. In fact, the same FilterFunction as in the previous [Taxi Ride Cleansing exercise]({{ site.baseurl }}/exercises/rideCleansing.html) can be used.
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
Data streams can be partitioned by a key using `DataStream.groupBy(key)`. In this case the correct key is `tripId` because records must be matched by their `tripId`.
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
A `FlatMap` function receives a single input record and returns zero or more records. We use a `FlatMap` function to match ride start and end records, because we emit one pair of ride records for each end record, i.e., we do not emit a record for a start record. The start records are collected and indexed by their `taskId`, for example in a regular Java `HashMap<Integer, TaxiRide>`. If an end record arrives, the corresponding start record is removed from the `HashMap` and both, the start and the end record are returned from the `FlatMapFunction`.
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

- Java: [RideSpeed.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/dataStreamJava/rideSpeed/RideSpeed.java)
- Scala: [RideSpeed.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataStreamScala/rideSpeed/RideSpeed.scala)

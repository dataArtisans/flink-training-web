---
layout: page
title: DataStream API - Average Taxi Ride Speed
permalink: /exercises/rideSpeed.html
---

The task of the "Average Ride Speed" exercise is to compute the average speed of taxi rides by matching and combining their start and end events. The average speed is computed from the rids start time, which is contained in the ride start event, and the ride end time and traveled distance, which are available in the end event.

### Input Data

This exercise is based on a stream of taxi ride events. The [Taxi Data Stream instructions]({{ site.baseurl }}/exercises/taxiData.html) show how to setup the `TaxiRideSource` which generates a stream of `TaxiRide` events. The stream of taxi ride events should be filtered for events that start and end in New York City.

### Expected Output

The result of the exercise should be a `DataStream<Tuple2<Long, Float>>` where the first field of the `Tuple2` should be the id of the ride and the second field of the tuple should be the average speed of the ride.

The resulting stream should be printed to standard out.

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
The program starts with a `TaxiRide` source function and requires a filter transformation to remove all records that do not start or end in New York City. In order to match the start and stop events of a taxi ride, we must ensure that both events are processed by the same parallel task instance. This is achieved by organizing (keying) the stream on ride id. For each ride id, we need to wait for the start and the end event before compuinge the average speed of a ride. 
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
Keying the Data Stream
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body" markdown="span">
Data streams can be organized by a key using `DataStream.keyBy(key)`. In this case the correct key is `rideId` because records must be matched by their `rideId`.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingThree">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
Collect Records and Compute Average Speed
        </a>
      </h4>
    </div>
    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <div class="panel-body" markdown="span">
We use a `FlatMap` function and keyed operator state to memorize the first event that we receive for each ride (the stream is keyed by ride id). When we receive the second event of a ride, we compute the average speed using start time, end time, and traveled distance, emit the computed record, and clear the keyed state to free memory.
      </div>
    </div>
  </div>
</div>

### Reference Solution

Reference solutions are available at GitHub:

- Java: [RideSpeed.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/ride_speed/RideSpeed.java)
- Scala: [RideSpeed.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataartisans/flinktraining/exercises/datastream_scala/ride_speed/RideSpeed.scala)

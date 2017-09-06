---
layout: page
title: Long Ride Alerts
permalink: /exercises/longRides.html
---

The goal of the "Long Ride Alerts" exercise is to indicate whenever a taxi ride started two hours ago, and is still ongoing.

### Input Data

The input data of this exercise is a `DataStream` of taxi ride events. You will want to use a `CheckpointedTaxiRideSource`:

~~~java
DataStream<TaxiRide> rides = env.addSource(
  new CheckpointedTaxiRideSource(input, servingSpeedFactor));
~~~

Even when used with a delay factor of zero, the `TaxiRideSource` that you may've used before will reorder events with the same timestamp, and that adds complexity that we'd rather avoid for now.

Don't bother trying to filter the events (as is done in the [Taxi Ride Cleansing exercise]({{ site.baseurl }}/exercises/rideCleansing.html)).

### Expected Output

The result of the exercise should be a `DataStream<TaxiRide>` that only contains START events of taxi rides which have no matching END event within the first two hours of the ride.

The resulting stream should be printed to standard out.

Here are the rideIds and start times of the first few rides that go on for more than two hours, but you might want to print other info as well:

~~~
934753,2013-01-01 01:03:00
950600,2013-01-01 01:14:00
952469,2013-01-01 01:53:00
946984,2013-01-01 02:21:00
958062,2013-01-01 02:26:00
1029600,2013-01-01 10:51:00
...
~~~

<!--
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
      Hint
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
Hint Two
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body" markdown="span">
      Hint
      </div>
    </div>
  </div>
</div>
-->

### Documentation

- [ProcessFunction]({{ site.docs }}/dev/stream/process_function.html)
- [Working with State]({{ site.docs }}/dev/stream/state.html)

### Reference Solution

Reference solutions are available at GitHub:

- Java API: [LongRides.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/process/LongRides.java)
- Scala API: [LongRides.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataartisans/flinktraining/exercises/datastream_scala/process/LongRides.scala)

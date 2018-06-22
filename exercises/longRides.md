---
layout: page
title: Long Ride Alerts
permalink: /exercises/longRides.html
---

The goal of the "Long Ride Alerts" exercise is to indicate whenever a taxi ride started two hours ago, and is still ongoing.

### Input Data

The input data of this exercise is a `DataStream` of taxi ride events. You will want to use a `TaxiRideSource`, as described in the page about the [Taxi Data Stream]({{ site.baseurl }}/exercises/taxiData.html).

You can filter the events to only include rides within New York City (as is done in the [Taxi Ride Cleansing exercise]({{ site.baseurl }}/exercises/rideCleansing.html)), but it's not essential.

### Expected Output

The result of the exercise should be a `DataStream<TaxiRide>` that only contains START events of taxi rides which have no matching END event within the first two hours of the ride.

The resulting stream should be printed to standard out.

Here are the rideIds and start times of the first few rides that go on for more than two hours, but you might want to print other info as well:

~~~
> 2758,2013-01-01 00:10:13
> 7575,2013-01-01 00:20:23
> 22131,2013-01-01 00:47:03
> 25473,2013-01-01 00:53:10
> 29907,2013-01-01 01:01:15
> 30796,2013-01-01 01:03:00
...
~~~

### Getting Started

#### Tests

[com.dataartisans.flinktraining.exercises.datastream_java.process.LongRidesTest]({{ site.tests }}/process/LongRidesTest.java)

#### Exercise Classes

- Java: [com.dataartisans.flinktraining.exercises.datastream_java.process.LongRidesExercise]({{ site.javaexercises }}/process/LongRidesExercise.java)
- Scala: [com.dataartisans.flinktraining.exercises.datastream_scala.process.LongRidesExercise]({{ site.scalaexercises }}/process/LongRidesExercise.scala)

### Implementation Hints

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingOne">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
Overall approach
        </a>
      </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
      <div class="panel-body" markdown="span">
This exercise revolves around using a ProcessFunction to manage some keyed state and event time timers, and doing so in a way that works even when the END event for a given rideId arrives before the START (which will happen). The challenge is figuring out what state to keep, and when to set and clear that state.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
Timers and State
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body" markdown="span">
You will want to use event time timers that fire two hours after the incoming events, and in the onTimer() method, collect START events to the output only if a matching END event hasn't yet arrived. As for what state to keep, it's enough to remember the "last" event for each rideId, where "last" is based on event time and ride type (START vs END &mdash; yes, there are rides where the START and END have the same timestamp), rather than the order in which the events are processed. The TaxiRide class implements Comparable; feel free to take advantage of that, and be sure to eventually clear any state you create.
      </div>
    </div>
  </div>
</div>

### Documentation

- [ProcessFunction]({{ site.docs }}/dev/stream/operators/process_function.html)
- [Working with State]({{ site.docs }}/dev/stream/state/index.html)

### Reference Solutions

Reference solutions are available at GitHub:

- Java API: [LongRidesSolution.java]({{site.javasolutions}}/process/LongRidesSolution.java)
- Scala API: [LongRidesSolution.scala]({{site.scalasolutions}}/process/LongRidesSolution.scala)

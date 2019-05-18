---
gated: true
layout: page
title: CEP - Long Ride Alerts
permalink: /exercises/CEP.html
---

The goal of the "Long Ride Alerts" exercise is to indicate whenever a taxi ride started two hours ago, and is still ongoing.

This can be done fairly straightforwardly with a `ProcessFunction` (see the [Long Ride Alerts exercise]({{ site.baseurl }}/intro/rideCleansing.html)), but this requires you to explicitly manage state and timers. In this exercise we'll do this more simply using Flink's CEP library.

Using the CEP library requires adding these dependencies to the `pom.xml` of your Maven project. This is already taken care of in the training exercises project.

~~~xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-cep_{{site.scala_version}}</artifactId>
  <version>{{site.flink-version}}</version>
</dependency>

<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-cep-scala_{{site.scala_version}}</artifactId>
  <version>{{site.flink-version}}</version>
</dependency>
~~~

### Input Data

The input data of this exercise is a `DataStream` of taxi ride events. You will want to use a `CheckpointedTaxiRideSource`:

~~~java
DataStream<TaxiRide> rides = env.addSource(
  new CheckpointedTaxiRideSource(input, servingSpeedFactor));
~~~

Even when used with a delay factor of zero, the `TaxiRideSource` that you may've used before will reorder events with the same timestamp, and that adds complexity that we'd rather avoid for now.

Don't bother trying to filter the events (as is done in the [Taxi Ride Cleansing exercise]({{ site.baseurl }}/intro/rideCleansing.html)).

### Expected Output

The result of the exercise should be a `DataStream<TaxiRide>` that only contains START events of taxi rides which have no matching END event within the first two hours of the ride.

The resulting stream should be printed to standard out.

The expected results are something like this:

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

- [CEP]({{ site.docs }}/dev/libs/cep.html)
- [CEP: Conditions]({{ site.docs }}/dev/libs/cep.html#conditions)
- [CEP: Combining Patterns]({{ site.docs }}/dev/libs/cep.html#combining-patterns)
- [CEP: Timed Out Partial Patterns]({{ site.docs }}/dev/libs/cep.html#handling-timed-out-partial-patterns)

### Reference Solution

Reference solutions are available at GitHub:

- Java API: [LongRidesSolution.java]({{site.javasolutions}}/cep/LongRidesSolution.java)
- Scala API: [LongRidesSolution.scala]({{site.scalasolutions}}/cep/LongRidesSolution.scala)

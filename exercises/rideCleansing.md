---
layout: page
title: DataStream API - Taxi Ride Cleansing
permalink: /exercises/rideCleansing.html
---

If you haven't already done so, you'll need to first [setup your Flink development environment]({{site.baseurl}}/devEnvSetup.html). See [How to do the exercises]({{site.baseurl}}/howto-exercises.html) for an overall introduction to these exercises.

The task of the "Taxi Ride Cleansing" exercise is to cleanse a stream of TaxiRide events by removing events that do not start or end in New York City.

The `GeoUtils` utility class provides a static method `isInNYC(float lon, float lat)` to check if a location is within the NYC area.

### Input Data

This series of exercises is based a stream of taxi ride events. The [Taxi Data Stream instructions]({{ site.baseurl }}/exercises/taxiData.html) show how to setup the `TaxiRideSource` which generates a stream of `TaxiRide` events.

### Expected Output

The result of the exercise should be a `DataStream<TaxiRide>` that only contains events of taxi rides which both start and end in the New York City area as defined by `GeoUtils.isInNYC()`.

The resulting stream should be printed to standard out.

### Getting Started

<div class="alert alert-info">
<p>
Rather than following the links in this section, you'll do better to find these classes in the flink-training-exercises project in your IDE.
</p>
</div>

#### Tests

[com.dataartisans.flinktraining.exercises.datastream_java.basics.RideCleansingTest]({{ site.tests }}/basics/RideCleansingTest.java)

#### Exercise Classes

- Java: [com.dataartisans.flinktraining.exercises.datastream_java.basics.RideCleansingExercise]({{ site.javaexercises }}/basics/RideCleansingExercise.java)
- Scala: [com.dataartisans.flinktraining.exercises.datastream_scala.basics.RideCleansingExercise]({{ site.scalaexercises }}/basics/RideCleansingExercise.scala)


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
The exercise program starts with a `TaxiRideSource` and requires a single transformation to filter all events that do not start and end within the New York City area.
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
The `DataStream<TaxiRide>` is generated using the `TaxiRideSource` as described in the [Taxi Data Stream instructions]({{ site.baseurl }}/exercises/taxiData.html).
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingThree">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
Filtering Events
        </a>
      </h4>
    </div>
    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <div class="panel-body" markdown="span">
Flink's DataStream API features a `DataStream.filter(FilterFunction)` transformation to filter events from a data stream. The `GeoUtils.isInNYC()` function can be called within a `FilterFunction` to check if a location is in the New York City area.
      </div>
    </div>
  </div>
</div>

### Documentation

- [DataStream API]({{ site.docs }}/dev/datastream_api.html)
- [Flink JavaDocs]({{ site.docs }}/api/java/)

### Reference Solutions

Reference solutions are available at GitHub:

- Java: [RideCleansingSolution.java]({{ site.javasolutions }}/basics/RideCleansingSolution.java)
- Scala: [RideCleansingSolution.scala]({{ site.scalasolutions }}/basics/RideCleansingSolution.scala)

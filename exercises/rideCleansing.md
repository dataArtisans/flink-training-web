---
layout: page
title: DataStream API - Taxi Ride Cleansing
permalink: /exercises/rideCleansing.html
---

If you haven't already done so, you'll need to first [setup your Flink development environment]({{site.baseurl}}/devEnvSetup.html). See [How to do the Exercises]({{site.baseurl}}/howto-exercises.html) for an overall introduction to these exercises.

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

#### Exercise Classes

This exercise uses these classes:

- Java: [com.dataartisans.flinktraining.exercises.datastream_java.basics.RideCleansingExercise]({{ site.javaexercises }}/basics/RideCleansingExercise.java)
- Scala: [com.dataartisans.flinktraining.exercises.datastream_scala.basics.RideCleansingExercise]({{ site.scalaexercises }}/basics/RideCleansingExercise.scala)

#### Tests

You will find the test for this exercise in

[com.dataartisans.flinktraining.exercises.datastream_java.basics.RideCleansingTest]({{ site.tests }}/basics/RideCleansingTest.java)

Like most of these exercises, at some point the `RideCleansingExercise` class throws an exception

        throw new MissingSolutionException();

Once you remove this line the test will fail until you provide a working solution. You might want to first try something clearly broken, such as

    return false;

in order to verify that the test does indeed fail when you make a mistake, and then work on implementing a proper solution.

#### Implementation Hints

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
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
Flink's DataStream API features a `DataStream.filter(FilterFunction)` transformation to filter events from a data stream. The `GeoUtils.isInNYC()` function can be called within a `FilterFunction` to check if a location is in the New York City area. Your filter function should check both the starting and ending locations of each ride.
      </div>
    </div>
  </div>
</div>

#### Documentation

- [DataStream API]({{ site.docs }}/dev/datastream_api.html)
- [Flink JavaDocs]({{ site.docs }}/api/java/)

### Reference Solutions

Reference solutions are available at GitHub and in the training exercises project:

- Java: [RideCleansingSolution.java]({{ site.javasolutions }}/basics/RideCleansingSolution.java)
- Scala: [RideCleansingSolution.scala]({{ site.scalasolutions }}/basics/RideCleansingSolution.scala)

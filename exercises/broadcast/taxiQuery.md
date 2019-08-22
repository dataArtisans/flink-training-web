---
gated: true
layout: page
title: Rules Engine
permalink: /exercises/taxiQuery.html
nav-parent_id: broadcast
nav-pos: 30
---

If you haven't already done so, you'll need to first [setup your Flink development environment]({{site.baseurl}}/devEnvSetup.html). See [How to do the Exercises]({{site.baseurl}}/setup/howto-exercises.html) for an overall introduction to these exercises.

With this exercise you will connect two streams using a `KeyedBroadcastProcessFunction`:

1. a stream of `TaxiRide` events, and
2. a query stream on which you can type queries/rules.

The stream of TaxiRides is keyed by the taxiId, and for each taxi, the most recent ride event is retained in keyed state. This means for every taxi, we have a record of its current situation: either it's somewhere in the middle of a ride that started at some place and time, or the last thing we heard about was a ride that ended.

The queries are java expressions that when evaluated, produce a boolean value. These query expressions have a `ride` and the current `watermark` in scope. Whenever a new query expression arrives it is evaluated against all of the stored (keyed) rides, and whenever the query expression evaluates to True for some ride, that ride is emitted by the `KeyedBroadcastProcessFunction`. Similarly, as new ride events arrive on their stream, they are also evaluated by the query expression, and emitted if the expression returns True.

Example queries:

    true

    false

    ride.isStart && (watermark - ride.getEventTime()) > 100 * 60000

    !ride.isStart && ride.getEuclideanDistance(-74, 41) < 10.0

Explanations: the third query above matches ongoing rides that started more than 100 minutes ago, and the last query matches rides that end within 10km of the specified location. "true" and "false" are convenient queries if you just want to see that things are basically working.

To keep things simple, the implementation should only have one query at a time -- a new query replaces the previous query.

The `TaxiQueryExercise` class we provide creates both streams, and uses [Janino](https://janino-compiler.github.io/janino/) to compile the java expressions. What remains to be done is to complete the implementions of the `processElement` and `processBroadcastElement` methods of the `KeyedBroadcastProcessFunction`.

Also, since the queries can reference the current watermark of the `KeyedBroadcastProcessFunction`, you need to take care that this will work. See the Implementation Hints below for more about this.

### Getting Started

On MacOS and Linux you can start the broadcast query stream via

    nc -lk 9999

and on Windows you can install ncat from [https://nmap.org/ncat/](https://nmap.org/ncat/) and then use

    ncat -lk 9999

#### Tests

[com.ververica.flinktraining.exercises.datastream_java.broadcast.TaxiQueryTest]({{ site.tests }}/broadcast/TaxiQueryTest.java)

#### Exercise Class

- Java: [com.ververica.flinktraining.exercises.datastream_java.broadcast.TaxiQueryExercise]({{ site.javaexercises }}/broadcast/TaxiQueryExercise.java)

### Implementation Hints

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingThree">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
Watermarking Problem
        </a>
      </h4>
    </div>
    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <div class="panel-body" markdown="span">
      Once the two streams are connected, the Watermark of the KeyedBroadcastProcessFunction operator
    	will be the minimum of the Watermarks of the two connected streams. Our query stream has a default
    	Watermark at Long.MIN_VALUE, and this will hold back the event time clock of the
    	KeyedBroadcastProcessFunction, unless we do something about it.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingFour">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
Watermarking Solution
        </a>
      </h4>
    </div>
    <div id="collapseFour" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">
      <div class="panel-body" markdown="span">
      It's enough to attach an AssignerWithPeriodicWatermarks to the query stream that always returns Watermark.MAX_WATERMARK as the current Watermark.
      </div>
    </div>
  </div>
</div>

#### Documentation

- [Broadcast State]({{ site.docs }}/dev/stream/state/broadcast_state.html)

### Reference Solutions

Reference solutions are available at GitHub:

- Java:  
    [TaxiQuerySolution.java]({{site.javasolutions}}/broadcast/TaxiQuerySolution.java)  

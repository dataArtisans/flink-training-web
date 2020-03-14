---
gated: true
title: Keyed Streams
layout: page
permalink: /lessons/keyed-streams.html
nav-parent_id: transformations
nav-pos: 20
---

## keyBy()

It is often very useful to be able to partition a stream around one of its attributes, so that all events with the same value of that attribute are grouped together. For example, suppose we wanted to find the longest taxi rides starting in each of the grid cells. If we were thinking in terms of a SQL query, this would mean doing some sort of GROUP BY with the `startCell`, while in Flink this is done with `keyBy(KeySelector)`

{% java %}
rides
  .flatMap(new NYCEnrichment())
  .keyBy("startCell")
{% endjava %}

Every keyBy causes a network shuffle that repartitions the stream. In general this is pretty expensive, since it involves network communication along with serialization and deserialization.

![keyBy and network shuffle]({{site.images}}/keyBy.png)

In the example above, the key has been specified by a field name, "startCell". This style of key selection has the drawback that the compiler is unable to infer the type of the field being used for keying, and so Flink will pass around the key values as Tuples, which can be awkward. It is generally preferable to use a properly typed KeySelector, e.g.,

{% java %}
rides
  .flatMap(new NYCEnrichment())
  .keyBy(
    new KeySelector<EnrichedRide, int>() {
      @Override
      public int getKey(EnrichedRide ride) throws Exception {
        return ride.startCell;
      }
    })
{% endjava %}

which can be more succinctly expressed with a lambda:

{% java %}
rides
  .flatMap(new NYCEnrichment())
  .keyBy(ride -> ride.startCell)
{% endjava %}

### Aggregations on Keyed Streams

This bit of code creates a new stream of tuples containing the `startCell` and duration (in minutes) for each end-of-ride event:

{% java %}
DataStream<Tuple2<Integer, Minutes>> minutesByStartCell = enrichedNYCRides
  .flatMap(new FlatMapFunction<EnrichedRide, Tuple2<Integer, Minutes>>() {
    @Override
    public void flatMap(EnrichedRide ride,
              Collector<Tuple2<Integer, Minutes>> out) throws Exception {
      if (!ride.isStart) {
        Interval rideInterval = new Interval(ride.startTime, ride.endTime);
        Minutes duration = rideInterval.toDuration().toStandardMinutes();
        out.collect(new Tuple2<>(ride.startCell, duration));
      }
    }
  });
{% endjava %}

We are now in a position to produce a stream that contains only those rides that are the longest rides ever seen (to that point) for each `startCell`.

There are a variety of ways that the field to use as the key can be expressed. Earlier we saw an example with an EnrichedRide POJO, where we specified the field to use by using its name. In this case we're working with Tuple2 objects, and we're providing the index within the tuple, starting from 0.

{% java %}
minutesByStartCell
  .keyBy(0) // startCell
  .maxBy(1) // duration
  .print();
{% endjava %}

In the output stream we see a record for each key every time the duration reaches a new maximum -- as we see here with cell 50797:

    ...
    4> (64549,5M)
    4> (46298,18M)
    1> (51549,14M)
    1> (53043,13M)
    1> (56031,22M)
    1> (50797,6M)
    ...
    1> (50797,8M)
    ...
    1> (50797,11M)
    ...
    1> (50797,12M)

### (Implicit) State

This is the first example we've seen of stateful streaming. Though the state is being handled transparently, Flink is having to keep track of the maximum duration for each distinct key.

Whenever state gets involved in your application, you should think about how large the state might become. Whenever the key space is unbounded, then so is the amount of state Flink will need.

When working with streams it generally makes more sense to think in terms of aggregations over finite windows, rather than over the entire stream.

### reduce() and other aggregators

`maxBy()`, used above, is just one example of a number of aggregator functions available on Flink's `KeyedStream`s. There is also a more general purpose `reduce()` function that you can use to implement your own custom aggregations.

## Further Reading

- [DataStream Transformations]({{site.docs}}/dev/stream/operators/#datastream-transformations) (Apache Flink Documentation)

{% next %}

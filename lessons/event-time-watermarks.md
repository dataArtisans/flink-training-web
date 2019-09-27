---
gated: true
title: Event Time and Watermarks
layout: page
permalink: /lessons/event-time-watermarks.html
nav-parent_id: analytics
nav-pos: 10
---

## Introduction

<iframe width="560" height="315" src="https://www.youtube.com/embed/zL5JWWgm3xA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Event Time

Flink explicitly supports three different notions of time:

* _event time:_ the time when an event occurred, as recorded by the device producing the event

* _ingestion time:_ a timestamp recorded by Flink at the moment when the event is ingested

* _processing time:_ the time when a specific operator in your pipeline is processing the event

For reproducible results, e.g., when computing the maximum price a stock reached during the first hour of trading on a given day, you should use event time. In this way the result won't depend on when the calculation is performed. This kind of real-time application is sometimes performed using processing time, but then the results are determined by the events that happen to be processed during that hour, rather than the events that occurred then. Computing analytics based on processing time causes inconsistencies, and makes it difficult to re-analyze historic data or test new implementations.

### Working with Event Time

By default, Flink will use processing time. To change this, you can set the Time Characteristic:

{% java %}
final StreamExecutionEnvironment env =
  StreamExecutionEnvironment.getExecutionEnvironment();
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);
{% endjava %}

If you want to use event time, you will also need to supply a Timestamp Extractor and Watermark Generator that Flink will use to track the progress of event time.

## Watermarks

Let's work through a simple example that will show why we need watermarks, and how they work.

In this example we have a stream of timestamped events that arrive somewhat out of order, as shown below. The numbers shown are timestamps that indicate when these events actually occurred. The first event to arrive happened at time 4, and it is followed by an event that happened earlier, at time 2, and so on:

    ··· 23 19 22 24 21 14 17 13 12 15 9 11 7 2 4 →

Now imagine that we are trying create a stream sorter. This is meant to be an application that processes each event from a stream as it arrives, and emits a new stream containing the same events, but ordered by their timestamps.

Some observations:

(1) The first element our stream sorter sees is the 4, but we can't just immediately release it as the first element of the sorted stream. It may have arrived out of order, and an earlier event might yet arrive. In fact, we have the benefit of some god-like knowledge of this stream's future, and we can see that our stream sorter should wait at least until the 2 arrives before producing any results.

*Some buffering, and some delay, is necessary.*

(2) If we do this wrong, we could end up waiting forever. First our application saw an event from time 4, and then an event from time 2. Will an event with a timestamp less than 2 ever arrive? Maybe. Maybe not. We could wait forever and never see a 1.

*Eventually we have to be courageous and emit the 2 as the start of the sorted stream.*

(3) What we need then is some sort of policy that defines when, for any given timestamped event, to stop waiting for the arrival of earlier events.

*This is precisely what watermarks do* — they define when to stop waiting for earlier events.

Event-time processing in Flink depends on *watermark generators* that insert special timestamped elements into the stream, called *watermarks*.

When should our stream sorter stop waiting, and push out the 2 to start the sorted stream? When a watermark arrives with a timestamp of 2, or greater.

(4) We can imagine different policies for deciding how to generate watermarks.

We know that each event arrives after some delay, and that these delays vary, so some events are delayed more than others. One simple approach is to assume that these delays are bounded by some maximum delay. Flink refers to this strategy as *bounded-out-of-orderness* watermarking. It's easy to imagine more complex approaches to watermarking, but for many applications a fixed delay works well enough.

### Working with Watermarks

In order to perform event-time-based event processing, Flink needs to know the time associated with each event, and it also needs the stream to include watermarks.

The Taxi data sources take care of these details for you. But in your own applications (and in some later exercises) you will be required to take care of this, which is usually done by implementing a class that extracts the timestamps from the events, and generates watermarks on demand. The easiest way to do this is by extending the `BoundedOutOfOrdernessTimestampExtractor`:

{% java %}
DataStream<MyEvent> stream = ...

DataStream<MyEvent> withTimestampsAndWatermarks =
  stream.assignTimestampsAndWatermarks(new MyExtractor);

public static class MyExtractor
    extends BoundedOutOfOrdernessTimestampExtractor<MyEvent> {

  public MyExtractor() {
    super(Time.seconds(10));
  }

  @Override
  public long extractTimestamp(MyEvent event) {
    return element.getCreationTime();
  }
}
{% endjava %}

Note that the constructor for `BoundedOutOfOrdernessTimestampExtractor` takes a parameter which specifies the maximum expected out-of-orderness (10 seconds, in this example).

## Further Reading

- [How Apache Flink™ Enables New Streaming Applications](https://ververica.com/blog/how-apache-flink-enables-new-streaming-applications-part-1) (dA blog)
- [Event Time]({{ site.docs }}/dev/event_time.html) (Apache Flink Documentation)
- [Generating Timestamps / Watermarks]({{ site.docs }}/dev/event_timestamps_watermarks.html) (Apache Flink Documentation)


{% next %}

---
gated: true
title: Windows
layout: page
permalink: /lessons/windows.html
nav-parent_id: analytics
nav-pos: 40
---

Flink features very expressive window semantics.

In this lesson you will learn:

* how windows are used to compute aggregates on unbounded streams,
* which types of windows Flink supports, and
* how to implement a DataStream program with a window aggregation

## Introduction

It's natural when doing stream processing to want to compute aggregated analytics on bounded subsets of the streams in order to answer questions like these:

* number of page views per minute
* number of sessions per user per week
* maximum temperature per sensor per minute

Computing windowed analytics with Flink depends on two principal abstractions: _Window Assigners_ that assign events to windows (creating new window objects as necessary), and _Window Functions_ that are applied to the events assigned to a window.

Flink's windowing API also has notions of _Triggers_, which determine when to call the window function, and _Evictors_, which can remove elements collected in a window.

In its basic form, you apply windowing to a keyed stream like this:

{% java %}
stream.
  .keyBy(<key selector>)
  .window(<window assigner>)
  .reduce|aggregate|process(<window function>)
{% endjava %}

You can also use windowing with non-keyed streams, but keep in mind that in this case, the processing will _not_ be done in parallel:

{% java %}
stream.
  .windowAll(<window assigner>)
  .reduce|aggregate|process(<window function>)
{% endjava %}

## Window Assigners

Flink has several built-in types of window assigners, which are illustrated below:

![window assigners]({{site.images}}/window-assigners.svg)

Some examples of what these window assigners might be used for, and how to specify the window assigners:

* Tumbling time windows
  * _page views per minute_
  * `TumblingEventTimeWindows.of(Time.minutes(1))`
* Sliding time windows
  * _page views per minute computed every 10 seconds_
  * `SlidingEventTimeWindows.of(Time.minutes(1), Time.seconds(10))`
* Session windows 
  * _page views per session, where sessions are defined by a gap of at least 30 minutes between sessions_
  * `EventTimeSessionWindows.withGap(Time.minutes(30))`

Durations can be specified using one of `Time.milliseconds(n)`, `Time.seconds(n)`, `Time.minutes(n)`, `Time.hours(n)`, and `Time.days(n)`.

The time-based window assigners (including session windows) come in both event-time and processing-time flavors. There are significant tradeoffs between these two types of time windows. With processing-time windowing you have to accept these limitations:

* can not process historic data,
* can not correctly handle out-of-order data,
* results will be non-deterministic,

but with the advantage of lower latency. 

When working with count-based windows, keep in mind that these windows will not fire until a batch is complete. There's no option to time-out and process a partial window, though you could implement that behavior yourself with a custom Trigger.

A global window assigner assigns every event (with the same key) to the same global window. This is only useful if you are going to do your own custom windowing, with a custom Trigger. In most cases where this might seem useful you will be better off using a `ProcessFunction` as described in [another section]({{site.baseurl}}/lessons/processfunction.html).

## Window Functions

You have three basic options for how to process the contents of your windows:

1. as a batch, using a `ProcessWindowFunction` that will be passed an Iterable with the window's contents;
1. incrementally, with a `ReduceFunction` or an `AggregateFunction` that is called as each event is assigned to the window;
1. or with a combination of the two, wherein the pre-aggregated results of a `ReduceFunction` or an `AggregateFunction` are supplied to a `ProcessWindowFunction` when the window is triggered.

Here are examples of approaches 1 and 3. In each case we are finding the peak value from each sensor in 1 minute event-time windows, and producing a stream of Tuples containing `(key, end-of-window-timestamp, max_value)`.

### ProcessWindowFunction Example

{% java %}
DataStream<SensorReading> input = ...

input
  .keyBy(“key”)
  .window(TumblingEventTimeWindows.of(Time.minutes(1)))
  .process(new MyWastefulMax());

public static class MyWastefulMax extends ProcessWindowFunction<
  SensorReading,                  // input type
  Tuple3<String, Long, Integer>,  // output type
  Tuple,                          // key type
  TimeWindow> {                   // window type
    
    @Override
    public void process(
      Tuple key,
      Context context, 
      Iterable<SensorReading> events,
      Collector<Tuple3<String, Long, Integer>> out) {
        int max = 0;
        for (SensorReading event : events) {
          if (event.value > max) max = event.value;
        }
		// note the rather hideous cast
        out.collect(new Tuple3<>((Tuple1<String>)key).f0, context.window().getEnd(), max));
    }
}
{% endjava %}

A few things to note in this implementation:

* The key selector is being specified as a field name encoded as a String. This makes it impossible for the compiler to know that our keys are Strings, and so the key type we have to work with in the ProcessWindowFunction is a Tuple. Note the contorted cast that is used in the last line.
* All of the events assigned to the window have to be buffered in keyed Flink state until the window is triggered. This is potentially quite expensive.
* Our ProcessWindowFunction is being passed a Context object from which we are able to get information about the window. Its interface looks like this:
{% java %}
public abstract class Context implements java.io.Serializable {
    public abstract W window();
    
    public abstract long currentProcessingTime();
    public abstract long currentWatermark();

    public abstract KeyedStateStore windowState();
    public abstract KeyedStateStore globalState();
}
{% endjava %}

`windowState` and `globalState` are places where you can store per-key, per-window, or global per-key information. This might be useful, for example, if you want to record something about the current window and use that when processing the subsequent window.

### Incremental Aggregation Example

{% java %}
DataStream<SensorReading> input = ...

input
  .keyBy(x -> x.key)
  .window(TumblingEventTimeWindows.of(Time.minutes(1)))
  .reduce(new MyReducingMax(), new MyWindowFunction());

private static class MyReducingMax implements ReduceFunction<SensorReading> {
  public SensorReading reduce(SensorReading r1, SensorReading r2) {
    return r1.value() > r2.value() ? r1 : r2;
  }
}

private static class MyWindowFunction extends ProcessWindowFunction<
  SensorReading, Tuple3<String, Long, SensorReading>, String, TimeWindow> {

  @Override
  public void process(
    String key,
    Context context,
    Iterable<SensorReading> maxReading,
    Collector<Tuple2<Long, SensorReading>> out) {

    SensorReading max = maxReading.iterator().next();
    out.collect(new Tuple3<String, Long, SensorReading>(key, context.window().getStart(), max));
  }
}
{% endjava %}

With this implementation we have chosen to use a more robust KeySelector. Notice also that the `Iterable<SensorReading>` will contain exactly one reading -- the pre-aggregated maximum computed by `MyReducingMax`.

## Late Events

By default, when using event-time windows, late events are dropped. There are two optional parts of the window API that give you more control over this.

You can arrange for the events that would be dropped to be collected to an alternate output stream instead, using a mechanism called [Side Outputs]({{ site.baseurl }}/lessons/side-outputs.html). Here's an example of what that might look like:

{% java %}
OutputTag<Event> lateTag = new OutputTag<Event>("late"){};

SingleOutputStreamOperator<Event> result = stream.
  .keyBy(...)
  .window(...)
  .process(...)
  .getSideOutput(lateTag);
  
DataStream<Event> lateStream = result.getSideOutput(lateTag);
{% endjava %}

You can also specify an interval of _allowed lateness_ during which the late events will continue to be assigned to the appropriate window(s) (whose state will have been retained). By default each late event will cause a late firing of the window function.

By default the allowed lateness is 0. In other words, elements behind the watermark are dropped (or sent to the side output).

For example:

{% java %}
stream.
  .keyBy(...)
  .window(...)
  .allowedLateness(Time.seconds(10))
  .process(...);
{% endjava %}

## Surprises

Some aspects of Flink's windowing API may not behave in the way you would expect. Based on frequently asked questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/apache-flink) and the [flink-user mailing list](https://flink.apache.org/community.html#mailing-lists), here are some facts about windows that may surprise you.

#### Sliding Windows Make Copies

Sliding window assigners can create lots of window objects, and will copy each event into every relevant window. For example, if you have sliding windows every 15 minutes that are 24-hours in length, each event will be copied into 4 * 24 = 96 windows.

#### Time Windows are Aligned to the Epoch

Just because you are using hour-long processing-time windows and start your application running at 12:05 does not mean that the first window will close at 1:05. The first window will be 55 minutes long and close at 1:00.

#### Windows Can Follow Windows

For example, it works to do this:

{% java %}
stream
  .keyBy(t -> t.key)
  .timeWindow(<time specification>)
  .reduce(<reduce function>)
  .timeWindowAll(<same time specification>)
  .reduce(<same reduce function>)
{% endjava %}

You might expect Flink's runtime to be smart enough to do this parallel pre-aggregation for you (provided you are using a ReduceFunction or AggregateFunction), but it's not.

#### No Results for Empty TimeWindows

Windows are only created when events are assigned to them. So if there are no events in a given time frame, no results will be reported.

#### Late Events Can Cause Late Merges

Session windows are based on an abstraction of windows that can _merge_. Each element is initially assigned to a new window, after which windows are merged whenever the gap between them is small enough. In this way, a late event can bridge the gap separating two previously separate sessions, producing a late merge.

#### Evictors are Incompatible with Incremental Aggregation

This is true simply by definition -- you can't evict elements you didn't store. But this means that designs that depend on using Evictors are adopting something of an anti-pattern.

## Further Reading

- [Introducing Stream Windows in Apache Flink](http://flink.apache.org/news/2015/12/04/Introducing-windows.html) (Apache Flink blog)
- [Windows]({{ site.docs }}/dev/stream/operators/windows.html) (Apache Flink Documentation)

{% next %}

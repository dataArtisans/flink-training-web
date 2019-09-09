---
gated: true
title: Stateful Transformations
layout: page
permalink: /lessons/stateful.html
nav-parent_id: transformations
nav-pos: 30
---

## Why is Flink Involved in Managing State?

Your applications are certainly capable of using state without getting Flink involved in managing it -- but Flink offers some compelling features for the state it manages:

* local: Flink state is kept local to the machine that processes it, and can be accessed at memory speed
* durable: Flink state is automatically checkpointed and restored
* vertically scalable: Flink state can be kept in embedded RocksDB instances that scale by adding more local disk
* horizontally scalable: Flink state is redistributed as your cluster grows and shrinks
* queryable: Flink state can be queried via a REST API

In this lesson you will learn how to work with Flink's APIs that manage keyed state.

## Rich Functions

At this point we've already seen several of Flink's function interfaces, including `FilterFunction`, `MapFunction`, and `FlatMapFunction`. These are all examples of the Single Abstract Method pattern.

For each of these interfaces, Flink also provides a so-called "rich" variant, e.g., `RichFlatMapFunction`, which has some additional methods, including:

- open(Configuration c)
- close()
- getRuntimeContext()

`open()` is called once, during operator initialization. This is an opportunity to load some static data, or to open a connection to an external service, for example.

`getRuntimeContext()` provides access to a whole suite of potentially interesting things, but most notably it is how you can create and access state managed by Flink.

## An Example with Keyed State

In this example we have a stream of sensor readings comprised of `Tuple2<String, Double>` events that specify the sensor ID and value for each sensor reading. Our objective is to smooth the data coming from each sensor, which we will do with a `RichMapFunction` called `Smoother`.

{% java %}
DataStream<Tuple2<String, Double>> input = …
DataStream<Tuple2<String, Double>> smoothed = input.keyBy(0).map(new Smoother());
{% endjava %}

To accomplish this, our Smoother will need to somehow record the recent sensor readings for each sensor, which it will do using Flink's _keyed state_ interface.

When you are working with a keyed stream like this one,  Flink will maintain a key/value store for each item of state being managed.

Flink supports several different types of keyed state, but in this example we will use the simplest one, namely `ValueState`. This means that for each key, Flink will store a single object -- in this case, an object of type `MovingAverage`. For performance reasons, Flink offers special support for particular types, including `ListState` and `MapState`.

Our `Smoother` class has two methods: `open()` and `map()`. In the open method we establish our use of managed state by defining a `ValueStateDescriptor<MovingAverage>`. The arguments to the constructor specify a name for this item of keyed state ("moving average"), and provide information that can be used to serialize these objects (in this case the class, `MovingAverage.class`).

{% java %}
public static class Smoother extends RichMapFunction<Tuple2<String, Double>, Tuple2<String, Double>> {
  private ValueState<MovingAverage> averageState;

  @Override
  public void open (Configuration conf) {
    ValueStateDescriptor<MovingAverage> descriptor =
      new ValueStateDescriptor<>("moving average", MovingAverage.class);
    averageState = getRuntimeContext().getState(descriptor);
  }

  @Override
  public Tuple2<String, Double> map (Tuple2<String, Double> item) throws Exception {
    // access the state for this key
    MovingAverage average = averageState.value();

    // create a new MovingAverage (with window size 2) if none exists for this key
    if (average == null) average = new MovingAverage(2);

    // add this event to the moving average
    average.add(item.f1);
    averageState.update(average);

    // return the smoothed result
    return new Tuple2(item.f0, average.getAverage());
  }
}
{% endjava %}

The map method in our `Smoother` is responsible for using a `MovingAverage` to smooth each event. Each time map is called with an event, that event is associated with a particular key (i.e., a particular sensor), and the methods on our `ValueState` object -- `averageState` -- are implicitly scoped to operate with the key for that sensor in context. So in other words, calling `averageState.value()` returns the current `MovingAverage` object for the appropriate sensor, so when we call `average.add(item.f1)` we are adding this event to the previous events for the same key (i.e., the same sensor).

## Clearing State

There's a potential problem with the example above: What will happen if the key space is unbounded? Flink is storing somewhere an instance of `MovingAverage` for every distinct key that is used. If there's a finite fleet of sensors then this will be fine, but in applications where the set of keys is growing in an unbounded way, it's necessary to clear the state for keys that are no longer needed. This is done by calling `clear()` on the state object, as in:

{% java %}averageState.clear(){% endjava %}

You might want to do this, for example, after a period of inactivity for a given key. We'll see how to use Timers to do this when we learn about `ProcessFunction` in the lesson on [event-driven applications]({{ site.baseurl }}/lessons/event-driven.html).

There's also a [State Time-to-Live (TTL)]({{site.docs}}/dev/stream/state/state.html#state-time-to-live-ttl) feature that was added to Flink in version 1.6. So far this has somewhat limited applicability, but can be relied upon, in some situations, to clear unneeded state.

## Non-keyed State

It is also possible to work with managed state in non-keyed contexts. This is sometimes called _operator state_. The interfaces involved are somewhat different, and since it is unusual for user-defined functions to need non-keyed state, we won't cover it here.

## Further Reading

- [Working with State]({{ site.docs }}/dev/stream/state/state.html) (Apache Flink Documentation)
- [Using Managed Operator State]({{ site.docs }}/dev/stream/state/state.html#using-managed-operator-state) (Apache Flink Documentation)

{% next %}

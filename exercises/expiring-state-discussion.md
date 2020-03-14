---
gated: true
layout: page
title: Lab 4 - Discussion
permalink: /exercises/expiring-state-discussion.html
nav-parent_id: lab4
nav-pos: 76
---

The reference solutions for this exercise illustrate one way of thinking about how to manage state that might otherwise leak, but this is not a situation where there is one, obviously correct answer. The purpose of this exercise is to stimulate some thinking about how to work with state and timers, and to bring some of the issues involved to the surface.

What might be our goals for a good solution? It should 
* produce correct results
* not leak state
* be easy to understand
* have good performance

Now let's examine the proposed solution with these goals in mind. We find this code in `processElement1` (and by the way, `processElement2` is the same, just with the roles reversed between the ride and fare):

```java
public void processElement1(TaxiRide ride, Context context, Collector<Tuple2<TaxiRide, TaxiFare>> out) throws Exception {
    TaxiFare fare = fareState.value();
    if (fare != null) {
        fareState.clear();
        context.timerService().deleteEventTimeTimer(fare.getEventTime());
        out.collect(new Tuple2(ride, fare));
    } else {
        rideState.update(ride);
        // as soon as the watermark arrives, we can stop waiting for the corresponding fare
        context.timerService().registerEventTimeTimer(ride.getEventTime());
    }
}
```

This means that 

* whenever an event arrives that does not complete a pair, we store it in state and create a timer
* whenever an event arrives that does complete a pair, we clear the state and delete the timer for the matching event (which was stored earlier)

So it's clear that nothing can leak if both events arrive. But what if one is missing?

In that case the timer will fire at some point, and run this code, which will clearly clean up any state that might exist:

```java
public void onTimer(long timestamp, OnTimerContext ctx, Collector<Tuple2<TaxiRide, TaxiFare>> out) throws Exception {
    if (fareState.value() != null) {
        ctx.output(unmatchedFares, fareState.value());
        fareState.clear();
    }
    if (rideState.value() != null) {
        ctx.output(unmatchedRides, rideState.value());
        rideState.clear();
    }
}
```

Ok, but how did we decide how long to wait? Is it enough to wait until `ride.getEventTime()`? 

The effect of setting an event time timer for `ride.getEventTime()` is to wait until any out-of-orderness in the ride and fare streams has been resolved. All earlier ride and fare events will have arrived by the time the watermark reaches `ride.getEventTime()`, **assuming the watermarking is perfect**. 

In these exercises, the watermarking is, in fact, perfect -- there can be no late events. But in a real-world setting, you should expect some late events, and we should expect that our implementation behaves correctly in this situation. What this reference solution will do is this:

* one of the events in a matching pair will arrive first, and create a timer to arrange for its eventual deletion
* that timer will fire, and the event will be cleared
* the matching event arrives late, and creates another timer, in this case _for a time that has already passed_
* the next arriving watermark triggers that timer, and the state is cleared

In other words, when an event is late, no state will leak, but the resulting join will not be produced. So, in cases where you want to still produce results despite late arriving data, you should create timers that will accommodate some lateness by retaining the necessary state for some additional period of time, e.g., 

```java
context.timerService().registerEventTimeTimer(ride.getEventTime() + ALLOWED_LATENESS);
```

It's not a good idea to try to accommodate arbitrarily late events, because doing so requires keeping some state for each late event indefinitely.

## Wrap-up

**_What about using processing time timers instead?_**

Sure, that will work, but it might be more awkward to test.

**_Why not use [State Time-To-Live]({{ site.docs }}/dev/stream/state/state.html#state-time-to-live-ttl) instead?_**

That's a fine idea. In general you may want to think in terms using State TTL for GDPR compliance (for example), and use timers to implement business logic. For an example that uses timers for business logic, take a look at the [Long Rides Alerts]({{site.baseurl}}/exercises/longRides.html) exercise. Otherwise, continue to the next lesson.

{% next %}

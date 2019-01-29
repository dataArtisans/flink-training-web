---
gated: true
layout: page
title: Advanced DataStream API - Connected Car Sessions
permalink: /exercises/carSessions.html
---

The objective of the Connected Car Sessions exercise is to divide the [connected car data stream](connectedCar.html)
into session windows, where a gap of more than 15 seconds should start a new session.

Your window function should look something like this, but we'll leave it to you to fill in the details:

#### Java

{% highlight java %}
public static class CreateGapSegment implements WindowFunction<...> {
    @Override
    public void apply(...) {
        out.collect(new GapSegment(events));
    }
}
{% endhighlight %}

We have supplied the `GapSegment` class, whose constructor takes an `Iterable<ConnectedCarEvent>` and returns an object
that provides interesting statistics about the events that were collected in the `Window`:

~~~
startTime      : long    // timestamp (milliseconds since the epoch)
length         : long    // number of events
maxSpeed       : int     // the highest speed attained
erraticness    : float   // the standard deviation of the throttle
~~~

The resulting stream of GapSegments should be printed to stdout, and the results should look like this:

~~~
1> 1484892235000,333 events,141 kph,crazy
1> 1484893178000,152 events,130 kph,busy
1> 1487345789000,10 events,37 kph,busy
~~~

### Implementation Hints

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingOne">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
Timestamps and Watermarks
        </a>
      </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
      <div class="panel-body" markdown="span">
Until now you have been working with <i>auto-watermarking</i>, which is to say that Flink has automatically invoked
your watermark generator at some regular interval (as measured by the CPU's time-of-day clock).
That won't work for these exercises, because this small dataset will be completely emitted long before even 1msec of time
(the smallest configurable interval for auto-watermarking) has elapsed.
The alternative you need is to implement a `AssignerWithPunctuatedWatermarks<ConnectedCarEvent>`.
      </div>
    </div>
  </div>
</div>

### Reference Solution

A reference solution is available at GitHub:

- Java: [DrivingSessions.java]({{site.javaexamples}}/datastream_java/windows/DrivingSessions.java)

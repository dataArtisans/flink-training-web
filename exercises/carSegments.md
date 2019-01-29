---
gated: true
layout: page
title: Advanced Windowing - Connected Car Segments
permalink: /exercises/carSegments.html
---

The objective of the Connected Car Segments exercise is to divide the [connected car data stream](connectedCar.html)
into segmented windows, where segments are periods of continuous driving, punctuated by the car coming to a complete stop (the speed is 0.0).

Your window function should look something like this, but we'll leave it to you to fill in the details:

#### Java

{% highlight java %}
public static class CreateStoppedSegment implements WindowFunction<...> {
    @Override
    public void apply(...) {
        out.collect(new StoppedSegment(events));
    }
}
{% endhighlight %}

We have supplied the `StoppedSegment` class, whose constructor takes an `Iterable<ConnectedCarEvent>`.
This subclass of `Segment` only considers the events before the earliest event in the iterable where the car
was stopped. `StoppedSegment` also provides these statistics:

~~~
startTime      : long    // timestamp (milliseconds since the epoch)
length         : long    // number of events
maxSpeed       : int     // the highest speed attained
erraticness    : float   // the standard deviation of the throttle position
~~~

We categorize erraticness from 0 to 2.5 as "calm", from 2.5 to 5.0 as "busy", and above 5 as "crazy".

The resulting stream of StoppedSegments should be printed to stdout, and your results should look like this:

~~~
1> 1484890575000,16 events,50 kph,calm
1> 1484890665000,32 events,65 kph,busy
1> 1484890855000,17 events,44 kph,busy
1> 1484890945000,24 events,49 kph,busy
1> 1484891075000,262 events,141 kph,crazy
1> 1484892573000,41 events,90 kph,busy
1> 1484892803000,21 events,53 kph,calm
1> 1484892928000,48 events,69 kph,busy
~~~

After you get this working, experiment with shortening the lag for the watermarks (try making it zero), thereby
causing some events to be late.
Can you predict what might occur?

### Implementation Hints

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingOne">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
What kind of Window is this?
        </a>
      </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
      <div class="panel-body" markdown="span">
None of the built-in `Window` types meet our needs, except for the very basic `GlobalWindow`.
Because we are going to use a `GlobalWindow`, we will also need a custom `Trigger`.
You can use the same watermarking as in the previous exercise.
      </div>
    </div>
  </div>

  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
Triggering
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body" markdown="span">
The events where the vehicle is stopped (i.e. when the <i>speed</i> is 0.0) mark when we should
trigger the window -- except that events may arrive out of order.
Since we want to trigger the window for every stop event, we can simply
watch the stream for stop events, and set an event time timer for the timestamp in each one.
      </div>
    </div>
  </div>

  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingThree">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
Evicting
        </a>
      </h4>
    </div>
    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <div class="panel-body" markdown="span">
Note that your `GlobalWindow` will hang around, and be triggered repeatedly.
In general, you can either arrange for Flink to purge a window when its trigger fires, or, if there are events
that should be retained until it fires again, then you need a custom `Evictor` that only removes
the events associated with this firing.
In general an `Evictor` can remove elements from the window both before and after the window function is called.
In this case, once the appropriate `StoppedSegment` object has been emitted downstream, all of the `ConnectedCarEvents`
described by that Segment object can (and should) be removed from the window.
      </div>
    </div>
  </div>
</div>

### Reference Solution

A reference solution is available at GitHub:

- Java: [DrivingSegments.java]({{site.javaexamples}}/datastream_java/windows/DrivingSegments.java)

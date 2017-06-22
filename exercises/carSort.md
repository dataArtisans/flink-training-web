---
layout: page
title: Advanced DataStream API - Sorting Car Events
permalink: /exercises/carSort.html
---

The objective of this exercise is to sort the out-of-order version of
the [connected car data stream](connectedCar.html) by
timestamp, keyed by the carId.

The first few lines of output should look like this:

<div>
<pre>
1> 588e31efe4b04a0d732d3652,1484890575000,6.4438906,51.203373,35.612183,21.904049,54.137703
1> 588e31efe4b04a0d732d3654,1484890580000,6.4433055,51.203625,35.0,21.0,48.557564
1> 588e31efe4b04a0d732d3655,1484890585000,6.4427238,51.20389,34.04297,21.0,45.882355
1> 588e31efe4b04a0d732d3656,1484890590000,6.4421225,51.20411,34.0,19.036055,37.517406
1> 588e31efe4b04a0d732d3657,1484890595000,6.441643,51.204296,25.07743,18.0,28.994923
1> 588e31efe4b04a0d732d3658,1484890600000,6.4414926,51.204365,10.274597,18.875597,36.805405
1> 588e31efe4b04a0d732d3659,1484890605000,6.4412575,51.204334,19.384306,24.046944,54.948994
...
</pre>
</div>

After you get this working, experiment with shortening the lag for the watermarks (try making it zero), thereby
causing some events to be late.
Can you predict what will happen?

### Implementation Hints

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingOne">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
Can I do this with a WindowFunction?
        </a>
      </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
      <div class="panel-body" markdown="span">
You could, but it's going to be easier with a ProcessFunction.
      </div>
    </div>
  </div>

  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
Tell me more ...
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body" markdown="span">
As each element arrives, put it in a PriorityQueue, ordered by timestamp.
Hold each element until the time is right, and then send it downstream.
      </div>
    </div>
  </div>
</div>

### Reference Solution

A reference solution is available at GitHub:

- Java: [CarEventSort.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/process/CarEventSort.java)

---
layout: page
title: Connected Car Event Stream
permalink: /exercises/connectedCar.html
---

The [enviroCar Project](https://envirocar.org) provides a public data set ([Source: 52°North enviroCar Server](https://envirocar.org/api/stable/tracks)) of
anonymized connected car data. We will be working with a subset of that data.

### 1. Schema of Connected Car Events

Each event in our connected car dataset contains 23 fields, but we will only concern ourselves with these:

~~~
id             : String  // a unique id for each event
car_id         : String  // a unique id for the car
timestamp      : long    // timestamp (milliseconds since the epoch)
longitude      : float   // GPS longitude
latitude       : float   // GPS latitude
consumption    : float   // fuel consumption (liters per hour)
speed          : float   // speed (kilometers per hour)
throttle       : float   // throttle position (%)
engineload     : float   // engine load (%)
~~~

### 2. Download the connected car data files

Download the data by running the following commands:

~~~~
wget http://training.ververica.com/trainingData/carInOrder.csv
wget http://training.ververica.com/trainingData/carOutOfOrder.csv
~~~~

These two files contain the same event records, but in one file the data is sorted by timestamp,
while in the other the data is out of order (by at most 30 seconds).
Except when data is missing (i.e. when the car was turned off), there should be an event every 5 seconds.

### 3. Generate a Connected Car Event Stream in a Flink program

All exercises should be implemented using event-time characteristics. Event-time decouples the program semantics from serving speed and guarantees consistent results even in case of historic data or data which is delivered out-of-order.

Here's an example of how you can create a `DataStream<ConnectedCarEvent>` stream:

#### Java

{% highlight java %}
// read parameters
ParameterTool params = ParameterTool.fromArgs(args);
String input = params.getRequired("input");

// set up streaming execution environment
StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);

// connect to the data file
DataStream<String> carData = env.readTextFile(input);

// create event stream
DataStream<ConnectedCarEvent> events = carData
    .map(new MapFunction<String, ConnectedCarEvent>() {
        @Override
        public ConnectedCarEvent map(String line) throws Exception {
            return ConnectedCarEvent.fromString(line);
        }
    })
    .assignTimestampsAndWatermarks(???);
{% endhighlight %}

The `ConnectedCarEvent` records will be served as fast as possible (unlike the `TaxiRideSource`, which uses
sleep() to simulate a more realistic data source).

You will need to figure out how to generate appropriate watermarks. You should test each exercise with both
the in-order and out-of-order data files, and make sure they produce consistent results.

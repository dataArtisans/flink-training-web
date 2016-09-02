---
layout: page
title: Taxi Data Stream
permalink: /exercises/taxiData.html
---

The [New York City Taxi & Limousine Commission](http://www.nyc.gov/html/tlc/html/home/home.shtml) provides a public [data set](https://uofi.app.box.com/NYCtaxidata) about taxi rides in New York City from 2009 to 2015. We use a subset of this data set to generate a stream of taxi ride events.

### 1. Schema of Taxi Ride Events

Our taxi data set contains information about individual taxi rides in New York City. 
Each ride is represented by two events, a trip start and an trip end event. 
Each event consist of nine fields.

~~~
rideId         : Long    // a unique id for each ride
isStart        : Boolean // flag indicating the event type
startTime      : String  // the start time of a ride
endTime        : String  // the end time of a ride, 
                         //   "1970-01-01 00:00:00" for start events
startLon       : Float   // the longitude of the ride start location
startLat       : Float   // the latitude of the ride start location
endLon         : Float   // the longitude of the ride end location
endLat         : Float   // the latitude of the ride end location
passengerCnt   : Short   // number of passengers on the ride
~~~

**Note:** The data set contains records with invalid or missing coordinate information (longitude and latitude are `0.0`).

### 2. Download the taxi data file

Download the taxi data file by running the following command

~~~~
wget http://dataartisans.github.io/flink-training/trainingData/nycTaxiRides.gz
~~~~

Please do not decompress or rename the `.gz` file.

### 3. Generate a Taxi Ride Data Stream in a Flink program

We provide a Flink source function that reads a `.gz` file with taxi ride records and emits a stream of `TaxiRide` events. The source operates in [event-time](https://ci.apache.org/projects/flink/flink-docs-release-1.0/apis/streaming_guide.html#working-with-time).

In order to generate the stream as realistically as possible, events are emitted proportional to their timestamp. Two events that occurred ten minutes after each other in reality are also served ten minutes after each other. A speed-up factor can be specified to "fast-forward" the stream, i.e., given a speed-up factor of 60, events that happened within one minute are served in one second. Moreover, one can specify a maximum serving delay which causes each event to be randomly delayed within the specified bound. This yields an out-of-order stream as is common in many real-world applications. 

All exercises should be implemented using event-time characteristics. Event-time decouples the program semantics from serving speed and guarantees consistent results even in case of historic data or data which is delivered out-of-order.

**Note:** You have to add the `flink-training-exercises` dependency to your Maven `pom.xml` file as described in the [setup instructions]({{ site.baseurl }}/devEnvSetup.html) because the `TaxiRide` class and the generator (`TaxiRideSource`) are contained in the `flink-training-exercises` dependency.

#### Java

{% highlight java %}
// get an ExecutionEnvironment
StreamExecutionEnvironment env = 
  StreamExecutionEnvironment.getExecutionEnvironment();
// configure event-time processing
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);

// get the taxi ride data stream
DataStream<TaxiRide> rides = env.addSource(
  new TaxiRideSource("/path/to/nycTaxiRides.gz", maxDelay, servingSpeed));
{% endhighlight %}

#### Scala

{% highlight scala %}
// get an ExecutionEnvironment
val env = StreamExecutionEnvironment.getExecutionEnvironment
// configure event-time processing
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)

// get the taxi ride data stream
val rides = env.addSource(
  new TaxiRideSource("/path/to/nycTaxiRides.gz", maxDelay, servingSpeed))
{% endhighlight %}

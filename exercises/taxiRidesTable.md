---
layout: page
title: Taxi Rides Table
permalink: /exercises/taxiRidesTable.html
---

The [New York City Taxi & Limousine Commission](http://www.nyc.gov/html/tlc/html/home/home.shtml) provides a public [data set](https://uofi.app.box.com/NYCtaxidata) about taxi rides in New York City from 2009 to 2015. We use a subset of this data set to generate a stream of taxi ride events.

### 1. Schema of Taxi Table

Our taxi data set contains information about individual taxi rides in New York City.
Each ride is represented by two events, a trip start and an trip end event.
Start and end events are stored as individual rows of the table.
Each row has several fields:

~~~
rideId         : Long      // a unique id for each ride
taxiId         : Long      // a unique id for each taxi
driverId       : Long      // a unique id for each driver
isStart        : Boolean   // flag indicating the event type
startLon       : Float     // the longitude of the ride start location
startLat       : Float     // the latitude of the ride start location
endLon         : Float     // the longitude of the ride end location
endLat         : Float     // the latitude of the ride end location
passengerCnt   : Short     // number of passengers on the ride
eventTime      : Timestamp // the time at which the event happened
~~~

**Note:** The data set contains records with invalid or missing coordinate information (longitude and latitude are `0.0`).

### 2. Download the taxi data file

If you don't already have it, download the taxi data file by running the following command

~~~~
wget http://training.ververica.com/trainingData/nycTaxiRides.gz
~~~~

Please do not decompress or rename the `.gz` file.

### 3. Create a TaxiRideTableSource and register it in a TableEnvironment

We provide a `TableSource` that provides a `Table` that is updated from a `.gz` file with taxi ride events. The `TableSource` operates in [event-time]({{ site.docs }}/dev/event_time.html).

In order to update the `Table` as realistically as possible, events are emitted proportional to their timestamp. Two events that occurred ten minutes after each other in reality are also served ten minutes after each other. A speed-up factor can be specified to "fast-forward" the stream, i.e., given a speed-up factor of 60, events that happened within one minute are served in one second. Moreover, one can specify a maximum serving delay which causes each event to be randomly delayed within the specified bound. This yields out-of-order updates as they are common in many real-world applications.

All exercises should be implemented using event-time characteristics. Event-time decouples the program semantics from serving speed and guarantees consistent results even in case of historic data or data which is delivered out-of-order.

#### Java

{% highlight java %}
// get an ExecutionEnvironment
StreamExecutionEnvironment env =
  StreamExecutionEnvironment.getExecutionEnvironment();
// configure event-time processing
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);

// create a TableEnvironment
StreamTableEnvironment tEnv = TableEnvironment.getTableEnvironment(env);

// register TaxiRideTableSource as table "TaxiRides" in the TableEnvironment
tEnv.registerTableSource(
  "TaxiRides",
  new TaxiRideTableSource(
    "/path/to/nycTaxiRides.gz", maxDelay, servingSpeed));

// scan the TaxiRides table
Table rides = tEnv.scan("TaxiRides");
{% endhighlight %}

#### Scala

{% highlight scala %}
// get an ExecutionEnvironment
val env = StreamExecutionEnvironment.getExecutionEnvironment
// configure event-time processing
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)

// create TableEnvironment
val tEnv = TableEnvironment.getTableEnvironment(env)

// register TaxiRideTableSource as table "TaxiRides" in the TableEnvironment
tEnv.registerTableSource(
  "TaxiRides",
  new TaxiRideTableSource(
    "/path/to/nycTaxiRides.gz", maxDelay, servingSpeed))

// scan the TaxiRides table
val rides: Table = tEnv.scan("TaxiRides")
{% endhighlight %}

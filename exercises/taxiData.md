---
layout: page
title: Taxi Data Stream
permalink: /exercises/taxiData.html
---

Due to a Freedom of Information Law (FOIL) request the [New York City Taxi & Limousine Commission](http://www.nyc.gov/html/tlc/html/home/home.shtml) (NYCT&L) published a [data set](https://uofi.app.box.com/NYCtaxidata) that covers four years of taxi operation in New York City. This data set contains details about approximately 700 million taxi rides. We use a subset of this data set and to generate a data stream of taxi ride records.

### 1. Download the taxi data file

Download and extract the taxi data file by running the following commands

~~~~
wget http://dataartisans.github.io/flink-training/dataSets/nycTaxiRides.gz
~~~~

Please do not decompress or rename the .gz file.

#### Data format of the taxi data file

The taxi data set consists of two types of records: 

1. trip start records that indicate the start of a taxi ride and
2. trip end records that indicate the end of a taxi ride.

The data set is formatted as a comma-separated value (CSV) file, records are delimited by newline ("`\n`") and record fields by comma ("`,`").
Each record consists of nine fields.

~~~
TripID       : Long   // a unique id for each trip
Time         : String // the start or end time of a trip
Event        : String // 'START' or 'END' flag indicating the record type
StartLon     : String // the longitude of the trip start location
StartLat     : String // the latitude of the trip start location
EndLon       : String // the longitude of the trip end location
EndLat       : String // the latitude of the trip end location
PassengerCnt : Int    // number of passengers
TripDistance : Double // actual travel distance (-1 in START records)
~~~

**Note:** The data set contains erroneous records, such as records with missing coordinate information (longitude and latitude are `0.0`) and records where the actual travel distance is shorter than the Euclidean distance between start and end location.

### 2. Generate a Taxi Ride Data Stream in a Flink program

We provide a generator which emits a stream of `TaxiRide` records. The generator reads a .gz file with taxi ride records and emits them proportional to their time field (trip start or end time). 

The emission rate of the generator can be controlled with a parameter called `servingSpeedFactor`. A value of `1.0` emit records in "real-time", i.e., the later record of two events which are 10 minutes apart in the original data set will be emitted 10 minutes after the earlier record. A factor of `2.0` sends the later record 5 minutes after the earlier one.

**Note:** You have to add the `flink-training` dependency to the Maven `pom.xml` file as described in the [Hands-On instructions]({{ site.baseurl }}/dataStreamBasics/handsOn.html) because the `TaxiRide` class and the generator (`TaxiRideGenerator`) are contained in the `flink-training-exercises` dependency.

#### Java

{% highlight java %}
// get an ExecutionEnvironment
StreamExecutionEnvironment env = 
  StreamExecutionEnvironment.getExecutionEnvironment();

// get the taxi ride data stream
DataStream<TaxiRide> rides = env.addSource(
    new TaxiRideGenerator("/path/to/your/nycTaxiTrip.gz", servingSpeedFactor));
{% endhighlight %}

#### Scala

{% highlight scala %}
// get an ExecutionEnvironment
val env = StreamExecutionEnvironment.getExecutionEnvironment

// get the taxi ride data stream
val rides = env.addSource(
    new TaxiRideGenerator("/path/to/your/nycTaxiTrip.gz", servingSpeedFactor))
{% endhighlight %}
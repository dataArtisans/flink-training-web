---
layout: page
title: DataStream API - To/From Kafka
permalink: /exercises/toFromKafka.html
---

The task of this exercise is implement two programs. 

1. The first program should process TaxiRide events from the `TaxiRideSource`, remove records that do not start or end in New York City, and write the cleansed stream into Apache Kafka. This is basically the same exercise a the [Taxi Ride Cleansing exercise]({{ site.baseurl }}/exercises/rideCleansing.html) except that the data is written to Kafka. Please see the instructions of that exercise for details about the program logic.

2. The second program should read the cleansed data stream from Kafka and compute the average speed of taxi rides by matching and combining their start and end events. The average speed is computed from the ride start time, which is contained in the start event, and the ride end time and traveled distance, which are available in the end event. This is basically the [DataStream API: Average Taxi Ride Speed]({{ site.baseurl }}/exercises/rideSpeed.html) except that the input data is read from Kafka. Please see the instructions of that exercise for details about the program logic.

### Writing to Kafka

The result of the cleansing program should be a `DataStream<TaxiRide>` that only contains events of taxi rides which start and end in the New York City area as defined by `GeoUtils.isInNYC()`.

It should be written to an Apache Kafka topic. The [hands-on instructions]({{ site.baseurl }}/dataStreamAdvanced/handsOn.html) for the advanced DataStream API lesson give instructions for how to setup and start Kafka. 

A `KafkaSink` is added to a Flink DataStream program as follows:

{% highlight java %}
DataStream<TaxiRide> filteredRides = ...
filteredRides.addSink(new FlinkKafkaProducer09<TaxiRide>(
        "localhost:9092",      // Kafka broker host:port
        "cleansedRides",       // Topic to write to
        new TaxiRideSchema())  // Serializer (provided as util)
);
{% endhighlight java %}

When you start a program that writes to a Kafka sink, the configured Kafka topic is populated with records. You can check if the Kafka topic is receiving data by starting a Kafka Console Consumer, which prints the records of a topic to the console, as follows:

~~~bash
./bin/kafka-console-consumer.sh \
  --zookeeper localhost:2181 \
  --topic cleansedRides \
  --from-beginning
~~~

**Note:** A Kafka topic is designed as a durable log. If you start a program that writes to a Kafka topic several times, the topic is not overwritten but all records are appended.

### Reading from Kafka

The input stream of the speed computing program should be read from the Kafka topic which was produced by previous cleansing program.

A Kafka data source is added to a Flink DataStream program as follows:

{% highlight java %}
// set up streaming execution environment
StreamExecutionEnvironment env = 
  StreamExecutionEnvironment.getExecutionEnvironment();
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);

// setup Kafka configuration
Properties props = new Properties();
props.setProperty("zookeeper.connect", "localhost:2181"); // Zookeeper host:port
props.setProperty("bootstrap.servers", "localhost:9092"); // Broker host:port
props.setProperty("group.id", "myGroup");                 // Consumer group ID

// create a Kafka data source
DataStream<TaxiRide> rides = env.addSource(
  new FlinkKafkaConsumer09<TaxiRide>(
    "cleansedRides",                          // Topic to read from
    new TaxiRideSchema(),                     // Deserializer (provided as util)
    props)
  );
{% endhighlight java %}

**NOTE:** The `FlinkKafkaConsumer09` reads records from a Kafka a topic just once for each consumer group id. If you restart the program, it will not start reading from the beginning of the topic but from the position it stopped reading before unless you specify a new group id. You can run the [Ride Cleansing]({{ site.baseurl }}/exercises/rideCleansing.html) program again to ingest more records into the topic. If you concurrently run both programs, the first program will push records into Kafka and the second will consume these records.

### Expected Output

The result of the exercise should be a `DataStream<Tuple2<Long, Float>>` where the first field of the `Tuple2` should be the id of the ride and the second field of the tuple should be the average speed of the ride.

The result can be written to standard out or to a file.


### Reference Solution

Reference solutions are available at GitHub:

- Java: 
  - [RideCleansingToKafka.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/kafka_inout/RideCleansingToKafka.java)
  - [RideSpeedFromKafka.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/kafka_inout/RideSpeedFromKafka.java)
- Scala: 
  - [RideCleansingToKafka.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataartisans/flinktraining/exercises/datastream_scala/kafka_inout/RideCleansingToKafka.scala)
  - [RideSpeedFromKafka.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataartisans/flinktraining/exercises/datastream_scala/kafka_inout/RideSpeedFromKafka.scala)

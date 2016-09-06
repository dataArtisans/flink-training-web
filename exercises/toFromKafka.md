---
layout: page
title: DataStream API - Writing to and reading from Kafka
permalink: /exercises/toFromKafka.html
---

The task of this exercise is connect the [TaxiRide Cleansing program]({{ site.baseurl }}/exercises/rideCleansing.html) and the [Popular Places program]({{ site.baseurl }}/exercises/popularPlaces.html) through a Apache Kafka topic. For that both programs need to be modified:

1. The TaxiRide cleansing program shall write its result stream to a Kafka topic and
2. the Popular Places program shall read its input stream from that that Kafka topic.

The [hands-on instructions]({{ site.baseurl }}/dataStream/3-handsOn.html) for the Connectors lesson give instructions for how to setup and start Kafka. The following instructions help with the necessary modifications:

### Adding the Kafka Connector dependency

Flink features connectors to several external systems. In order to keep the dependencies on the core slim, these connectors are organized in separate modules and have to be included as needed. The connector for Kafka 0.9 can be used by adding the following dependency to your `pom.xml` file.

~~~xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-connector-kafka-0.9_2.10</artifactId>
  <version>1.1.2</version>
</dependency>
~~~

### Writing to Kafka

The result of the TaxiRide Cleansing program is a `DataStream<TaxiRide>`. The program needs to be modified to write this `DataStream` into an Kafka topic instead of printing it to standard out.

Flink's Kafka Connector provides the `FlinkKafkaProducer09` class to write a `DataStream` to a Kafka 0.9 topic. It can be used as follow:

{% highlight java %}
DataStream<TaxiRide> filteredRides = ...
filteredRides.addSink(new FlinkKafkaProducer09<TaxiRide>(
        "localhost:9092",      // Kafka broker host:port
        "cleansedRides",       // Topic to write to
        new TaxiRideSchema())  // Serializer (provided as util)
);
{% endhighlight java %}

When you start a program that writes to a Kafka sink, the resulting records are appended to the the configured Kafka topic. You can check if the Kafka topic is receiving data by starting  Kafka's Console Consumer, which prints the records of a topic to the console, as follows:

~~~bash
./bin/kafka-console-consumer.sh \
  --zookeeper localhost:2181 \
  --topic cleansedRides \
  --from-beginning
~~~

**Note:** Kafka topics are designed as durable logs. Restarting a program that writes to a Kafka topic means that all records are appended, i.e., the topic is not overwritten! Check the [hands-on instructions]({{ site.baseurl }}/dataStream/3-handsOn.html) to learn how a topic can be removed.

### Reading from Kafka

After the Kafka topic was filled with cleansed TaxiRides, the next step is to adapt the Popular Places program such that it reads its input from that topic. For that we need to replace the `TaxiRideSource` by a `KafkaConsumer` data source. The following code snippet shows how to configure and use a `KafkaConsumer` source.

{% highlight java %}
// set up streaming execution environment
StreamExecutionEnvironment env = 
  StreamExecutionEnvironment.getExecutionEnvironment();
// configure event-time characteristics
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);
// generate a Watermark every second
env.getConfig().setAutoWatermarkInterval(1000);

// configure Kafka consumer
Properties props = new Properties();
props.setProperty("zookeeper.connect", "localhost:2181"); // Zookeeper default host:port
props.setProperty("bootstrap.servers", "localhost:9092"); // Broker default host:port
props.setProperty("group.id", "myGroup");                 // Consumer group ID
props.setProperty("auto.offset.reset", "earliest");       // Always read topic from start

// create a Kafka consumer
FlinkKafkaConsumer09<TaxiRide> consumer = 
  new FlinkKafkaConsumer09<>(
    "cleansedRides",
    new TaxiRideSchema(),
    kafkaProps);

// create Kafka consumer data source
DataStream<TaxiRide> rides = env.addSource(consumer);

{% endhighlight java %}

**Note:** A stream read from Kafka does not automatically have timestamps and watermarks assigned. You have to take care of this yourself in order to make the event-time windows working. Otherwise the program won't emit any results. Please refer to the Implementation Hints or to the reference implementation below if you need help.

The resulting stream should be printed to standard out.

When you run your program, it will start reading the Kafka topic from the beginning (given that you set the `auto.offset.reset` property to `earliest`) and stop at the end of the topic. You can also concurrently run the writing and reading program in order to send data from the TaxiRide Cleansing program through Kafka to the Popular Place program.

### Implementation Hints

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingOne">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
Timestamp and Watermark Assignment
        </a>
      </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
      <div class="panel-body" markdown="span">
The `KafkaConsumer09` class has a method `assignTimestampsAndWatermarks()` to provide a custom timestamp and watermark assigner. Flink provides the abstract `BoundedOutOfOrdernessTimestampExtractor` class to implement timestamp extractors with bounded out-of-orderness (watermarks follow timestamps after a fixed time interval). You should extend this class to implement a custom timestamp and watermark assigner. The out-of-orderness of the `TaxiRide` events that were provided by the `TaxiRideSource` and that were written to the Kafka topic depends on the `maxEventDelay` parameter of the `TaxiRideSource` of the TaxiRide Cleansing program. The extracted timestamp should be the `TaxiRide.time` field converted to an epoch `long`. 
      </div>
    </div>
  </div>
</div>

### Reference Solution

Reference solutions are available at GitHub:

- Java: 
  - [RideCleansingToKafka.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/kafka_inout/RideCleansingToKafka.java)
  - [PopularPlacesFromKafka.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/kafka_inout/PopularPlacesFromKafka.java)
- Scala: 
  - [RideCleansingToKafka.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataartisans/flinktraining/exercises/datastream_scala/kafka_inout/RideCleansingToKafka.scala)
  - [PopularPlacesFromKafka.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataartisans/flinktraining/exercises/datastream_scala/kafka_inout/PopularPlacesFromKafka.scala)
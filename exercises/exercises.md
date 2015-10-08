---
title: Programming Exercises
layout: page
permalink: /exercises/
---

This training provides programming exercises that teach how to  implement scalable data analysis programs with Apache Flink's APIs and libraries. The programming exercises assume a [working development environment]({{ site.baseurl }}/devSetup/intro.html) and some basic knowledge of Flink's programming primitives.

<hr>
<br>

### DataSet API Exercises

The [DataSet API](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/programming_guide.html) is a programming model for scalable batch processing. It features a Java and a Scala API which are feature equivalent and very similar. 

The exercises are ordered by increasing difficulty.

#### Mail Count

Count the number of mails in the archive of Flink's developer mailing list per email address and month.

| **Instructions**				| [DataSet API: Mail Count]({{ site.baseurl }}/exercises/mailCount.html)
| **Data Set**                  | [Mail Data Set]({{ site.baseurl }}/exercises/mailData.html) |
| **API Features**              | [Map](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/dataset_transformations.html#map), [GroupBy](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/dataset_transformations.html#transformations-on-grouped-dataset), [GroupReduce](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/dataset_transformations.html#groupreduce-on-grouped-dataset) |
| **Reference Solution** &nbsp;&nbsp; | Java: [MailCount.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/dataSetJava/mailCount/MailCount.java), Scala: [MailCount.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataSetScala/mailCount/MailCount.scala) |

<br>

#### Reply Graph

Extract a graph of reply connections from the mails of Apache Flink's developer mailing list archives. A reply connection is defined by two emails where one email that was sent as a reply to the other email. By extracting the email addresses of both mails of a reply connection, we can construct a graph that allows to analyze the Flink community.


| **Instructions**				| [DataSet API: Reply Graph]({{ site.baseurl }}/exercises/replyGraph.html)
| **Data Set**                  | [Mail Data Set]({{ site.baseurl }}/exercises/mailData.html) |
| **API Features**              | [Map](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/dataset_transformations.html#map), [Join](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/dataset_transformations.html#join), [GroupBy](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/dataset_transformations.html#transformations-on-grouped-dataset), [GroupReduce](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/dataset_transformations.html#groupreduce-on-grouped-dataset) |
| **Reference Solution** &nbsp;&nbsp; | Java: [ReplyGraph.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/dataSetJava/replyGraph/ReplyGraph.java), Scala: [ReplyGraph.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataSetScala/replyGraph/ReplyGraph.scala) |

<br>

#### TF-IDF

Compute TermFrequency-InvertedDocumentFrequency (TF-IDF) metrics for words in all mails on the Flink developer mailing list. TF-IDF is a measure for the importance of a word in a document and commonly used by search engine for result ranking.

| **Instructions**				| [DataSet API: TF-IDF]({{ site.baseurl }}/exercises/tfIdf.html)
| **Data Set**                  | [Mail Data Set]({{ site.baseurl }}/exercises/mailData.html) |
| **API Features**              | [FlatMap](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/dataset_transformations.html#flatmap), [GroupBy](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/dataset_transformations.html#transformations-on-grouped-dataset), [GroupReduce](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/dataset_transformations.html#groupreduce-on-grouped-dataset), [Join](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/dataset_transformations.html#join), DataSet.collect() |
| **Reference Solution** &nbsp;&nbsp; 	| Java: [MailTFIDF.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/dataSetJava/tfIdf/MailTFIDF.java), Scala: [MailTFIDF.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataSetScala/tfIdf/MailTFIDF.scala) |

<br>
<hr>
<br>

### DataStream API Exercises

The [DataStream API](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/streaming_guide.html) is a programming model for scalable stream processing. It features a Java and a Scala API which are feature equivalent and very similar. 

The exercises are ordered by increasing difficulty.

#### Taxi Ride Cleansing

Filter a data stream of taxi ride records to keep only rides that start and end within New York City.

| **Instructions**				| [DataStream API: Taxi Ride Cleansing]({{ site.baseurl }}/exercises/rideCleansing.html) |
| **Data Set**                  | [Taxi Data Stream]({{ site.baseurl }}/exercises/taxiData.html) |
| **API Features**              | [Filter](https://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/streaming_guide.html#basic-transformations) |
| **Reference Solution** &nbsp;&nbsp; | Java: [RideCleansing.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/dataStreamJava/rideCleansing/RideCleansing.java), Scala: [RideCleansing.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataStreamScala/rideCleansing/RideCleansing.scala) |

<br>

#### Average Taxi Ride Speed

Compute the average speed of completed taxi rides.

| **Instructions**				| [DataStream API: Average Taxi Ride Speed]({{ site.baseurl }}/exercises/rideSpeed.html) |
| **Data Set**                  | [Taxi Data Stream]({{ site.baseurl }}/exercises/taxiData.html) |
| **API Features**              | [FlatMap](https://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/streaming_guide.html#basic-transformations), [GroupBy](https://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/streaming_guide.html#grouped-operators) |
| **Reference Solution** &nbsp;&nbsp; | Java: [RideSpeed.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/dataStreamJava/rideSpeed/RideSpeed.java), Scala: [RideSpeed.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataStreamScala/rideSpeed/RideSpeed.scala) |

<br>

#### Popular Places

Identify every five minutes popular areas where many taxi rides arrived or departed in the last 15 minutes.

| **Instructions**				| [DataStream API: Popular Places]({{ site.baseurl }}/exercises/popularPlaces.html) |
| **Data Set**                  | [Taxi Data Stream]({{ site.baseurl }}/exercises/taxiData.html) |
| **API Features**              | [Map](https://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/streaming_guide.html#basic-transformations), [GroupBy](https://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/streaming_guide.html#grouped-operators), [Window & MapWindow](https://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/streaming_guide.html#window-operators) |
| **Reference Solution** &nbsp;&nbsp; | Java: [PopularPlaces.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/dataStreamJava/popularPlaces/PopularPlaces.java), Scala: [PopularPlaces.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataStreamScala/popularPlaces/PopularPlaces.scala) |

<br>

#### Accident Delays

Connect a data stream of taxi rides and a stream of accident reports to identify taxi rides that might have been delayed due to accidents.

| **Instructions**				| [DataStream API: Accident Delays]({{ site.baseurl }}/exercises/accidentDelays.html) |
| **Data Set**                  | [Taxi Data Stream]({{ site.baseurl }}/exercises/taxiData.html) |
| **API Features**              | [Map, FlatMap](https://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/streaming_guide.html#basic-transformations), [GroupBy](https://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/streaming_guide.html#grouped-operators), [Connect, CoFlatMap](https://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/streaming_guide.html#co-operators) |
| **Reference Solution** &nbsp;&nbsp; | Java: [AccidentDelays.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/dataStreamJava/accidentDelays/AccidentDelays.java), Scala: [AccidentDelays.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataStreamScala/accidentDelays/AccidentDelays.scala) |

<br>

#### To/From Kafka

Implement two programs. The first writes a data stream to Apache Kafka and the second one reads the stream back from Kafka. The first program is basically identical to the *Taxi Ride Cleansing* exercise and the second program is identical to the *Average Taxi Ride Speed* exercise.

| **Instructions**				| [DataStream API: To/From Kafka]({{ site.baseurl }}/exercises/toFromKafka.html) |
| **Data Set**                  | [Taxi Data Stream]({{ site.baseurl }}/exercises/taxiData.html) |
| **API Features**              | [KafkaSink](https://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/streaming_guide.html#apache-kafka), [KafkaConsumer](https://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/streaming_guide.html#apache-kafka) |
| **Reference Solution** &nbsp;&nbsp; | Java: [RideCleansingToKafka.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/dataStreamJava/kafkaInOut/RideCleansingToKafka.java), [RideSpeedFromKafka.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/dataStreamJava/kafkaInOut/RideSpeedFromKafka.java), Scala: [RideCleansingToKafka.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataStreamScala/kafkaInOut/RideCleansingToKafka.scala), [RideSpeedFromKafka.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataStreamScala/kafkaInOut/RideSpeedFromKafka.scala) |

<br>
<hr>
<br>

### Table API Exercises

The [Table API](http://ci.apache.org/projects/flink/flink-docs-release-0.9/libs/table.html) significantly eases the processing of structured data and evaluates SQL-like expressions. It can be mixed with the DataSet API and the DataStream API and offers methods to convert a DataSet/DataStream into a Table and vice versa.

#### Member of the Month

Find for each month the email address that sent the most emails to Flink's developer mailing list. This task requires the DataSet API to bring the data into shape and the Table API to do the actual computation.

| **Instructions**				| [Table API: Member of the Month]({{ site.baseurl }}/exercises/memberOTM.html)
| **Data Set**                  | [Mail Data Set]({{ site.baseurl }}/exercises/mailData.html) |
| **API Features**              | [Map](http://ci.apache.org/projects/flink/flink-docs-release-0.9/apis/dataset_transformations.html#map), Table.select(), Table.groupBy(), Table.join() |
| **Reference Solution** &nbsp;&nbsp; | Java: [MemberOTMonth.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/tableJava/memberOTM/MemberOTMonth.java), Scala: [MemberOTMonth.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/tableScala/memberOTM/MemberOTMonth.scala) |

<br>
<hr>
<br>

### "Gelly" Graph API Exercises

Gelly is a Java [Graph API](https://ci.apache.org/projects/flink/flink-docs-release-0.9/libs/gelly_guide.html) for Flink. It contains a set of methods and utilities which aim to simplify the development of graph analysis applications in Flink. In Gelly, graphs can be transformed and modified using high-level functions similar to the ones provided by the batch processing API. Gelly provides methods to create, transform and modify graphs, as well as a library of graph algorithms.

#### PageRank Exercise

Define a graph using Gelly API and analyze its structure by running Gelly's PageRank algorithm.

| **Instructions**				| [Gelly: PageRank]({{ site.baseurl }}/exercises/replyGraphGelly.html)
| **Data Set**                  | [Reply Graph DataSet]({{ site.baseurl }}/exercises/replyGraph.html) (Input Data Set for this exercise, is the output of the Reply Graph exercise)|
| **API Features**              | Graph.fromDataSet(), Graph.reduceOnEdges(), Graph.joinWithEdgesOnSource() |
| **Reference Solution** &nbsp;&nbsp; | Java: [PageRankWithEdgeWeights.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/gellyJava/PageRankWithEdgeWeights.java) 

<br>


---
layout: page
title: DataStream API - Taxi Ride Cleansing
permalink: /exercises/rideCleansing.html
---

The task of the "Taxi Ride Cleansing" exercise is to cleanse a stream of TaxiRide records by removing records which have a start location or end location  which are not within a certain area of New York City. Erroneous records with `0,0` start and end location coordinates are removed by this check as well. The cleansed TaxiRide stream should be written to an [Apache Kafka](http://kafka.apache.org) sink.

The `GeoUtils` utility class is included in the `flink-training` Maven dependency and features a static method `isInNYC(TaxiRide)` to check if a taxi ride completely happened within the bounding box of the area.

### Input Data

This exercise uses the Taxi Data Stream which uses trip data of New York City taxis. The [Taxi Data Stream instructions]({{ site.baseurl }}/exercises/taxtData.html) show how to generate a stream of `TaxiRide` records.

### Expected Output

The result of the task should be a `DataStream<TaxiRide>` that only contains records of taxi rides which start and end in the New York City area as defined by `GeoUtils.isInNYC()`.

### Implementation Hints

#### Program Structure

This exercise program starts with a `TaxiRide` stream generator and requires a single transformation to filter all records that do not start and end within the New York City area. The filtered Stream is written to Apache Kafka.

#### Obtaining a Taxi Ride Data Stream

The `DataStream<TaxiRide>` is generated using the `TaxiRideGenerator` as described in the [Taxi Data Stream instructions]({{ site.baseurl }}/exercises/taxtData.html).

#### Filtering Records

Flink's DataStream API features a `DataStream.filter(FilterFunction)` transformation to filter records from a data stream. The `GeoUtils.isInNYC(TaxiRide)` function can be called within a Filter function to identify records that do not start or end within the New York City area.

#### Writing to an Apache Kafka Sink

Flink provides a data stream sink for Apache Kafka called `KafkaSink`. 

**TODO** point to Kafka setup instructions

### Reference Solution

Reference solutions are available at GitHub:

- Java: [RideCleansing.java](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/java/com/dataArtisans/flinkTraining/exercises/dataStreamJava/rideCleansing/RideCleansing.java)

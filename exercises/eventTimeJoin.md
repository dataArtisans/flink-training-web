---
gated: true
layout: page
title: Enrichment Joins
permalink: /exercises/eventTimeJoin.html
nav-parent_id: others
nav-pos: 40
---

## Introduction

The objective of this exercise is to explore techniques for enriching a stream of financial trades with customer information arriving as a stream of customer updates. There are different ways of thinking about enrichment joins, and the purpose of this exercise is to explore some variations on this theme.

We've implemented sources for both the `Trade` and `Customer` streams. These sources are simple simulations, and only provide events about one customer, and that customer's trades. These two streams can be joined on a `customerId` field that they have in common.

#### Timing

When organized by event time, these two streams behave as shown below -- we first learn about the `Customer` at time 0, and then again at time 500, etc. -- and the first `Trade` occurs at time 1000, and so on:

<img src="{{site.images}}/join-event-time.png" alt="Streams organized by event time" class="offset" width="100%" />

However, when looked at in processing time, both streams happen to arrive in-order, but are racing against each other. For example, the second `Customer` record is earlier than the first `Trade`, in event time, but arrives later in processing time:

<img src="{{site.images}}/join-processing-time.png" alt="Streams organized by processing time" class="offset" width="100%" />

#### Data Types

The `Trade` records contain:

~~~
timestamp      : long    // timestamp (milliseconds since the epoch)
customerId     : long    // a unique id for each event
tradeInfo      : String  // payload
~~~

The `Customer` records contain:

~~~
timestamp      : long    // timestamp (milliseconds since the epoch)
customerId     : long    // a unique id for each event
customerInfo   : String  // payload
~~~

The result of the enrichment join will be an `EnrichedTrade`:

~~~
trade          : Trade
customer       : Customer
~~~

You will find these basic types defined here:

- [Customer.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/datatypes/Customer.java)
- [Trade.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/datatypes/Trade.java)
- [EnrichedTrade.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/datatypes/EnrichedTrade.java)

## Processing Time Join

This is the simplest approach for implementing an enrichment join, and it is suitable for use cases, such as fraud detection, where precise, deterministic results are not imperative, and where keeping latency low is very valuable. Here the general idea is to immediately join each trade with whatever customer information is available.

You will find a working implementation of such a join in the `ProcessingTimeJoinExercise` class.

#### Exercise

1. Write some tests for this implementation.

2. Thought question: `ProcessingTimeJoinExercise` implements something like an outer join (there could be a `Trade` with no matching `Customer`, in which case this implementation will produce `(Trade, null)` as its result). Are there cases where it would be worthwhile to wait for some time in case a matching `Customer` arrives? How would you go about implementing that?

## Event Time Join

Processing time joins are easy to implement, and can be produced with minimal latency, but are unsuitable for some applications. If you need reproducible, deterministic results, the enrichment should instead be done using the latest customer information that was knowable at the time of the trade.

Here's what's involved in doing an event time join:

1. Store each trade in keyed state until the current watermark reaches the trade's timestamp.

2. Store all possibly relevant customer records (rather than only the latest one as we did in the processing-time join).

3. When the time is right, join the appropriate version of the customer info to each trade.

4. Eventually clear customer data that will no longer be needed.

You will find a working implementation of such a join in the `EventTimeJoinExercise` class.

#### Tests

You will find tests for this implementation in

[com.dataartisans.flinktraining.exercises.datastream_java.process.EventTimeJoinTest]({{ site.tests }}/process/EventTimeJoinTest.java)

#### Exercise

1. Extend this implementation to handle late Trades. This will require being less aggressive about expiring Customer records.

2. Implement a low-latency variant that immediately joins with available Customer data, if any, and then emits an updated result if a Customer update arrives.

3. Extra credit: Extend the tests to cover this new functionality.

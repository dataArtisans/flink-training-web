---
title: Streaming with Apache Flink
nav-title: Streaming with Flink
layout: page
permalink: /intro/intro-1.html
nav-parent_id: intro
nav-pos: 10
---

During this training we are going to focus on four critical concepts: continuous processing of streaming data, event time, stateful stream processing, and state snapshots. In this section we introduce these concepts.

## Stream Processing

Streams are data's natural habitat. Whether it's events from web servers, trades from a stock exchange, or sensor readings from a machine on a factory floor, data is created as part of a stream. But when we analyze data, we can either organize our processing around _bounded_ or _unbounded_ streams, and which of these paradigms we choose has profound consequences.

![bounded and unbounded streams]({{site.images}}/bounded-unbounded.png)

**Batch processing** is the paradigm at work when we process a bounded data stream. In this mode of operation we can choose to ingest the entire dataset before doing any calculations, which means that it's possible, for example, to sort the data, compute global statistics, and produce a final report that summarizes all of the input.

**Stream processing**, on the other hand, involves unbounded data streams. Conceptually, at least, the input may never end, and so we are forced to continuously process the data as it arrives.

In Flink, applications are composed of flows of data that may be transformed by user-defined operators. These dataflows form directed graphs that start with one or more sources, and end in one or more sinks.

![Flink dataflow as a DAG]({{site.images}}/source-transform-sink-update.png)

An application may consume real-time data from streaming sources such as message queues or distributed logs, such as Apache Kafka or Kinesis. But flink can also consume bounded, historic data from a variety of data sources. Similarly, the streams of results being produced by a Flink application can be sent to a wide variety of systems, and the state held within Flink can be accessed via a REST API.

![Flink application with sources and sinks]({{site.images}}/flink-application-sources-sinks.png)

## Timely Stream Processing

For most streaming applications it is very valuable to be able re-process historic data with the same code that is used to process live data -- and to produce deterministic, consistent results, regardless.

It can also be crucial to pay attention to the order in which events occurred, rather than the order in which they are delivered for processing, and to be able to reason about when a set of events is (or should be) complete. For example, consider the set of events involved in an e-commerce transaction, or financial trade.

These requirements for timely stream processing can be met by using event-time timestamps that are recorded in the data stream, rather than using the clocks of the machines processing the data.

## Stateful Stream Processing

Flink's operations can be stateful. This means that how one event is handled can depend on the accumulated effect of all the events that came before it. State may be used for something simple, such as counting events per minute to display on a dashboard, or for something more complex, such as computing features for a fraud detection model.

A Flink application is run in parallel on a distributed cluster. The various parallel instances of a given operator will execute independently, in separate threads, and in general will be running on different machines.

The set of parallel instances of a stateful operator is effectively a sharded key-value store. Each parallel instance is responsible for handling events for a specific group of keys, and the state for those keys is kept locally.

The diagram below shows a job running with a parallelism of two across the first three operators in the job graph, terminating in a sink that has a parallelism of one. The third operator is stateful, and we see that a fully connected network shuffle is occurring between the second and third operators. This is being done to partition the stream by some key, so that all of the events that need to be processed together, will be.

![State is sharded]({{site.images}}/parallel-job.png)

State is always accessed locally, which helps Flink applications achieve high throughput and low-latency. You can choose to keep state on the JVM heap, or if it is too large, in efficiently organized on-disk data structures. 

![State is local]({{site.images}}/local-state.png)

## Robust Stream Processing

Flink is able to provide fault-tolerant, exactly-once semantics through a combination of state snapshots and stream replay. These snapshots capture the entire state of the distributed pipeline, recording offsets into the input queues as well as the state throughout the job graph that has resulted from having ingested the data up to that point. When a failure occurs, the sources are rewound, the state is restored, and processing is resumed. As depicted above, these state snapshots are captured asynchronously, without impeding the ongoing processing.

## Further Reading

- [What is Apache Flink](https://flink.apache.org/flink-architecture.html) (Apache Flink Project Description)
- [Flink's Dataflow Programming Model]({{ site.docs }}/concepts/programming-model.html) (Apache Flink Documentation)
- [Flink's Distributed Runtime Environment]({{ site.docs }}/concepts/runtime.html) (Apache Flink Documentation)
- [The Dataflow Model: A Practical Approach to Balancing Correctness, Latency, and Cost in Massive-Scale, Unbounded, Out-of-Order Data Processing](https://research.google.com/pubs/pub43864.html) (Google Research)

{% next %}

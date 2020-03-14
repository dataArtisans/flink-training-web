---
gated: true
layout: page
title: Checkpoints and Savepoints
permalink: /snapshots.html
nav-parent_id: fault-tolerance
nav-pos: 20
---

## Definitions

* _Snapshot_ -- a generic term referring to a global, consistent image of the state of a Flink job. A snapshot includes a pointer into each of the data sources (e.g., an offset into a file or Kafka partition), as well as a copy of the state from each of the job's stateful operators that resulted from having processed all of the events up to those positions in the sources.
* _Checkpoint_ -- a snapshot taken automatically by Flink for the purpose of being able to recover from faults. Checkpoints can be incremental, and are optimized for being restored quickly.
* _Externalized Checkpoint_ -- normally checkpoints are not intended to be manipulated by users. Flink retains only the _n_-most-recent checkpoints (_n_ being configurable) while a job is running, and deletes them when a job is cancelled. But you can configure them to be retained instead, in which case you can manually resume from them.
* _Savepoint_ -- a snapshot triggered manually by a user (or an API call) for some operational purpose, such as a stateful redeploy/upgrade/rescaling operation. Savepoints are always complete, and are optimized for operational flexibility.

## How does State Snapshotting Work?

Flink uses a variant of the [Chandy-Lamport algorithm](https://en.wikipedia.org/wiki/Chandy-Lamport_algorithm) known as _asynchronous barrier snapshotting_.  This mechanism is described in detail in the Apache Flink project's documentation ([link]({{site.docs}}/internals/stream_checkpointing.html)). 

Briefly though, when a task manager is instructed by the checkpoint coordinator (part of the job manager) to begin a checkpoint, it has all of the sources record their offsets and insert numbered _checkpoint barriers_ into their streams. These barriers flow through the job graph, indicating the part of the stream before and after each checkpoint. 

![checkpoint barriers are inserted into the streams]({{site.images}}/stream_barriers.svg)

Checkpoint _n_ will contain the state of each operator that resulted from having consumed **every event before checkpoint barrier _n_, and none of the events after it**.

As each operator in the job graph receives one of these barriers, it records its state. Operators with two input streams (such as a CoProcessFunction) perform _barrier alignment_ so that the snapshot will reflect the state resulting from consuming events from both input streams up to (but not past) both barriers.

![barriers alignment]({{site.images}}/stream_aligning.svg)

Flink's state backends use a copy-on-write mechanism to allow stream processing to continue unimpeded while older versions of the state are being asynchronously snapshotted. Only when the snapshots have been durably persisted will these older versions of the state be garbage collected.

## Exactly Once Guarantees

When things go wrong in a stream processing application, it's possible to have either lost, or duplicated results. With Flink, depending on the choices you make for your application and the cluster you run it on, any of these outcomes is possible:

- Flink makes no effort to recover from failures (_at most once_)
- Nothing is lost, but you may experience duplicated results (_at least once_)
- Nothing is lost or duplicated (_exactly once_)

Given that Flink recovers from faults by rewinding and replaying the source data streams, when we describe the ideal situation as "exactly once" we don't mean that every event has been processed exactly once. Instead, we mean that every event has affected the state being managed by Flink exactly once. 

To achieve exactly once end-to-end, so that every event from the sources affects the sinks exactly once, the following must be true:

1. your sources must be replayable, and
2. your sinks must be transactional (or idempotent)

The Flink documentation describes which of its source and sink connectors satisfy these requirements ([link]({{site.docs}}/dev/connectors/guarantees.html)).

If you don't need exactly once semantics, you can gain some performance by disabling barrier alignment. This is done by configuring Flink to use `CheckpointingMode.AT_LEAST_ONCE`.

## Further Reading

From the documentation:

- [Data Streaming Fault Tolerance]({{site.docs}}/internals/stream_checkpointing.html)
- [Fault Tolerance Guarantees of Data Sources and Sinks]({{site.docs}}/dev/connectors/guarantees.html)
- [Enabling and Configuring Checkpointing]({{site.docs}}/dev/stream/state/checkpointing.html)
- [Checkpoints]({{site.docs}}/ops/state/checkpoints.html)
- [Savepoints]({{site.docs}}/ops/state/savepoints.html)
- [Tuning Checkpoints and Large State]({{site.docs}}/ops/state/large_state_tuning.html)
- [Monitoring Checkpointing]({{site.docs}}/monitoring/checkpoint_monitoring.html)
- [Restart Strategies]({{site.docs}}/dev/restart_strategies.html)

From Flink Forward:

- [How to build a modern stream processor: The science behind Apache Flink]({{site.ff}}/how-to-build-a-modern-stream-processor-the-science-behind-apache-flink)

{% next %}

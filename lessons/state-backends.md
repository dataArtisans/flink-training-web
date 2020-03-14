---
gated: true
layout: page
title: State Backends
permalink: /state-backends.html
nav-parent_id: fault-tolerance
nav-pos: 10
---

The keyed state managed by Flink is a sort of shared, key/value store, and the working copy of each item of keyed state is kept somewhere local to the taskmanager responsible for that key. Operator state is also local to the machine(s) that need(s) it. Flink periodically takes persistent snapshots of all the state and copies these snapshots somewhere more durable, such as a distributed file system.

In the event of the failure, Flink can restore the complete state of your application and resume processing as though nothing had gone wrong.

This state that Flink manages is stored in a _state backend_. Two implementations of state backends are available -- one based on RocksDB, an embedded key/value store that keeps its working state on disk, and another heap-based state backend that keeps its working state in memory, on the Java heap. This heap-based state backend comes in two flavors: the FsStateBackend that persists its state snapshots to a distributed file system, and the MemoryStateBackend that uses the JobManager's heap.

![state backends]({{site.images}}/state-backends.png)

When working with state kept in a heap-based state backend, accesses and updates involve reading and writing objects on the heap. But for objects kept in the RocksDBStateBackend, accesses and updates involve serialization and deserialization, and so are much more expensive. But the amount of state you can have with RocksDB is limited only by the size of the local disk. Note also that only the RocksDBStateBackend is able to do incremental snapshotting, which is a significant benefit for applications with large amounts of slowly changing state.

Both state backends are able to do asynchronous snapshotting, meaning that they can take a snapshot without impeding the ongoing stream processing.

## Further Reading

- [State Backends]({{ site.docs }}/ops/state/state_backends.html) (Apache Flink Documentation)

{% next %}

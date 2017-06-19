---
title: DataStream API Stateful Operators
layout: page
permalink: /dataStream/4-intro.html
---

Stateful operators are very common in streaming applications. Many operators (such as window operations) have to keep state and wait for data to arrive (or not) before they can perform their computation. In case of a failure, it is important to be able to restore the state of an operator in order to be able to guarantee consistent results.

In this lesson you will learn:

* what operator state is and how it can be used,
* which consistency Flink can guarantee,
* how Flink's checkpointing and recovery mechanism works, and
* how to implement a stateful operator.

<iframe src="//www.slideshare.net/slideshow/embed_code/key/blWilhA2bGYIkY" width="680" height="571" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>

[Download slides as PDF]({{site.baseurl}}/slides/flink_stream_statefulOps.pdf)

[-> Continue to hands-on session]({{site.baseurl}}/dataStream/4-handsOn.html)

### References

- [Working with State (docs)]({{ site.docs }}/dev/stream/state.html)
- [Data Streaming Fault Tolerance (docs)]({{ site.docs }}/internals/stream_checkpointing.html)
- [Checkpointing (docs)]({{ site.docs }}/dev/stream/checkpointing.html)
- [Savepoints (docs)]({{ site.docs }}/setup/savepoints.html)
- [State Backends (docs)]({{ site.docs }}/ops/state_backends.html)
- [CLI (docs)]({{ site.docs }}/setup/cli.html)

---
title: DataStream API Fault Tolerance
layout: page
permalink: /dataStream/fault-tolerance.html
---

Stateful operators are very common in streaming applications. In case of a failure, it is important to be able to restore the state of an operator in order to be able to guarantee consistent results.

In this lesson you will learn:

* how Flink's checkpointing and recovery mechanism works

<iframe src="//www.slideshare.net/slideshow/embed_code/key/blWilhA2bGYIkY" width="680" height="571" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>

[-> Continue to hands-on session]({{site.baseurl}}/exercises/fault-recovery.html)

### References

- [Data Streaming Fault Tolerance (docs)]({{ site.docs }}/internals/stream_checkpointing.html)
- [Checkpointing (docs)]({{ site.docs }}/dev/stream/checkpointing.html)
- [Savepoints (docs)]({{ site.docs }}/setup/savepoints.html)
- [State Backends (docs)]({{ site.docs }}/ops/state_backends.html)
- [CLI (docs)]({{ site.docs }}/setup/cli.html)

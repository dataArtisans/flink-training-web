---
title: DataStream API Time &amp; Windows
layout: page
permalink: /dataStream/2-intro.html
---

Time is an important aspect of stream processing, for instance it is usually required for windows that enable aggregations over infinite streams. Flink supports different ways to interpret time and features very expressive window semantics.

In this lesson you will learn

* why time is important in stream processing,
* what processing-time, event-time, and watermarks are,
* how windows are used to compute aggregates on infinite streams, 
* which types of windows Flink supports, and
* how to implement a DataStream program with a window aggregation.

<iframe src="//www.slideshare.net/slideshow/embed_code/key/q2jQdI0BWEzklE" width="680" height="571" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>

[Download slides as PDF]({{site.baseurl}}/slides/flink_stream_windows.pdf)

[-> Continue to hands-on session]({{site.baseurl}}/dataStream/2-handsOn.html)

### References

- [Introducing Stream Windows in Apache Flink](http://flink.apache.org/news/2015/12/04/Introducing-windows.html)
- [How Apache Flink™ Enables New Streaming Applications](https://data-artisans.com/blog/how-apache-flink-enables-new-streaming-applications-part-1)

- [Event Time (docs)]({{ site.docs }}/dev/event_time.html)
- [Generating Timestamps / Watermarks (docs)]({{ site.docs }}/dev/event_timestamps_watermarks.html)
- [Windows (docs)]({{ site.docs }}/dev/windows.html)
---
title: DataStream API Time &amp; Windows
layout: page
permalink: /dataStream/time.html
---

Time is an important aspect of stream processing, for instance it is usually required for windows that enable aggregations over infinite streams. Flink supports different notions of time, and uses Watermarks to control the flow of event time.

In this lesson you will learn

* why time is important in stream processing,
* and what processing-time, event-time, and watermarks are.

<iframe src="//www.slideshare.net/slideshow/embed_code/key/df79BN0OJYIVRN" width="680" height="421" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>

[-> Continue to Working with State]({{site.baseurl}}/dataStream/state.html)

### References

- [Event Time (docs)]({{ site.docs }}/dev/event_time.html)
- [Generating Timestamps / Watermarks (docs)]({{ site.docs }}/dev/event_timestamps_watermarks.html)

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

[-> Continue to slides]({{site.baseurl}}/dataStream/4-slides.html)
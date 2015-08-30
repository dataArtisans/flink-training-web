---
title: 7. Table API - Hands-On
layout: page
permalink: /tableApi/handsOn.html
---

The Flink training includes a programming exercise for the Table API. 

### Using the Table API

In order to use the Table API, you need to add one more dependency to the `pom.xml` file of the Flink quickstart Maven project. This is done as follows

1. open the `pom.xml`
1. search for the `<dependencies>` section of the `pom.xml`
1. include the following dependency

{% highlight xml %}
 <dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-table</artifactId>
    <version>0.9.0</version>
</dependency>
{% endhighlight %}


### Solve the "Member of the month" exercise

Try to solve the ["Member of the month"]({{ site.baseurl }}/exercises/memberOTM.html) exercise and identify the person that has written the most emails per month.

### Play around 

Play around with the Table API and the Mail Data Set and compute some fun stats about the Flink community.
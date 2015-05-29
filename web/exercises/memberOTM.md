---
layout: page
title: Table API - Member of the Month
permalink: /exercises/memberOTM.html
---

The task of the "Member of the Month" exercise is to find for each month the email address that sent the most emails to the Apache Flink development mailing list.

### Input Data

This exercise uses the [Mail Data Set](/exercises/mailData.html) which was extracted from the Apache Flink development mailing list archive. The task requires two fields, `Timestamp` and `Sender`. The input data can be read as a `DataSet<Tuple2<String, String>>`. When printed, the data set should look similar to this:

~~~
(2014-09-26-08:49:58,Fabian Hueske <fhueske@apache.org>)
(2014-09-12-14:50:38,Aljoscha Krettek <aljoscha@apache.org>)
(2014-09-30-09:16:29,Stephan Ewen <sewen@apache.org>)
~~~

### Expected Output

The result of the task should be a `DataSet<Tuple3<String, String, Integer>>`. The first field specifies the month, the second field the email address that sent the most emails to the mailing list in the given month. When printed, the data set should looks like:

~~~
(2014-07,sewen@apache.org)
(2014-06,rmetzger@apache.org)
(2015-05,sewen@apache.org)
(2015-02,sewen@apache.org)
(2014-08,rmetzger@apache.org)
~~~

The first line of the example result indicates that in July 2014, `sewen@apache.org` sent the most emails to the Flink developer mailing list and is therefore the member of that month.

### Implementation Hints

#### Program Structure

This exercise should be solve by using the DataSet API together with the Table API. Initially, the DataSet API is required to read out the data and do some preprocessing such as extracting the month from the time field and the email address from the sender field. This step is identical to a step in the [Mail Count](/exercises/mailCount.html) exercise. 

After the data was brought into a structured format, the remaining analysis can be done using the Table API in three steps:

1. Computing the number of mails per month and email address
1. Computing the maximum number of mails from a single address per month
1. Find the email address that sent the most emails of a month

#### Map Transformation

The [`Map`](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#map) transformation is used for record-at-a-time processing and should be used to extract the relevant information from from the input data, i.e., the month from the timestamp field and the email address from the sender field.

#### Number of mails per month and email address

Using the Table API, this can be computed using a `groupBy` and a `select` expression with `count` aggregation.

#### Maximum number of mails by an email address per month

Using the Table API, this can be computed using a `groupBy` and a `select` expression with `max` aggregation.

#### Find email address with most emails in a month

Using the Table API, this can be done using a `join` and a `select` expression.

### Reference Solution

Reference solutions are available at GitHub:

- Java: [MemberOTMonth.java](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/java/com/dataArtisans/flinkTraining/exercises/tableJava/memberOTM/MemberOTMonth.java)
- Scala: [MemberOTMonth.scala](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/scala/com/dataArtisans/flinkTraining/exercises/tableScala/memberOTM/MemberOTMonth.scala)

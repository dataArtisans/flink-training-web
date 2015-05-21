---
layout: page
title: Exercise 1 - Mail Stats
permalink: /exercises/mailstats.html
---

The task of the first exercise is to count for each unique combination of email address and month the number of emails in the archive of the Flink development mailing list. 

### Input Data

This exercise uses the [mail data set](/exercises/trainingData.html) that was extracted from the Apache Flink development mailing list archive. The data set consists for email records with six fields

- `Timestamp: String`
- `Sender: String`
- `Subject: String`
- `MessageBody: String`
- `MessageID: String // (may be “null”)`
- `Replied-ToID: String // (may be “null”)`

out of which the first two fields, `Timestamp` and `Sender`, are required for this exercise. The data can be accessed using Flink's tooling for delimiter-separated files (such as CSV or TSV files). The following code snippet shows how to read the first two fields of the input data set:

~~~java
ExecutionEnvironment env = ExecutionEnvironment.getExecutionEnvironment();

DataSet<Tuple2<String, String>> mails =
  env.readCsvFile(<PATH-TO-DATASET>)
    .lineDelimiter(MBoxParser.MAIL_RECORD_DELIM)
    .fieldDelimiter(MBoxParser.MAIL_FIELD_DELIM)
    .types(String.class, String.class); // read two String fields
~~~

The data is read as a `DataSet<Tuple2<String, String>>` and contains data which looks like:

~~~
(2014-09-26-08:49:58,Fabian Hueske <fhueske@apache.org>)
(2014-09-12-14:50:38,Aljoscha Krettek <aljoscha@apache.org>)
(2014-09-30-09:16:29,Stephan Ewen <sewen@apache.org>)
~~~

### Expected Output

There are several ways to emit the data of the program. The easist is to print it to the std-out using the `DataSet.print()` method. The expected output for this task looks like:

~~~
(2014-09,fhueske@apache.org,16)
(2014-09,aljoscha@apache.org,13)
(2014-09,sewen@apache.org,24)
(2014-10,fhueske@apache.org,14)
(2014-10,aljoscha@apache.org,17)
~~~

The order of the output records and their formatting does not matter. 

### Implementation Hints

#### Program Structure

This exercise is conceptually very similar to the `WordCount` program, which is the standard example to introduce MapReduce. Just like `WordCount`, this task requires two transformation, `Map` and `Reduce`. 

#### Grouping Keys

In contrast to the `WordCount` program, this exercise requires to group data on two fields (`month` and `email-address`) instead on a single field. Flink's [`DataSet.groupBy()`](http://ci.apache.org/projects/flink/flink-docs-master/apis/programming_guide.html#specifying-keys) transformation, accepts multiple grouping key references and treats them as one composite grouping key.

#### Map Transformation

The [`Map`](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#map) transformation is used for record-at-a-time processing and should be used to extract the relevant information from from the input data, i.e., the month from the timestamp field and the email address from the sender field.

#### GroupReduce Transformation

The [`GroupReduce`](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#groupreduce-on-grouped-dataset) transformation operates on groups of records and can also be used to count the number of element in a group.

### Sample Solution

A sample solution is available [here (LINK TO GH)]().

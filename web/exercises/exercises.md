---
title: Programming Exercises
layout: page
permalink: /exercises/
---

This training provides programming exercises that teach how to  implement scalable data analysis programs with Apache Flink's APIs and libraries. At this time, the exercises focus on Flink's DataSet API (batch) but will be extended to further APIs and libraries in the future.

The programming exercises assume a [working development environment](/setup.html) and some basic knowledge of Flink's programming primitives.

### DataSet API Exercises

The [DataSet API](http://ci.apache.org/projects/flink/flink-docs-master/apis/programming_guide.html) is a programming model for scalable batch processing. It features a Java and a Scala API which are feature equivalent and very similar. 

The exercises are order by increasing difficulty.

#### Mail Statistics

Count the number of mails in the archive of Flink's developer mailing list per email address and month.

| **Instructions**				| [DataSet API: Mail Statistics](/exercises/mailStats.html)
| **Data Set**                  | [Mail Data Set](/exercises/mailData.html) |
| **API Features** &nbsp;&nbsp; | [Map](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#map), [GroupBy](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#transformations-on-grouped-dataset), [GroupReduce](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#groupreduce-on-grouped-dataset) |
| **Reference Solution** 			| ... |

<br>

#### Reply Graph

Extract a graph of reply connections from the mails of Apache Flink's developer mailing list archives. A reply connection is defined by two emails where one email that was sent as a reply to the other email. By extracting the email addresses of both mails of a reply connection, we can construct a graph that allows to analyze the Flink community.


| **Instructions**				| [DataSet API: Reply Graph](/exercises/replyGraph.html)
| **Data Set**                  | [Mail Data Set](/exercises/mailData.html) |
| **API Features** &nbsp;&nbsp; | [Map](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#map), [Join](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#join), [GroupBy](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#transformations-on-grouped-dataset), [GroupReduce](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#groupreduce-on-grouped-dataset) |
| **Reference Solution** 			| ... |

<br>

#### TF-IDF

Compute TermFrequency-InvertedDocumentFrequency (TF-IDF) metrics for words in all mails on the Flink developer mailing list. TF-IDF is a measure for the importance of a word in a document and commonly used by search engine for result ranking.

| **Instructions**				| [DataSet API: TF-IDF](/exercises/tfidf.html)
| **Data Set**                  | [Mail Data Set](/exercises/mailData.html) |
| **API Features** &nbsp;&nbsp; | [FlatMap](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#flatmap), [GroupBy](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#transformations-on-grouped-dataset), [GroupReduce](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#groupreduce-on-grouped-dataset), [Join](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#join), DataSet.collect() |
| **Reference Solution** 			| ... |

<br>

### Table API Exercises

The Table API significantly eases the processing of structured data and evaluates SQL-like expressions. It can be mixed with the DataSet API and the DataStream API and offers methods to convert a DataSet/DataStream into a Table and vice versa.

#### Mail Statistics

Same as exercise [DataSetAPI: Mail Statistics](/exercises/mailStats.html), but using the Table API to compute the mail statistics.

| **Instructions**				| Table API: Mail Statistics
| **Data Set**                  | [Mail Data Set](/exercises/mailData.html) |
| **API Features** &nbsp;&nbsp; | [Map](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#map), Table.select(), Table.groupBy(), Table.count() |
| **Reference Solution** 			| ... |

<br>

#### TF-IDF

Same as exercise [Exercise 2](/exercises/tfidf.html), but using the Table API to compute the TF-IDF scores.

| **Instructions**				| Table API: TF-IDF
| **Data Set**                  | [Mail Data Set](/exercises/mailData.html) |
| **API Features** &nbsp;&nbsp; | [FlatMap](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#flatmap), Table.groupBy(), Table.count(), Table.join(), DataSet.collect() |
| **Reference Solution** 			| ... |

<br>

<!--

### Bonus Exercises

#### Bonus 1: DataStream API?

#### Bonus 2: Iterations?

#### Bonus 3: Gelly?

-->
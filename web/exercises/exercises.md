---
title: Programming Exercises
layout: page
permalink: /exercises/
---

This training provides programming exercises that teach how to  implement scalable data analysis programs with Apache Flink's APIs and libraries. At this time, the exercises focus on Flink's DataSet API (batch) but will be extended to further APIs and libraries in the future.

The programming exercises assume a [working development environment](/setup.html) and some basic knowledge of Flink's programming primitives.

<hr>
<br>

### DataSet API Exercises

The [DataSet API](http://ci.apache.org/projects/flink/flink-docs-master/apis/programming_guide.html) is a programming model for scalable batch processing. It features a Java and a Scala API which are feature equivalent and very similar. 

The exercises are order by increasing difficulty.

#### Mail Count

Count the number of mails in the archive of Flink's developer mailing list per email address and month.

| **Instructions**				| [DataSet API: Mail Count](/exercises/mailCount.html)
| **Data Set**                  | [Mail Data Set](/exercises/mailData.html) |
| **API Features**              | [Map](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#map), [GroupBy](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#transformations-on-grouped-dataset), [GroupReduce](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#groupreduce-on-grouped-dataset) |
| **Reference Solution** &nbsp;&nbsp; | Java: [MailCount.java](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/java/com/dataArtisans/flinkTraining/exercises/dataSetJava/mailCount/MailCount.java), Scala: [MailCount.scala](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataSetScala/mailCount/MailCount.scala) |

<br>

#### Reply Graph

Extract a graph of reply connections from the mails of Apache Flink's developer mailing list archives. A reply connection is defined by two emails where one email that was sent as a reply to the other email. By extracting the email addresses of both mails of a reply connection, we can construct a graph that allows to analyze the Flink community.


| **Instructions**				| [DataSet API: Reply Graph](/exercises/replyGraph.html)
| **Data Set**                  | [Mail Data Set](/exercises/mailData.html) |
| **API Features**              | [Map](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#map), [Join](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#join), [GroupBy](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#transformations-on-grouped-dataset), [GroupReduce](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#groupreduce-on-grouped-dataset) |
| **Reference Solution** &nbsp;&nbsp; | Java: [ReplyGraph.java](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/java/com/dataArtisans/flinkTraining/exercises/dataSetJava/replyGraph/ReplyGraph.java), Scala: [ReplyGraph.scala](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataSetScala/replyGraph/ReplyGraph.scala) |

<br>

#### TF-IDF

Compute TermFrequency-InvertedDocumentFrequency (TF-IDF) metrics for words in all mails on the Flink developer mailing list. TF-IDF is a measure for the importance of a word in a document and commonly used by search engine for result ranking.

| **Instructions**				| [DataSet API: TF-IDF](/exercises/tfidf.html)
| **Data Set**                  | [Mail Data Set](/exercises/mailData.html) |
| **API Features**              | [FlatMap](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#flatmap), [GroupBy](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#transformations-on-grouped-dataset), [GroupReduce](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#groupreduce-on-grouped-dataset), [Join](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#join), DataSet.collect() |
| **Reference Solution** &nbsp;&nbsp; 	| Java: [MailTFIDF.java](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/java/com/dataArtisans/flinkTraining/exercises/dataSetJava/tfIdf/MailTFIDF.java), Scala: [MailTFIDF.scala](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataSetScala/tfIdf/MailTFIDF.scala) |

<br>
<hr>
<br>

### Table API Exercises

The [Table API](http://ci.apache.org/projects/flink/flink-docs-master/libs/table.html) significantly eases the processing of structured data and evaluates SQL-like expressions. It can be mixed with the DataSet API and the DataStream API and offers methods to convert a DataSet/DataStream into a Table and vice versa.

#### Member of the Month

Find for each month the email address that sent the most emails to Flink's developer mailing list. This task requires the DataSet API to bring the data into shape and the Table API to do the actual computation.

| **Instructions**				| [Table API: Member of the Month](/exercises/memberOTM.html)
| **Data Set**                  | [Mail Data Set](/exercises/mailData.html) |
| **API Features**              | [Map](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#map), Table.select(), Table.groupBy(), Table.join() |
| **Reference Solution** &nbsp;&nbsp; | Java: [MemberOTMonth.java](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/java/com/dataArtisans/flinkTraining/exercises/tableJava/memberOTM/MemberOTMonth.java), Scala: [MemberOTMonth.scala](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/scala/com/dataArtisans/flinkTraining/exercises/tableScala/memberOTM/MemberOTMonth.scala) |

<br>

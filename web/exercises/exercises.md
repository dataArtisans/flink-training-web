---
title: Programming Exercises
layout: page
permalink: /exercises/
---

This training includes a few programming exercises that teach how to  implement scalable data analysis programs with Apache Flink's APIs and libraries. At this time, the exercises focus on Flink's DataSet API (batch) but will be extended to further APIs and libraries in the future.

The programming exercises assume a [working development environment](/setup.html) and some basic knowledge of Flink's programming primitives.

### DataSet API Exercises

#### [Exercise 1: Mail Stats](/exercises/mailStats.html)

Count the number of mails in the archive of Flink's developer mailing list per email address and month.

| **Data Set**                  | [Mail Data Set](/exercises/trainingData.html) |
| **API Features** &nbsp;&nbsp; | [Map](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#map), [GroupBy](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#transformations-on-grouped-dataset), [GroupReduce](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#groupreduce-on-grouped-dataset) |

<br>

#### [Exercise 2: TF-IDF](/exercises/tfidf.html)


| **Data Set**                  | [Mail Data Set](/exercises/trainingData.html) |
| **API Features** &nbsp;&nbsp; | [FlatMap](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#flatmap), [GroupBy](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#transformations-on-grouped-dataset), [GroupReduce](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#groupreduce-on-grouped-dataset), [Join](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#join), DataSet.collect() |

<br>

#### Exercise 3: TF-IDF with Table API

### Bonus Exercises

#### Bonus 1: DataStream API?

#### Bonus 2: Iterations?

#### Bonus 3: Gelly?

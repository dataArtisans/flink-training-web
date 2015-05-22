---
layout: page
title: Exercise 2 - TF-IDF
permalink: /exercises/tfIdf.html
---

The task of the "TF-IDF" exercise is to compute the *term-frequency/inverted-document-frequency* (TF-IDF) metric for words in mails of the Flink developer mailing list archives. 

TF-IDF is a metric that measures the importance of a term (word) in a document that is part of a collection of documents. Intuitively, TF-IDF describes for a term and document how representative the term is for the document. This metric is commonly used to weight the importance of search terms in search engines. 

TF-IDF is defined in two parts:

- The *term-frequency* `tf(t, d)` is the frequency of a term `t` in a document `d`, i.e., `tf('house', d1)` is equal to three if document `d1` contains the word `'house'` three times.
- The *inverted-document-frequency* `idf(t, D)` is the inverted fraction of documents that contain a term `t` in a collection of documents `D`, i.e., `idf('house', D) = 1.25` if four documents in a collection of five documents contain the word `'house'` (5 / 4 = 1.25).

The TF-IDF metric for a term `t` in document `d` of a collection `D` is computed as 

~~~
tf-idf(t, d, D) = tf(t, d) * idf(t, D).
~~~

By definition, a term has a high TF-IDF score and is representative for a document if it occurs very often in the document, but is rare in the overall collection of documents.

### Input Data

This exercise uses the [mail data set](/exercises/trainingData.html) that was extracted from the Apache Flink development mailing list archive. The data set consists of email records with seven fields

~~~
UniqueMID    : String // a unique message id
Timestamp    : String // the mail deamon timestamp
Sender       : String // the sender of the mail
Subject      : String // the subject of the mail
Body         : String // the body of the mail (contains linebrakes)
MessageID    : String // the message id as provided 
                           (may be “null” and not unique)
Replied-ToID : String // the message id of the mail this mail was replied to 
                      //   (may be “null”)
~~~

out of which the first and the fifth fields, `UniqueMID` and `Body`, are required for this exercise. The data can be accessed using Flink's tooling for delimiter-separated files (such as CSV or TSV files). The following code snippet shows how to read the first and the fifth field of the input data set as a `DataSet<Tuple2<String, String>>`:

~~~java
ExecutionEnvironment env = ExecutionEnvironment.getExecutionEnvironment();

DataSet<Tuple2<String, String>> mails =
  env.readCsvFile(<PATH-TO-DATASET>)
    .lineDelimiter(MBoxParser.MAIL_RECORD_DELIM)
    .fieldDelimiter(MBoxParser.MAIL_FIELD_DELIM)
    .includeFields("10001")
    .types(String.class, String.class); // read two String fields
~~~

### Expected Output

The output of the program should be a tuple with three fields `(UniqueMID, Word, TF-IDF-Score)` and could look like this:

~~~
(220:0,pojos,53.907407407407405)
(826:1,zookeeper,291.1)
(824:1,but,2.232361963190184)
(220:0,should,2.6694176983035307)
(804:1,predicate,277.23809523809524)
~~~

There are several ways to emit the data of the program. The easiest is to print it to the std-out using the `DataSet.print()` method. The order of the output records and their formatting does not matter. 

### Implementation Hints

#### Program Structure

Computing TF-IDF scores on a set of documents requires the following processing steps:

1. Count the number of documents (required to compute IDF)
1. Compute the term-frequency (TF)
1. Compute the inverted-document-frequency (IDF)
1. Compute the TF-IDF from TF and IDF

#### Word Extraction, Filtering & Normalization

The task requires to extract words from the message body. This can be easily done by tokenizing the `Body` String by whitespaces, filtering for tokens with alphabetical characters only, and converting all letters to lowercase. It is also common to filter out words that frequently occur in texts (so-called stop words) such as:

~~~
"the", "i", "a", "an", "at", "are", "am", "for", "and", "or", "is",
"there", "it", "this", "that", "on", "was", "by", "of", "to", "in",
"to", "not", "be", "with", "you", "have", "as", "can"
~~~

#### Count the number of documents

The most convenient method to count the number of elements in a data set is the `DataSet.count()` method which returns a `long` value with the count. `count()` is eagerly executed and does not require an `ExecutionEnvironment.execute()` call. The `long` value can be shared with the `IDF` computing function as a constructor parameter.

#### Computing the Term-Frequency

Computing the frequency of words in a document is independently done on each document. Hence it can be done with a `FlatMapFunction` that receives one document at a time, counts the occurrences of each word in the text (e.g., using a hash map), and emits one tuple with three fields `(UniqueMID, Word, TF)` for each counted word.

#### Computing the Inverted-Document-Frequency

Computing the fraction of documents that contain a certain word can be done in two steps. First compute the absolute number of documents that contain the word and second compute the IDF by normalizing the absolute count by the total number of documents (which was computed in a previous step). Computing the absolute number of documents that contain a certain word is similar to the [Mail Stats exercise](/exercises/mailstats.html) or the common WordCount example. When extracting the unique words from the document the same normalization techniques as for the TF computation should be applied. Unique words can be obtained by storing them in a hash set. The result of this step should be a tuple with two fields, `(Word, IDF)`.

#### Computing the TF-IDF score

Given the computed data sets for TF and IDF, we need to bring together the TF and IDF scores for each term, i.e., join the two data sets on the `Word` field, and compute the corresponding TF-IDF score.

### Sample Solution

A sample solution is available [here (LINK TO GH)]().
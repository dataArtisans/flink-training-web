---
layout: page
title: DataSet API - TF-IDF
permalink: /exercises/tfIdf.html
---

The task of the TF-IDF exercise is to compute the *term-frequency/inverted-document-frequency* (TF-IDF) metric for words in mails of the Flink developer mailing list archives. 

TF-IDF is a metric to measure the importance of a term (word) in a document that is part of a collection of documents. It is commonly used to weight the importance of search terms in search engines. 

TF-IDF is defined in two parts:

- The *term-frequency* `tf(t, d)` is the frequency of a term `t` in a document `d`, i.e., `tf('house', d1)` is equal to three if document `d1` contains the word `'house'` three times.
- The *inverted-document-frequency* `idf(t, D)` is the inverted fraction of documents that contain a term `t` in a collection of documents `D`, i.e., `idf('house', D) = 1.25` if four documents in a collection of five documents contain the word `'house'` (5 / 4 = 1.25).

The TF-IDF metric for a term `t` in document `d` of a collection `D` is computed as 

~~~
tf-idf(t, d, D) = tf(t, d) * idf(t, D).
~~~

Following this definition, a term has a high TF-IDF score (and is considered to be representative for a document) if it occurs very often in the document, but is rare in the overall collection of documents.

### Input Data

This exercise uses the [Mail Data Set](/exercises/mailData.html) which was extracted from the Apache Flink development mailing list archive. The task requires two fields, `MessageId` and `Body`. The input data can be read as a `DataSet<Tuple2<String, String>>`. When printed, the data set should look similar to this:

~~~
(<CAGr9p8A8Z7P787=c5RF5QbPKudLmPUsV3jCHKefZbwm=0UF-GA@mail.gmail.com>,
--047d7ba975c83720ed05122e218e
Content-Type: text/plain; charset=UTF-8

I didn't know that there was already an issue for this. I closed FLINK-1787.
The correct issue is this one:
https://issues.apache.org/jira/browse/FLINK-1711

--047d7ba975c83720ed05122e218e--
)
(<CANC1h_tGSdNdjO0YqQDPhBBtordrsMEOL8z1Rxwgy12LYB8aoQ@mail.gmail.com>,
--089e011823584ee26304fc0927d5
Content-Type: text/plain; charset=UTF-8

Yep, this looks like a bug, I agree.

--089e011823584ee26304fc0927d5--
)
~~~ 

### Expected Output

The result of the program should be a `DataSet<Tuple3<String, String, Double>>` where the first field is the `MessageId`, the second field is the `Word`, and the third field is the `TF-IDF` score.
When printed the data set should look like this:

~~~
(<CAPud8TrjpXYyqo6ur05-sjhUwRSh10XJVnCx_RuW9aUNKqjUTw@mail.gmail.com>,slide,2901.0)
(<CAPud8TrjpXYyqo6ur05-sjhUwRSh10XJVnCx_RuW9aUNKqjUTw@mail.gmail.com>,might,7.7774)
(<CAPud8TrjpXYyqo6ur05-sjhUwRSh10XJVnCx_RuW9aUNKqjUTw@mail.gmail.com>,case,21.1751)
(<CANC1h_s+BoRd7YMs5JTyhouDSC4x+5whH5feyfZOhG=_N7ZUsA@mail.gmail.com>,ship,68.2588)
(<CANC1h_s+BoRd7YMs5JTyhouDSC4x+5whH5feyfZOhG=_N7ZUsA@mail.gmail.com>,api,34.0721)
~~~

The first line of the example output indicates that the word `slide` has an TF-IDF score of `2901.0` in the mail with the ID `<CAPud8TrjpXYyqo6ur05-sjhUwRSh10XJVnCx_RuW9aUNKqjUTw@mail.gmail.com>`.


### Implementation Hints

#### Program Structure

Computing TF-IDF scores on a set of documents requires the following processing steps:

1. Count the number of documents (required to compute IDF)
1. Compute the term-frequency (TF)
1. Compute the inverted-document-frequency (IDF)
1. Compute the TF-IDF from TF and IDF

#### Word Extraction, Filtering & Normalization

The task requires to extract words from the message body. This can be done by tokenizing the `Body` String by whitespaces, filtering for tokens with alphabetical characters only, and converting all letters to lowercase. It is also common to filter out words that frequently occur in texts (so-called stop words) such as:

~~~
"the", "i", "a", "an", "at", "are", "am", "for", "and", "or", "is",
"there", "it", "this", "that", "on", "was", "by", "of", "to", "in",
"to", "not", "be", "with", "you", "have", "as", "can"
~~~

#### Count the number of documents

The most convenient method to count the number of elements in a data set is the `DataSet.count()` method which returns a `long` value with the number of elements in the data set. `count()` is eagerly executed and does not require an `ExecutionEnvironment.execute()` call. The `long` value can be shared with the function that computes `IDF` as a constructor parameter.

#### Computing the Term-Frequency

Computing the frequency of words in a document can be independently done on each document using a `FlatMapFunction`. The function receives one document at a time, extracts all words, counts the occurrences of each unique word in the text (e.g., using a hash map), and emits one tuple with three fields `(UniqueMID, Word, TF)` for each counted word.

#### Computing the Inverted-Document-Frequency

Computing the fraction of documents that contain a certain word can be done in two steps. First compute the absolute number of documents that contain the word and second compute the IDF by normalizing the absolute count by the total number of documents (which was computed in a previous step). Computing the absolute number of documents that contain a certain word is similar to the [Mail Count](/exercises/mailCount.html) exercise or the common WordCount example. When extracting the unique words from the document the same normalization techniques as for the TF computation should be applied. Unique words can be obtained by storing them in a hash set. The result of this step should be a tuple with two fields, `(Word, IDF)`.

#### Computing the TF-IDF score

Given the computed data sets for TF and IDF, we need to bring together the TF and IDF scores for each term, i.e., join the two data sets on the `Word` field, and compute the corresponding TF-IDF score.

### Reference Solution

A reference solution is available [here (LINK TO GH)]().
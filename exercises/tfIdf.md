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

This exercise uses the Mail Data Set which was extracted from the Apache Flink development mailing list archive. The [Mail Data Set instructions]({{ site.baseurl }}/exercises/mailData.html) show how to read the data set in a Flink program using the `CsvInputFormat`.

The task requires two fields, `MessageId` and `Body`. The input data can be read as a `DataSet<Tuple2<String, String>>`. When printed, the data set should look similar to this:

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

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingOne">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
Program Structure
        </a>
      </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
      <div class="panel-body" markdown="span">
Computing TF-IDF scores on a set of documents requires the following processing steps. First, count the number of documents (required to compute IDF). Second, compute the term-frequency (TF) and the the inverted-document-frequency (IDF). Finally, compute the TF-IDF from TF and IDF.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
Word Extraction, Filtering &amp; Normalization
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body" markdown="span">
The task requires to extract words from the message body. This can be done by tokenizing the `Body` String by whitespaces, filtering for tokens with alphabetical characters only, and converting all letters to lowercase. It is also common to filter out words that frequently occur in texts (so-called stop words) such as:

*"the", "i", "a", "an", "at", "are", "am", "for", "and", "or", "is", "there", "it", "this", "that", "on", "was", "by", "of", "to", "in", "to", "not", "be", "with", "you", "have", "as", "can"*
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingThree">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
Count the number of documents
        </a>
      </h4>
    </div>
    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <div class="panel-body" markdown="span">
The most convenient method to count the number of elements in a data set is the `DataSet.count()` method which returns a `long` value with the number of elements in the data set. `count()` is eagerly executed and does not require an `ExecutionEnvironment.execute()` call. The `long` value can be shared with the function that computes `IDF` as a constructor parameter.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingFour">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
Computing the Term-Frequency
        </a>
      </h4>
    </div>
    <div id="collapseFour" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">
      <div class="panel-body" markdown="span">
Computing the frequency of words in a document can be independently done on each document using a `FlatMapFunction`. The function receives one document at a time, extracts all words, counts the occurrences of each unique word in the text (e.g., using a hash map), and emits one tuple with three fields `(UniqueMID, Word, TF)` for each counted word.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingFive">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
Computing the Inverted-Document-Frequency
        </a>
      </h4>
    </div>
    <div id="collapseFive" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFive">
      <div class="panel-body" markdown="span">
Computing the fraction of documents that contain a certain word can be done in two steps. First compute the absolute number of documents that contain the word and second compute the IDF by normalizing the absolute count by the total number of documents (which was computed in a previous step). Computing the absolute number of documents that contain a certain word is similar to the [Mail Count]({{ site.baseurl }}/exercises/mailCount.html) exercise or the common WordCount example. When extracting the unique words from the document the same normalization techniques as for the TF computation should be applied. Unique words can be obtained by storing them in a hash set. The result of this step should be a tuple with two fields, `(Word, IDF)`.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingSix">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
Computing the TF-IDF score
        </a>
      </h4>
    </div>
    <div id="collapseSix" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSix">
      <div class="panel-body" markdown="span">
Given the computed data sets for TF and IDF, we need to bring together the TF and IDF scores for each term, i.e., join the two data sets on the `Word` field, and compute the corresponding TF-IDF score.
      </div>
    </div>
  </div>
</div>

### Reference Solution

Reference solutions are available at GitHub:

- Java: [MailTFIDF.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/dataset_java/tf_idf/MailTFIDF.java)
- Scala: [MailTFIDF.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataartisans/flinktraining/exercises/dataset_scala/tf_idf/MailTFIDF.scala)
---
layout: page
title: DataSet API - Reply Graph
permalink: /exercises/replyGraph.html
---

The task of the "Reply Graph" exercise is to extract reply connections between mails in the archives of Apache Flink's developer mailing list. These connections can be used to define a reply graph and to analyze the structure of the Flink community.

A reply connection is defined as a pair of two email addresses (`Tuple2<String, String>`) where the first email address replied to an email of the second email address. The task of this exercise is to compute all reply connections between emails in the Mail Data Set and count the number of reply connections for each unique pair of email addresses.

### Input Data

This exercise uses the Mail Data Set which was extracted from the Apache Flink development mailing list archive. The [Mail Data Set instructions]({{ site.baseurl }}/exercises/mailData.html) show how to read the data set in a Flink program using the `CsvInputFormat`.

The task requires three fields `MessageID`, `Sender`, and `Reply-To`. The input data can be read as a `DataSet<Tuple3<String, String, String>>`. When printed, the data set should look similar to this:

~~~
(<CAAdrtT0-sfxxUK-BrPC03ia7t1WR_ogA5uA6J5CSRvuON+snTg@mail.gmail.com>,Fabian Hueske <fhueske@apache.org>,<C869A196-EB43-4109-B81C-23FE9F726AC6@apache.org>)
(<CANMXwW0HOvk7n=h_rTv3RbK0E4ti1D7OdsY_3r8joib6rAAt2g@mail.gmail.com>,Aljoscha Krettek <aljoscha@apache.org>,<CANC1h_vn8E8TLXD=8szDN+0HO6JrU4AsCWgrXh8ojkA=FiPxNw@mail.gmail.com>)
(<0E10813D-5ED0-421F-9880-17C958A41724@fu-berlin.de>,Ufuk Celebi <u.celebi@fu-berlin.de>,null)
~~~

**Note**, the `Reply-To` field might have the value `"null"` indicating that this mail was not written in repsonse to another mail.

### Expected Output

The result for the exercise should be a `DataSet<Tuple3<String, String, Integer>>`. The first field is the sender email address of the reply mail, the second field is the sender email address of the mail that was replied to, and the third field is the number of reply connections between these two email addresses. When printed, the data set should look like this:

~~~
(sewen@apache.org,rmetzger@apache.org,72)
(aljoscha@apache.org,sewen@apache.org,40)
(fhueske@apache.org,rmetzger@apache.org,22)
(rmetzger@apache.org,fhueske@apache.org,22)
~~~

The first result line indicates that `sewen@apache.org` replied 72 times to an email send by `rmetzger@apache.org`.

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
This exercise can be solved in three steps. First, extract the email address from the sender field and remove mails from automated senders such as JIRA or Github. Second, compute reply connections of emails by evaluating the `MessageId` and `Reply-To` fields. And finally, count the number of reply connections for each unique pair of email addresses.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
Extract Email address from sender field
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body" markdown="span">
Extracting the email address from the sender field can be done by looking at an individual input record. Hence it should be done using a `MapFunction` which replaces the sender field by the extracted email address. This the same operation that needs to be done for the [Mail Count]({{ site.baseurl }}/exercises/mailCount.html) exercise.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingThree">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
Computing reply connections
        </a>
      </h4>
    </div>
    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <div class="panel-body" markdown="span">
A reply connection is defined by two mail records where the `Reply-To` field of the first mail record is equal to the `MessageId` field of the second mail record. This is can be done by [joining](http://ci.apache.org/projects/flink/flink-docs-master/apis/dataset_transformations.html#join) the mail record data set by itself on the `MessageId` and the `Reply-To` fields.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingFour">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
Counting the number of reply connections per pair of email addresses
        </a>
      </h4>
    </div>
    <div id="collapseFour" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">
      <div class="panel-body" markdown="span">
Counting the number of reply connections for each unique pair of email addresses is again similar to counting the number of mails in the [Mail Count]({{ site.baseurl }}/exercises/mailCount.html) exercise. 
      </div>
    </div>
  </div>
</div>

### Reference Solution

Reference solutions are available at GitHub:

- Java: [ReplyGraph.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/dataSetJava/replyGraph/ReplyGraph.java)
- Scala: [ReplyGraph.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataArtisans/flinkTraining/exercises/dataSetScala/replyGraph/ReplyGraph.scala)

---
layout: page
title: DataSet API - Reply Graph Extraction
permalink: /exercises/replyGraph.html
---

The task of the "Reply Graph Extraction" exercise is to extract the reply connections of the mails in the archives of Apache Flink's developer mailing list. These connections can be used to define a reply graph and to analyze the structure of the Flink community.

A reply connection is defined as a pair of two email addresses (`Tuple2<String, String>`) where the first email address reponds to an email of the second email address. The task of this exercise is to compute all reply connections between emails in the Mail Data Set and count the number of reply connections for each unique pair of email addresses.

### Input Data

This exercise uses the [Mail Data Set](/exercises/mailData.html) which was extracted from the Apache Flink development mailing list archive. This task requires three fields `MessageID`, `Sender`, and `Reply-To`. If 
read correctly, the input data is a `DataSet<Tuple3<String, String, String>>` and should look similar to this when printed:

{% highlight %}
(<CAAdrtT0-sfxxUK-BrPC03ia7t1WR_ogA5uA6J5CSRvuON+snTg@mail.gmail.com>,Fabian Hueske <fhueske@apache.org>,<C869A196-EB43-4109-B81C-23FE9F726AC6@apache.org>)
(<CANMXwW0HOvk7n=h_rTv3RbK0E4ti1D7OdsY_3r8joib6rAAt2g@mail.gmail.com>,Aljoscha Krettek <aljoscha@apache.org>,<CANC1h_vn8E8TLXD=8szDN+0HO6JrU4AsCWgrXh8ojkA=FiPxNw@mail.gmail.com>)
(<0E10813D-5ED0-421F-9880-17C958A41724@fu-berlin.de>,Ufuk Celebi <u.celebi@fu-berlin.de>,null)
{% endhighlight %}

As you can see, the `Reply-To` field might have the value `"null"` indicating that this mail was not written in repsonse to another one.

### Expected Output

The easiest way to emit data from a Flink program is to print it to the std-out using the `DataSet.print()` method. The expected output for this task looks like:

{% highlight %}
(sewen@apache.org,rmetzger@apache.org,72)
(aljoscha@apache.org,sewen@apache.org,40)
(fhueske@apache.org,rmetzger@apache.org,22)
(rmetzger@apache.org,fhueske@apache.org,22)
{% endhighlight %}

Where the first field is the sender email address of the reply mail, the second field is the sender email address of the mail that was replied to, and the third field is the number of reply connections between these two email addresses.

The order of the output records and their formatting does not matter. 

### Implementation Hints

#### Program Structure



### Sample Solution

A sample solution is available [here (LINK TO GH)]().

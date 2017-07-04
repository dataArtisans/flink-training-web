---
layout: page
title: Mail Data Set
permalink: /exercises/mailData.html
---

All communication within Apache projects is happening on or is mirrored to mailing lists. Most of these lists are public and archived. The Mail Data Set is derived from the public archives of Apache Flink's developer and issues mailing lists (dev@flink.apache.org and issues@flink.apache.org).

### 1. Download the Mail Data Set

Download and extract the Mail Data Set by running the following commands

~~~~
wget http://training.data-artisans.com/trainingData/flinkMails.gz
~~~~

Please do not decompress or rename the .gz file.

#### Data format of the Mail Data Set

The Mail Data Set is formatted in a delimited text format. Email records are separated by a "`##//##`" char sequence.
Each mail record has six fields:

~~~
MessageID  : String // a unique message id
Timestamp  : String // the mail deamon timestamp
Sender     : String // the sender of the mail
Subject    : String // the subject of the mail
Body       : String // the body of the mail (contains linebrakes)
Replied-To : String // the messageID of the mail this mail was replied to 
                    //   (may be “null”)
~~~

which are separated by a "`#|#`" char sequence.

Hence, the format of the file is 

~~~
<MessageID>#|#<Timestamp>#|#<Sender>#|#<Subject>#|#<Body>#|#<RepliedTo>##//##<MessageId>#|#TimeStamp>#|#...
~~~

### 2. Read the Mail Data Set in a Flink program

The Mail Data Set can be read using Flink's `CsvInputFormat`. It will decompress the input file on-the-fly.

#### Java

{% highlight java %}
// get an ExecutionEnvironment
ExecutionEnvironment env = ExecutionEnvironment.getExecutionEnvironment();

// read all fields
DataSet<Tuple6<String, String, String, String, String, String>> mails =
  env.readCsvFile("/path/to/your/flinkMails.gz")
    .lineDelimiter("##//##")
    .fieldDelimiter("#|#")
    .types(String.class, String.class, String.class,
           String.class, String.class, String.class);

// read sender and body fields
DataSet<Tuple2<String, String>> senderBody =
  env.readCsvFile("/path/to/your/flinkMails.gz")
    .lineDelimiter("##//##")
    .fieldDelimiter("#|#")
    .includeFields("00101")
    .types(String.class, String.class);
{% endhighlight %}

#### Scala

{% highlight scala %}
// get an ExecutionEnvironment
val env = ExecutionEnvironment.getExecutionEnvironment

// read all fields
val mails = env.readCsvFile[(String, String, String, String, String, String)](
    "/path/to/your/flinkMails.gz",
    lineDelimiter = "##//##",
    fieldDelimiter = "#|#",
  )

// read sender and body fields
val senderBody = env.readCsvFile[(String, String)](
    "/path/to/your/flinkMails.gz",
    lineDelimiter = "##//##",
    fieldDelimiter = "#|#",
    includedFields = Array(2,4)
  )
{% endhighlight %}

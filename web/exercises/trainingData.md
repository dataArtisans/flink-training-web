---
layout: page
title: Mail Data Set
permalink: /exercises/mailData.html
---

The Mail Data Set is derived from the public archives of Apache Flink's developer mailing list (dev@flink.apache.org). All communication within Apache projects is happening on or is mirrored to mailing lists. Most of these lists are public and archived. The archives of each public mailing list, such as Apache Flink's developer mailing list, are online available as Mbox files for each individual month. For example, the archived mails of dev@flink.apache.org for December 2014 are available under the URL [http://mail-archives.apache.org/mod_mbox/flink-dev/201412.mbox](http://mail-archives.apache.org/mod_mbox/flink-dev/201412.mbox). 

### Download the raw mail archive data

For this training, download some Mbox files of Flink's mailing list archive and store them into a folder. On Linux or OSX you can use the following commands to do that:

{% highlight bash %}
mkdir flink-dev-archive
cd flink-dev-archive
wget http://mail-archives.apache.org/mod_mbox/flink-dev/201406.mbox
wget http://mail-archives.apache.org/mod_mbox/flink-dev/201407.mbox
wget http://mail-archives.apache.org/mod_mbox/flink-dev/201408.mbox
...
{% endhighlight %}

### Mbox data format

The [Mbox mail archive format](http://en.wikipedia.org/wiki/Mbox) is a text-based file format which stores a sequence of mails. A mail is encoded in multiple lines. The first line of a mail starts with "`From `" and continues with the mailer daemon and a time stamp. The following lines are formatted as key-value pairs as for example "`Subject: Re: Podling name search initiated`" containing information such as subject, sender, and reply-to of the mail. An empty line indicates the end of the key-value section and the start of the email body. After the last line of the mail body, the next mail starts with a line that begins again with "`From `".

This format is not very well suited for immediate analysis and requires a bit of cleansing and formatting.

### Generate the Mail Data Set

We provide a data set extraction program, which reads Mbox files of Apache mailing list archives and converts the mails into a structured format that can be easily processed. The program is included in the Maven project of this training and can be found on [Github](https://github.com/dataArtisans/flink-training/blob/master/flink-exercises/src/main/java/com/dataArtisans/flinkTraining/dataSetPreparation/MBoxParser.java). 

The Flink training project is downloaded and built by running the following commands

{% highlight bash %}
git clone https://github.com/dataArtisans/flink-training.git
cd flink-training/flink-exercises
mvn clean package
{% endhighlight %}

Afterwards the JAR file of the data set extraction program is located at `./target/flink-exercises-0.1-MBoxParser.jar`.
The program can be executed on a [running local Flink instance](http://localhost:4000/localExec.html) using Flink's CLI client with the following commands

{% highlight bash %}
cd /path/to/flink-installation
./bin/start-local.sh
./bin/flink run /path/to/flink-exercises-0.1-MBoxParser.jar --input /path/to/mboxFiles --output /result/path
{% endhighlight %}

Detailed instructions on how to start a local Flink instance and how to run a Flink program JAR file can be found [here](http://localhost:4000/localExec.html).

### Data format of the Mail Data Set

The Mail Data Set is generated in a text format. Email records are separated by a "`##//##`" char sequence.
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

### Read the Mail Data Set with Flink

The Mail Data Set can be read using Flink's `CsvInputFormat`:

#### Java

{% highlight java %}
// get an ExecutionEnvironment
ExecutionEnvironment env = ExecutionEnvironment.getExecutionEnvironment();

// read all fields
DataSet<Tuple6<String, String, String, String, String, String>> mails =
  env.readCsvFile(<PATH-TO-DATASET>)
    .lineDelimiter(MBoxParser.MAIL_RECORD_DELIM) // constant for "##//##"
    .fieldDelimiter(MBoxParser.MAIL_FIELD_DELIM) // constant for "#|#"
    .types(String.class, String.class, String.class,
           String.class, String.class, String.class);

// read sender and body fields
DataSet<Tuple2<String, String>> senderBody =
  env.readCsvFile(<PATH-TO-DATASET>)
    .lineDelimiter(MBoxParser.MAIL_RECORD_DELIM)
    .fieldDelimiter(MBoxParser.MAIL_FIELD_DELIM)
    .includeFields("00101")
    .types(String.class, String.class);
{% endhighlight %}

#### Scala

{% highlight scala %}
// get an ExecutionEnvironment
val env = ExecutionEnvironment.getExecutionEnvironment

// read all fields
val mails = env.readCsvFile[(String, String, String, String, String, String)](
    <PATH-TO-DATASET>,
    lineDelimiter = MBoxParser.MAIL_RECORD_DELIM, // constant for "##//##"
    fieldDelimiter = MBoxParser.MAIL_FIELD_DELIM, // constant for "#|#"
  )

// read sender and body fields
val senderBody = env.readCsvFile[(String, String)](
    <PATH-TO-DATASET>,
    lineDelimiter = MBoxParser.MAIL_RECORD_DELIM,
    fieldDelimiter = MBoxParser.MAIL_FIELD_DELIM,
    includedFields = Array(2,4)
  )
{% endhighlight %}
---
layout: page
title: Mail Data Set
permalink: /exercises/mailData.html
---

The Mail Data Set is derived from the public archives of Apache Flink's developer mailing list (dev@flink.apache.org). All communication within Apache projects is happening on or is mirrored to mailing lists. Most of these lists are public and archived. The archives of each public mailing list, such as Apache Flink's developer mailing list, are online available as Mbox files for each individual month. For example, the archived mails of dev@flink.apache.org for December 2014 are available under the URL [http://mail-archives.apache.org/mod_mbox/flink-dev/201412.mbox](http://mail-archives.apache.org/mod_mbox/flink-dev/201412.mbox). 

### 1. Build the MBoxParser Flink program

We provide a Flink program called `MBoxParser`, which reads Mbox files of Flink's developer Apache mailing list archive and converts the mails into a structured format that can be easily processed. To build the program JAR file run the following commands:

{% highlight bash %}
git clone https://github.com/dataArtisans/flink-training.git
cd flink-training/flink-exercises
mvn clean package
{% endhighlight %}

Afterwards the program's JAR file is located at `./target/flink-exercises-0.1-MBoxParser.jar`.

### 2. Download the raw mail archive data

Download a few Mbox files of Flink's mailing list archive and store them into a folder. On Linux or OSX you can use the following commands to do that:

{% highlight bash %}
mkdir ./flink-dev-archive
cd flink-dev-archive
wget http://mail-archives.apache.org/mod_mbox/flink-dev/201406.mbox
wget http://mail-archives.apache.org/mod_mbox/flink-dev/201407.mbox
wget http://mail-archives.apache.org/mod_mbox/flink-dev/201408.mbox
...
{% endhighlight %}

#### Mbox data format

The [Mbox mail archive format](http://en.wikipedia.org/wiki/Mbox) is a text-based file format which stores a sequence of mails. A mail is encoded in multiple lines. The first line of a mail starts with "`From `" and continues with the mailer daemon and a time stamp. The following lines are formatted as key-value pairs as for example "`Subject: Re: Podling name search initiated`" containing information such as subject, sender, and reply-to of the mail. An empty line indicates the end of the key-value section and the start of the email body. After the last line of the mail body, the next mail starts with a line that begins again with "`From `".

This format is not very well suited for immediate analysis and requires a bit of cleansing and formatting.

### 3. Generate the Mail Data Set

The program can be executed on a locally running Flink instance ([see setup instructions]({{ site.baseurl }}/setup.html)) using Flink's CLI client with the following commands

{% highlight bash %}
cd /path/to/your/flink-installation
./bin/start-local.sh
./bin/flink run /path/to/flink-exercises-0.1-MBoxParser.jar   \ 
            --input /path/to/flink-dev-archive                \
            --output /your/output/mail-data                 
{% endhighlight %}

The extracted Mail Data Set will be located in the `/your/output/mail-data` folder. 

#### Data format of the Mail Data Set

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

### 4. Read the Mail Data Set in a Flink program

The Mail Data Set can be read using Flink's `CsvInputFormat`:

#### Java

{% highlight java %}
// get an ExecutionEnvironment
ExecutionEnvironment env = ExecutionEnvironment.getExecutionEnvironment();

// read all fields
DataSet<Tuple6<String, String, String, String, String, String>> mails =
  env.readCsvFile("/your/output/mail-data")
    .lineDelimiter("##//##")
    .fieldDelimiter("#|#")
    .types(String.class, String.class, String.class,
           String.class, String.class, String.class);

// read sender and body fields
DataSet<Tuple2<String, String>> senderBody =
  env.readCsvFile("/your/output/mail-data")
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
    "/your/output/mail-data",
    lineDelimiter = "##//##",
    fieldDelimiter = "#|#",
  )

// read sender and body fields
val senderBody = env.readCsvFile[(String, String)](
    "/your/output/mail-data",
    lineDelimiter = "##//##",
    fieldDelimiter = "#|#",
    includedFields = Array(2,4)
  )
{% endhighlight %}
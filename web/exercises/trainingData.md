---
layout: page
title: Training DataSet
permalink: /exercises/trainingData.html
---

All exercises of this training use a data set that is derived from the public archives of Apache Flink's developer mailing list (dev@flink.apache.org). 

## Flink Developer Mailing List Archive

All communication within Apache projects is happening on or is mirrored to mailing lists. Most of these lists are public and archived. The archives of each public mailing list, such as Apache Flink's developer mailing list, are online available as Mbox files for each individual month. For example, the archived mails of dev@flink.apache.org for December 2014 are available under the URL [http://mail-archives.apache.org/mod_mbox/flink-dev/201412.mbox](http://mail-archives.apache.org/mod_mbox/flink-dev/201412.mbox). 

### Download the Raw Mail Archive Data

For this training, download some Mbox files of Flink's mailing list archive and store them into a folder. On Linux or OSX you can use the following commands to do that:

~~~bash
mkdir flink-dev-archive
cd flink-dev-archive
wget http://mail-archives.apache.org/mod_mbox/flink-dev/201406.mbox
wget http://mail-archives.apache.org/mod_mbox/flink-dev/201407.mbox
wget http://mail-archives.apache.org/mod_mbox/flink-dev/201408.mbox
...
~~~

### Mbox Data Format

The [Mbox mail archive format](http://en.wikipedia.org/wiki/Mbox) is a textual file format which stores a sequence of mails. A mail is encoded in multiple lines. The first line of a mail starts with "`From `" and continues with the mailer daemon and a time stamp. The following lines are formatted as key-value pairs as for example "`Subject: Re: Podling name search initiated`" containing information such as subject, sender, and reply-to of the mail. An empty line indicates the start of the email body. After the content of the body, the next mail follows with a line that starts with "`From `".

This format is not so well suited for immediate analysis and requires a bit of cleansing and formatting.

### Generate the Training Data Set

We provide a Flink program, which reads Mbox files of Apache mailing list archives, extracts some information, and writes the mails in an easy to process format. The program can be found in the exercise project ...

#### TODO

The training data set is generated in a separated text format. Emails are separated by "`##//##`" char sequence.
Each mail has seven fields:

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

which are separated by a "`#|#`" char sequence.

So the format of the file is 

~~~
<UniqueID>#|#<Timestamp>#|#<Sender>#|#<Subject>#|#<MessageBody>#|#<MessageId>#|#<RepliedToId>##//##<TimeStamp>#|#<Sender>#|#...
~~~

### Read the Training Data Set

The training data set can be read using Flink's `CsvInputFormat`:

#### Java

~~~java
ExecutionEnvironment env = ExecutionEnvironment.getExecutionEnvironment();

// read all data
DataSet<Tuple7<String, String, String, String, String, String, String>> mails =
	env.readCsvFile(<PATH-TO-DATASET>)
		.lineDelimiter(MBoxParser.MAIL_RECORD_DELIM)
		.fieldDelimiter(MBoxParser.MAIL_FIELD_DELIM)
		.types(String.class, String.class, String.class, String.class, 
			   String.class, String.class, String.class);

// read sender and body
DataSet<Tuple2<String, String>> senderBody =
	env.readCsvFile(<PATH-TO-DATASET>)
		.lineDelimiter(MBoxParser.MAIL_RECORD_DELIM)
		.fieldDelimiter(MBoxParser.MAIL_FIELD_DELIM)
		.includeFields("0101")
		.types(String.class, String.class);
~~~

#### Scala

~~~scala
// some Scala code
~~~
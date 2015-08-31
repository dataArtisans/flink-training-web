---
title: 5. DataStream API Basics - Hands-On
layout: page
permalink: /dataStreamBasics/handsOn.html
---

In this hands-on session you will implement your first Flink program using the DataStream API. You will also learn how to package a Flink program using Apache Maven and execute the packaged program on a running Flink instance. This lesson does also show how Flink programs can write to and read from [Apache Kafka](http://kafka.apache.org).

The following steps guide you through the process of setting up Apache Kafka, using the provided data stream generator, implementing your first Flink streaming program, and packaging and executing your program on a running Flink instance.

### 1. Start a local Apache Kafka instance

[Apache Kafka](http://kafka.apache.org) is a central component in many systems that process data streams. Kafka is a distributed and durable publish-subscribe system for data streams. A stream is called *topic* and can be populated from multiple sources and read from multiple consumers. Topics are persisted to harddisk and can be replayed.

Please follow these instructions to setup a local Kafka instance.

[Download](https://www.apache.org/dyn/closer.cgi?path=/kafka/0.8.2.0/kafka_2.10-0.8.2.0.tgz) Apache 0.8.2 and un-tar it.

~~~bash
tar -xzf kafka_2.10-0.8.2.0.tgz
cd kafka_2.10-0.8.2.0
~~~

Start an Apache Zookeeper instance (Kafka coordinates itself with ZooKeeper) on `localhost:2181`.

~~~bash
./bin/zookeeper-server-start.sh config/zookeeper.properties &
~~~

Start a Kafka instance on `localhost:9092`.

~~~bash
./bin/kafka-server-start.sh config/server.properties &
~~~

By default, Kafka persists data stream topics to `/tmp/kafka_logs`. Topics can be removed by deleting this directory when Kafka is shutdown. You can stop Kafka and ZooKeeper by calling the `./bin/kafka-server-stop.sh` and `./bin/zookeeper-server-stop.sh` scripts (in that order!).

### 2. Get the data for the Taxi Data Stream

The exercises of this lesson are based on a data stream of taxi ride events. The stream is produced by a generator which reads an input file. Please follow these [instructions]({{ site.baseurl }}/exercises/taxiData.html) to download the input file for the Taxi Data Stream generator and to learn how to use it.

### 3. Implement the Ride Cleansing exercise

In the [hands-on session of Lesson 2]({{ site.baseurl }}/devSetup/handsOn.html) you generated a Flink Maven quickstart project and imported it into your IDE. The quickstart project contains a class called `Job`. This class can be used as a template for all programming exercises. 

Please follow the instructions of the [Ride Cleansing exercise]({{ site.baseurl }}/exercises/rideCleansing.html) which includes a detailed task description, implementation hints, and links to reference solutions in Java and Scala.

### 4. Package your program for execution

Flink programs are packaged as regular JAR files. A program JAR file must contain all classes, resource files, and libraries that are required to execute the program. 

The easiest way to package a Flink program into a JAR is to develop Flink programs using a Flink Maven quickstart project. These projects have correctly configured POM files. A Flink Maven Quickstart project is compiled and packaged into a fat JAR file that includes all dependencies by running the following commands

~~~
cd /path/to/your/quickstart/project
mvn clean package
~~~

The resulting JAR file will be located in the project's `./target/` folder.

### 5. Execute your packaged Flink program

Flink provides different clients to submit a program to a running Flink system including a [command-line client](http://ci.apache.org/projects/flink/flink-docs-master/apis/cli.html) (CLI client) and a [web-based client](http://ci.apache.org/projects/flink/flink-docs-master/apis/web_client.html). 

Given a program packaged as JAR file, Flink's submission clients identify the entry point of the program, i.e., the class with the `main()` method, as the class that is defined as `Main-Class` in the JAR's `MANIFEST.MF` like this:

~~~
Main-Class: my.program.MainClass
~~~

If no `Main-Class` is defined in the `MANIFEST.MF` file or if a JAR file bundles more than one program, Flink's submission clients also provide an option to specify the class that should be used as a program entry point.

To execute your packaged Flink program using the CLI client make sure you have a locally running Flink instance ([see instructions]({{ site.baseurl }}/devSetup/handsOn.html)) and run the following commands:

~~~bash
cd /path/to/flink/installation
./bin/flink run -c your.MainClass /path/to/program/jarfile -arg1 -arg2 ...
~~~

Further options can be found in the documentation of the [CLI client](http://ci.apache.org/projects/flink/flink-docs-master/apis/cli.html). On Windows, the CLI client is started using the `.\bin\flink.bat` script.

### 6. Monitor the execution of a Flink program

The Flink JobManager webinterface at [http://localhost:8081](http://localhost:8081) shows the execution of Flink programs, performance metrics of the TaskManagers, and information to analyze the execution time of completed programs.

### 7. I am done. What now?

Try to implement the [next programming exercise]({{ site.baseurl }}/exercises) or play around with the DataStream API.
---
title: How to do the Exercises
layout: page
permalink: /howto-exercises.html
---

In the hands-on sessions you will implement Flink programs using various Flink APIs. You will also learn how to package a Flink program using Apache Maven and execute the packaged program on a running Flink instance.

The following steps guide you through the process of using the provided data streams, implementing your first Flink streaming program, and packaging and executing your program on a running Flink instance.

We assume you have setup your development environment according to our [setup guide]( {{site.baseurl }}/devEnvSetup.html).

### 1. Get the data

The initial set of exercises are all based on a data stream of taxi ride events. This stream is produced by a source function which reads an input file. Please follow these [instructions]({{ site.baseurl }}/exercises/taxiData.html) to download the input file for the Taxi Data Stream source and to learn how to use it.

There are also some advanced exercises that use a [connected car event stream]({{ site.baseurl }}/exercises/taxiData.html).

### 2. Implement the exercise

The [setup guide]({{ site.baseurl }}/devEnvSetup.html) shows how to generate a Flink Maven quickstart project and import it into your IDE. The quickstart project contains a class called `StreamingJob`. This class is a template for DataStream programs and can be used for all programming exercises.

The instructions for each exercise include a detailed task description, implementation hints, and links to reference solutions in Java and Scala.

### 3. Package your program for execution

For most of the exercises it is perfectly fine to simply run your application in the IDE. But if you want or need to package it as a JAR file, that's easily done.

A program JAR file must contain all classes, resource files, and libraries that are required to execute the program.
The easiest way to package a Flink program into a JAR is to develop Flink programs using a Flink Maven quickstart project. These projects have correctly configured POM files. A Flink Maven Quickstart project is compiled and packaged into a fat JAR file that includes all dependencies by running the following commands

~~~
cd /path/to/your/quickstart/project
mvn clean package
~~~

The resulting JAR file will be located in the project's `./target/` folder.

### 4. Execute your packaged Flink program

Flink provides different clients to submit a program to a running Flink system including a [command-line client]({{ site.docs }}/setup/cli.html) (CLI client). To execute your packaged Flink program using the CLI client make sure you have a locally running Flink instance ([see instructions]({{ site.baseurl }}/devEnvSetup.html)) and run the following commands:

~~~bash
cd /path/to/flink/installation
./bin/flink run -c your.MainClass /path/to/program/jarfile -arg1 -arg2 ...
~~~

Further options can be found in the documentation of the [CLI client]({{ site.docs }}/setup/cli.html). On Windows, the CLI client is started using the `.\bin\flink.bat` script.

### 5. Monitor the execution of a Flink program

The Flink JobManager web interface at [http://localhost:8081](http://localhost:8081) shows the execution of Flink programs, performance metrics of the TaskManagers, and information to analyze the execution time of completed programs.

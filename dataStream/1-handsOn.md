---
title: DataStream API Basics - Hands-On
layout: page
permalink: /dataStream/1-handsOn.html
---

In this hands-on session you will implement your first Flink program using the DataStream API. You will also learn how to package a Flink program using Apache Maven and execute the packaged program on a running Flink instance. 

The following steps guide you through the process of using the provided data stream generator, implementing your first Flink streaming program, and packaging and executing your program on a running Flink instance.


### 1. Get the data for the Taxi Data Stream

The exercises of this lesson are based on a data stream of taxi ride events. The stream is produced by a source function which reads an input file. Please follow these [instructions]({{ site.baseurl }}/exercises/taxiData.html) to download the input file for the Taxi Data Stream source and to learn how to use it.

### 2. Implement the Ride Cleansing exercise

The [hands-on session of Lesson 2]({{ site.baseurl }}/devSetup/handsOn.html) showed how to generate a Flink Maven quickstart project and imported it into your IDE. The quickstart project contains a class called `Job`. This class can be used as a template for all programming exercises. 

The instructions of the [Ride Cleansing exercise]({{ site.baseurl }}/exercises/rideCleansing.html) include a detailed task description, implementation hints, and links to reference solutions in Java and Scala.

### 3. Package your program for execution

Flink programs are packaged as regular JAR files. A program JAR file must contain all classes, resource files, and libraries that are required to execute the program. 

The easiest way to package a Flink program into a JAR is to develop Flink programs using a Flink Maven quickstart project. These projects have correctly configured POM files. A Flink Maven Quickstart project is compiled and packaged into a fat JAR file that includes all dependencies by running the following commands

~~~
cd /path/to/your/quickstart/project
mvn clean package
~~~

The resulting JAR file will be located in the project's `./target/` folder.

### 4. Execute your packaged Flink program

Flink provides different clients to submit a program to a running Flink system including a [command-line client](http://ci.apache.org/projects/flink/flink-docs-release-1.0/apis/cli.html) (CLI client) and a [web-based client] available on the JobManager web interface.

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

Further options can be found in the documentation of the [CLI client](http://ci.apache.org/projects/flink/flink-docs-release-1.0/apis/cli.html). On Windows, the CLI client is started using the `.\bin\flink.bat` script.

### 5. Monitor the execution of a Flink program

The Flink JobManager webinterface at [http://localhost:8081](http://localhost:8081) shows the execution of Flink programs, performance metrics of the TaskManagers, and information to analyze the execution time of completed programs.

### 6. I am done. What now?

Try to implement the [next programming exercise]({{ site.baseurl }}/exercises) or play around with the DataStream API.

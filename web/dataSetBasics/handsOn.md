---
title: 3. DataSet API Basics - Hands-On
layout: page
permalink: /dataSetBasics/handsOn.html
---

In this hands-on session you will implement your first Flink program using the DataSet API. You will also learn how to package a Flink program using Apache Maven, execute the packaged program on a running Flink instance, and monitor its progress.

The programming exercise of this lesson is to count the number of emails in Flink’s mailing list archives per email address and month. Like all other exercises of this training, the Mail Count exercise is based on the Mail Data Set which consists of about 25,000 emails extracted from Apache Flink's mailing list archives.

The following steps guide you through the process of downloading the Mail Data Set, implementing the Mail Count exercise, and packaging and executing your program on a running Flink instance.

### 1. Get the Mail Data Set

Please follow these [instructions]({{ site.baseurl }}/exercises/mailData.html) to download and extract the Mail Data Set. 

### 2. Implement the Mail Count exercise

In the [hands-on session of Lesson 2]({{ site.baseurl }}/devSetup/handsOn.html) you generated a Flink Maven quickstart project and imported it into your IDE. The quickstart project contains a class called `Job`. This class can be used as a template for all programming exercises. 

Please follow the instructions of the [Mail Count exercise]({{ site.baseurl }}/exercises/mailCount.html) which includes a detailed task description, implementation hints, and links to reference solutions in Java and Scala.

### 3. Package your program for execution

Flink programs are packaged as regular JAR files. A program JAR file must contain all classes, resource files, and libraries that are required to execute the program. 

The easiest way to package a Flink program into a JAR is to develop Flink programs using a Flink Maven quickstart project. Such projects have correctly configured POM files can be compiled and packages into a fat JAR file that includes all dependencies by running the following commands

~~~
cd /path/to/your/quickstart/project
mvn clean package
~~~

The resulting JAR file will be located in the project's `./target/` folder.

### 4. Execute your packaged Flink program

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

### 5. Monitor the execution of a Flink program

The Flink JobManager webinterface at [http://localhost:8081](http://localhost:8081) shows the execution of Flink programs, performance metrics of the TaskManagers, and information to analyze the execution time of completed programs.

Given that the Mail Data Set is rather small, your program will be finished almost immediately after its submission. You can check the history to see some details on its execution.

### 6. I am done. What now?

Try to implement the [next programming exercise]({{ site.baseurl }}/exercises) or play around with the DataSet API.
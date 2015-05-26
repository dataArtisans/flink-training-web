---
title: Local Execution
layout: page
permalink: /localExec.html
---

Developing Flink programs in an IDE is comfortable because programs can be easily executed and debugged. However in order to execute a program on a running Flink system, the program needs to be packaged and submitted. Flink offers a webinterface to monitor the execution of a program.

Here we will show the necessary steps to package, submit, and monitor a Flink program on a local Flink instance. Executing a Flink program on a cluster or YARN setup is very similar.

### Packaging a program for execution

Flink programs are packaged as regular JAR files. A program JAR file must contain all classes, resource files, and libraries that are required to execute the program. Flink's submission clients identify the entry point of the program, i.e., the class with the `main()` method, as the class that is defined as `Main-Class` in the JAR's `MANIFEST.MF` like this:

~~~
Main-Class: my.program.MainClass
~~~

If no `Main-Class` is defined in the `MANIFEST.MF` file or if a JAR file bundles more than one program, Flink's submission clients also provide an option to specify the class that should be used as a program entry point.

The easiest way to package a Flink program into a JAR is to develop Flink programs based on Flink's Maven archetypes. Programs that are built on these archetypes and have correctly configured POM files can be compiled and packages into a fat JAR file that includes all dependencies list this:

~~~
cd /to/your/program/root/folder
mvn clean package
~~~

The resulting JAR file will be located in the `./target/` folder.

### Starting and stopping a local Flink instance

Flink provides scripts to locally start a Flink master and a Flink worker within the same JVM. This mode is not meant for production but for local testing. Such a local Flink setup can be started on Unix system as follows:

~~~bash
> cd /to/your/flink/installation
> ./bin/start-local.sh
~~~

On Windows this can be done with: 

~~~bash
> cd C:\to\your\flink\installation
> .\bin\start-local.bat
~~~

You can validate that a local FLink instance is running by looking at the log files in `./log/` or opening the JobManager's webinterface at [http://localhost:8081](http://localhost:8081). 

A locally running Flink instance 

### Executing a Flink program using the CLI client

Flink provides different clients to submit a program to a running Flink system including a [command-line client](http://ci.apache.org/projects/flink/flink-docs-master/apis/cli.html) (CLI client) and a [web-based client](http://ci.apache.org/projects/flink/flink-docs-master/apis/web_client.html).

A program can be executed using the CLI client as follows:

~~~bash
> ./bin/flink run /path/to/program/jarfile --arg1 val1 --arg2 val2
~~~

If the `Main-Class` is not specified in the `MANIFEST.MF` file, you can specify an entry class using the `-c` parameter:

~~~bash
> ./bin/flink run -c my.main.Class /path/to/program/jarfile --arg1 val1 --arg2 val2
~~~

Further options can be found in the documentation of the [CLI client](http://ci.apache.org/projects/flink/flink-docs-master/apis/cli.html). On Windows, the CLI client is started using the `.\bin\flink.bat` script.

### Monitoring the execution of a Flink program

The Flink JobManager webinterface at [http://localhost:8081](http://localhost:8081) shows the execution of Flink programs, performance metrics of the TaskManagers, and information to analyze the execution time of completed programs.


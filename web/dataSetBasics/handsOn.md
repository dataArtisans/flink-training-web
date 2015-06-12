---
title: 3. DataSet API Basics - Hands-On
layout: page
permalink: /dataSetBasics/handsOn.html
---

### Implement your first Flink program

- get the training data set
- use Maven quickstart Job.class as template
- implement exercise 
- implementation hints and reference solution is provided

### Package and execute your program

- local instance
  - remote execution is very much the same

### I am done

- go to the next exercise

# Packaging & Local Execution

Developing Flink programs in an IDE is comfortable because the programs can be easily executed and debugged. However in order to execute a program on a running Flink system, the program needs to be packaged and submitted. The progress of the executed program can be monitored on Flink's webinterface.

Here we will show the necessary steps to package, submit, and monitor a Flink program on a local Flink instance. 

### Package a program for execution

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

### Execute a Flink program using the CLI client

Flink provides different clients to submit a program to a running Flink system including a [command-line client](http://ci.apache.org/projects/flink/flink-docs-master/apis/cli.html) (CLI client) and a [web-based client](http://ci.apache.org/projects/flink/flink-docs-master/apis/web_client.html). Given that a local Flink instance is running ([see instructions]({{ site.baseurl }}/setup.html)),
a program can be executed using the CLI client as follows:

~~~bash
> ./bin/flink run /path/to/program/jarfile --arg1 val1 --arg2 val2
~~~

If the `Main-Class` is not specified in the `MANIFEST.MF` file, you can specify an entry class using the `-c` parameter:

~~~bash
> ./bin/flink run -c my.main.Class /path/to/program/jarfile --arg1 val1 --arg2 val2
~~~

Further options can be found in the documentation of the [CLI client](http://ci.apache.org/projects/flink/flink-docs-master/apis/cli.html). On Windows, the CLI client is started using the `.\bin\flink.bat` script.

Executing a Flink program on a [cluster](http://ci.apache.org/projects/flink/flink-docs-master/apis/cluster_execution.html) or on a [YARN setup](http://ci.apache.org/projects/flink/flink-docs-master/setup/yarn_setup.html#quickstart-run-a-flink-job-on-yarn) is very similar.

### Monitor the execution of a Flink program

The Flink JobManager webinterface at [http://localhost:8081](http://localhost:8081) shows the execution of Flink programs, performance metrics of the TaskManagers, and information to analyze the execution time of completed programs.
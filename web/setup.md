---
title: Setup Development Environment
layout: page
permalink: /setup.html
---

Participating in the Flink training requires a working development environment. We provide a preconfigured virtual machine image and a guide to manually setup a development environment. After you have imported a Flink project into your IDE and you executed and debugged a Flink program, you are good to go.

### Use the provided virtual machine

We provide a preconfigured virtual machine as Open Virtualization image which is compatible with all common virtualization solutions including VirtualBox and VMWare. User and password for the virtual machine are `flink` and `flink`. The image contains the following software:

- Ubuntu Desktop 14.04
- OpenJDK 8
- IntelliJ IDEA Community Edition
- Apache Maven 3.x
- Git
- Firefox
- Apache Flink 0.9-SNAPSHOT build
- Apache Flink 0.9-SNAPSHOT source code

The following projects are imported into IntelliJ:

- Flink Java Quickstart
- Flink Scala Quickstart
- Flink (the full system)

A `Readme` file is located at the Desktop for additional information.

### OR manually setup your development environment

Flink supports Linux, OS X, and Windows as development environments for Flink programs and local execution. For a Flink development environment you need to install the following software:

- Java JDK 7 (or 8)
- Apache Maven 3.x
- Git
- a browser
- an IDE for Java (and/or Scala) development (follow these [instructions](http://ci.apache.org/projects/flink/flink-docs-master/internals/ide_setup.html) to set up IntelliJ IDEA or Eclipse)

#### Generate a Flink project and import it into your IDE

Flink provides Maven archetypes to correctly setup Maven projects for Java or Scala Flink programs. See the following guides to setup a Maven project for a [Java](http://ci.apache.org/projects/flink/flink-docs-master/quickstart/java_api_quickstart.html) or [Scala](http://ci.apache.org/projects/flink/flink-docs-master/quickstart/scala_api_quickstart.html) Flink program.

The generated Maven project needs to be imported into your IDE:

- IntelliJ: 
  1. Select *"File"* -> *"Import Project"*
  1. Select root folder of your project
  1. Select *"Import project from external model"*, select *"Maven"* 
  1. Leave default options and finish the import
- Eclipse: 
  1. Select *"File"* -> *"Import"* -> *"Maven"* -> *"Existing Maven Project"*
  1. Follow the import instructions

#### Install Flink for local execution

To install Flink on your machine, download a [Flink build](http://stratosphere-bin.s3-website-us-east-1.amazonaws.com/flink-0.9-SNAPSHOT-bin-hadoop2.tgz) and extract the archive file. The resulting folder contains a Flink setup that can be locally executed without any further configuration.

### Execute and debug a Flink program in an IDE

Flink programs can be executed and debugged from within an IDE. This significantly eases the development process and gives a programming experience similar to working on a regular Java application. Starting a Flink program in your IDE is as easy as starting its `main()` method. Under the hood, the `ExecutionEnvironment` will start a local Flink instance within the execution process. Hence it is also possible to put brakepoints everywhere in your code and debug it.

Assuming you have an IDE with a Flink quickstart project imported, you can execute and debug the example WordCount program which is included in the quickstart project as follows:

- Open the `WordCount` class in your IDE
- Place a break point somewhere in the `flatMap()` method of the `LineSplitter` class which is inlined inside the `WordCount` class.
- Execute or debug the `main()` method of the `WordCount` class using your IDE.

### Start a local Flink instance

Given that you have a local Flink installation, you can start a Flink instance that runs a master and a worker process on your local machine in a single JVM. This execution mode is useful for local testing. 

#### Start local Flink instance

On UNIX system you can start a Flink instance as follows:

~~~bash
> cd /to/your/flink/installation
> ./bin/start-local.sh
~~~

On Windows you have to run the following commands

~~~bash
> cd C:\to\your\flink\installation
> .\bin\start-local.bat
~~~

#### Validate that Flink is running

You can validate that a local Flink instance is running by looking at the log files in `./log/` or opening the JobManager's webinterface at [http://localhost:8081](http://localhost:8081). 

#### Stop local Flink instance

On UNIX you call 

~~~bash
> ./bin/stop-local.sh
~~~

On Windows you quit the running process with `Ctrl-C`.
---
title: Setup Development Environment
layout: page
permalink: /setup.html
---

Participating in the Flink training requires a working development environment. We provide a preconfigured virtual machine image and a guide to manually setup a development environment. Once you have imported a Flink project into your IDE and you learned how to execute and debug a Flink program in an IDE, you're good to go.

### Use the provided virtual machine

We provide a preconfigured virtual machine as Open Virtualization image which is compatible with VirtualBox and VMWare among others. User and password for the virtual machine are `flink` and `flink`. The image contains the following software:

- Ubuntu Desktop 14.04
- OpenJDK 8
- IntelliJ IDEA Community Edition
- Apache Maven 3.x
- Git
- Firefox
- Apache Flink 0.9-SNAPSHOT (binary & source code)

The following projects are pre-imported into IntelliJ:

- Flink Java Quickstart
- Flink Scala Quickstart
- Flink (the full system)

A `Readme` file is located on the Desktop for additional information.

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

#### Install a local Flink instance

The training also shows how to package a Flink program and submit it for execution to a running Flink system. This requires a local Flink installation. Download a [Flink build](http://stratosphere-bin.s3-website-us-east-1.amazonaws.com/flink-0.9-SNAPSHOT-bin-hadoop2.tgz) and extract the archive file. The resulting folder contains a Flink setup that can be locally executed without further configuration. See the [local execution]({{ site.baseurl }}/localExec.html) guide for details how to start and stop a local Flink system and submit job.

### Execute and debug a Flink program in an IDE

Flink programs can be executed and debugged from within an IDE. This significantly eases the development process and gives a programming experience similar to working on a regular Java application. Starting a Flink program in your IDE is as easy as starting its `main()` method. Under the hood, the `ExecutionEnvironment` will start a local Flink instance within the execution process. Hence it is also possible to put brakepoints everywhere in your code and debug it.

Assuming that you have setup your IDE and imported a Maven project that was created using the Flink quickstart Maven archetype, you can execute and debug the provided example WordCount program as follows:

- Open the `WordCount` class in your IDE
- Place a break point somewhere in the `flatMap()` method of the `LineSplitter` class which is inlined inside the `WordCount` class.
- Execute or debug the `main()` method of the `WordCount` class using your IDE.


---
title: Setup Dev Environment
layout: page
permalink: /setup.html
---

Participating in the Flink training requires a working development environment. We provide a preconfigured virtual machine image and a guide to manually setup a development environment. We also show how to execute and debug a Flink program in an IDE.

### Set up a development environment

#### Using the provided virtual machine

We provide a preconfigured virtual machine as Open Virtualization image which is compatible with VirtualBox and VMWare among others. The image is setup with the following software:

- Ubuntu Desktop 14.04
- OpenJDK 8
- IntelliJ IDEA Community Edition
- Apache Maven 3.x
- Git
- Firefox
- Apache Flink 0.9-SNAPSHOT (binary & source code)

The following projects are pre-imported into IntelliJ:

- Flink
- Flink Java Quickstart
- Flink Scala Quickstart

User and password for the virtual machine are `flink` and `flink`. A `Readme` file is located on the Desktop.

#### Manual setup

Flink supports Linux, OS X, and Windows as development environments for Flink programs and local execution. A Flink development environment requires the following software to be installed:

- Java 7 (or 8)
- Apache Maven 3.x
- an IDE for Java (or Scala) development. Most Flink committers use IntelliJ but Eclipse should also work for implementing Flink programs.
- Git
- a browser

**IDE Setup**

Follow these [instructions](http://ci.apache.org/projects/flink/flink-docs-master/internals/ide_setup.html) to setup either IntelliJ IDEA or Eclipse as IDE.

**Setup a Flink project**

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

**Download and install Flink**

Download a [Flink build](http://stratosphere-bin.s3-website-us-east-1.amazonaws.com/flink-0.9-SNAPSHOT-bin-hadoop2.tgz) and extract it.

### Developing, executing, and debugging in an IDE

#### How to execute a Flink program from an IDE?

- IntelliJ
- Eclipse

#### How to debug a Flink program locally?

- IntelliJ
- Eclipse
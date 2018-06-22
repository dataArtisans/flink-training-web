---
title: Development Environment Setup
layout: page
permalink: /devEnvSetup.html
---

The following instructions guide you through the process of setting up a development environment for the purpose of developing, debugging, and executing solutions to the training exercises and examples on this site. You will also install a simple Flink cluster to locally execute Flink programs on your machine.

### 1. Software requirements

Flink supports Linux, OS X, and Windows as development environments for Flink programs and local execution. The following software is required for a Flink development setup and should be installed on your system:

- Java JDK 8 (a JRE is not sufficient!)
- Apache Maven 3.x
- Git
- an IDE for Java (and/or Scala) development. We recommend IntelliJ, but Eclipse will work so long as you stick to Java. For Scala you will need to use IntelliJ (and its Scala plugin).

Note that older and newer versions of Java are not supported. Only Java 8 will do; not Java 7, or 9 (or 10).

<div class="alert alert-info">
<p>
<strong>Note for Windows users:</strong>
In previous trainings we've had the best experiences with UNIX-based setups, and most commands provided in the training instructions are for UNIX systems.
If your main operating system is Windows and you would like everything to work flawlessly, you might find it worth the effort to setup a virtual machine running Linux.
</p>

<p>
On the other hand, we've also had success with doing the training directly on Windows.
Note, however, that some of the installation steps require administrator privileges.
And we recommend you setup Cygwin so that you can take advantage of the bash scripts that come with Flink.
</p>
</div>

### 2. Clone and build the flink-training-exercises project

The `flink-training-exercises` project contains exercises, tests, and reference solutions for the programming exercises, as well as an extensive collection of examples. Clone the `flink-training-exercises` project from Github and build it.

~~~bash
git clone https://github.com/dataArtisans/flink-training-exercises.git
cd flink-training-exercises
mvn clean package
~~~

If all of the tests pass, you are in good shape.

### 3. Import the flink-training-exercises project into your IDE

The  project needs to be imported into your IDE.

- IntelliJ:
  1. Select *"File"* -> *"New"* -> *"Project from Existing Sources..."*
  1. Select the `pom.xml` file
  1. Accept the defaults in the first *Import Project from Maven* dialog
  1. Continue, making sure when you get to the SDK dialog that it has a valid path to a JDK and **leaving all other options to their default values**, finish the project import
- Eclipse:
  1. Select *"File"* -> *"Import"* -> *"Maven"* -> *"Existing Maven Project"*
  1. Tick the **Add project(s) to working set** option
  1. Right click on the project in the Explorer, and under *"Maven" / "Select Maven Profiles..."* select the `add-dependencies-for-IDEA` profile, and **Force Update**

### 4. Install Flink for local execution

In order to execute programs on a running Flink instance (rather than from within your IDE), you need to install Flink on your machine. To do so, follow these steps:

- Download the Apache Flink 1.5.0 release from the [download page](http://flink.apache.org/downloads.html). Since we won't use HDFS or YARN, any Hadoop version will work, including the "without bundled hadoop" version.
- Extract the downloaded archive
- The resulting folder contains a Flink setup that can be locally executed without any further configuration.

### 5. Start a local Flink instance

If you have a local Flink installation, you can easily bring up a small cluster for local testing.

On UNIX system you can start a Flink instance as follows:

~~~bash
cd /to/your/flink/installation
./bin/start-cluster.sh
~~~

On Windows you have to run the following commands

~~~bash
cd C:\to\your\flink\installation
.\bin\start-cluster.bat
~~~

#### Validate that Flink is running

You can validate that a local Flink instance is running by looking at the log files in `./log/` or opening the JobManager's webinterface at [http://localhost:8081](http://localhost:8081).

#### Stop local Flink instance

On UNIX you call

~~~bash
./bin/stop-cluster.sh
~~~

On Windows you quit the running process with `Ctrl-C`.

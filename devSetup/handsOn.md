---
title: 2. Setup Development Environment - Hands-on
layout: page
permalink: /devSetup/handsOn.html
---

In this hands-on session you will setup an environment to locally develop, debug, and execute Flink programs. Furthermore, you will install a Flink instance to locally execute Flink programs on your machine.

### 1. Software requirements

Flink supports Linux, OS X, and Windows as development environments for Flink programs and local execution. The following software is required for a Flink development setup and should be installed on your system.

- Java JDK 7 (or 8)
- Apache Maven 3.x
- Git
- an IDE for Java (and/or Scala) development (follow these [instructions](http://ci.apache.org/projects/flink/flink-docs-release-1.0/internals/ide_setup.html) to set up IntelliJ IDEA or Eclipse)

### 2. Generate a Flink Maven project

Flink provides Maven archetypes to correctly setup Maven projects for Java or Scala Flink programs. We need to add an additional dependency to these Maven projects which contains utility classes that are required for the programming exercises of the training. 

Follow the next steps to set up a Flink Maven quickstart project which can be used for the programming exercises.

#### Generate a Flink Maven Quickstart project

Run one of following commands to generated a Flink Java or Scala project.

**Flink Java Project**

~~~bash
mvn archetype:generate                             \
    -DarchetypeGroupId=org.apache.flink            \
    -DarchetypeArtifactId=flink-quickstart-java    \
    -DarchetypeVersion=1.0.0                       \
    -DgroupId=org.apache.flink.quickstart          \
    -DartifactId=flink-java-project                \
    -Dversion=0.1                                  \
    -Dpackage=org.apache.flink.quickstart          \
    -DinteractiveMode=false
~~~

**Flink Scala project**

~~~bash
mvn archetype:generate                             \
    -DarchetypeGroupId=org.apache.flink            \
    -DarchetypeArtifactId=flink-quickstart-scala   \
    -DarchetypeVersion=1.0.0                       \
    -DgroupId=org.apache.flink.quickstart          \
    -DartifactId=flink-scala-project               \
    -Dversion=0.1                                  \
    -Dpackage=org.apache.flink.quickstart          \
    -DinteractiveMode=false
~~~

The generated Flink quickstart project is located in a folder called `flink-java-project` (`flink-scala-project` for Scala projects).

#### Clone and build the flink-training-exercises project 

The `flink-training-exercises` project contains utility classes and reference solutions for the programming exercises. Clone the `flink-training-exercises` project from Github and build it.

~~~bash
git clone https://github.com/dataArtisans/flink-training-exercises.git
cd flink-training-exercises
mvn clean install
~~~

#### Add the flink-training-exercises dependency to your pom.xml

Open the `pom.xml` file in your Maven project (`./flink-java-project/pom.xml` or `flink-scala-project/pom.xml`) with a text editor and add the following dependency.

~~~xml
<dependency>
  <groupId>com.dataartisans</groupId>
  <artifactId>flink-training-exercises</artifactId>
  <version>0.3</version>
</dependency>
~~~

#### Build your Flink quickstart project

In order to test the generated project and to download all required dependencies run the following command in the `flink-java-project` (`flink-scala-project` for Scala projects) folder.

~~~bash
mvn clean package
~~~

Maven will now start to download all required dependencies and build the Flink quickstart project.

### 3. Import the Flink Maven project into your IDE

The generated Maven project needs to be imported into your IDE:

- IntelliJ: 
  1. Select *"File"* -> *"Import Project"*
  1. Select root folder of your project
  1. Select *"Import project from external model"*, select *"Maven"* 
  1. Leave default options and finish the import
- Eclipse: 
  1. Select *"File"* -> *"Import"* -> *"Maven"* -> *"Existing Maven Project"*
  1. Follow the import instructions

### 4. Execute and debug a Flink program in an IDE

Flink programs can be executed and debugged from within an IDE. This significantly eases the development process and gives a programming experience similar to working on a regular Java application. Starting a Flink program in your IDE is as easy as starting its `main()` method. Under the hood, the `ExecutionEnvironment` will start a local Flink instance within the execution process. Hence it is also possible to put brakepoints everywhere in your code and debug it.

Assuming you have an IDE with a Flink quickstart project imported, you can execute and debug the example `WordCount` program which is included in the quickstart project as follows:

- Open the `org.apache.flink.quickstart.WordCount` class in your IDE
- Place a break point somewhere in the `flatMap()` method of the `LineSplitter` class which is inlined defined in the `WordCount` class.
- Execute or debug the `main()` method of the `WordCount` class using your IDE.

### 5. Install Flink for local execution

In order to execute program on a running Flink instance (and not from within your IDE) you need to install Flink on your machine. To do so, follow these steps:

- Download the Apache Flink 1.0.0 release from the [download page](http://flink.apache.org/downloads.html)
- Extract the downloaded `.tgz` archive
- The resulting folder contains a Flink setup that can be locally executed without any further configuration.

### 6. Start a local Flink instance

If you have a local Flink installation, you can start a Flink instance that runs a master and a worker process on your local machine in a single JVM. This execution mode is useful for local testing. 

#### Start local Flink instance

On UNIX system you can start a Flink instance as follows:

~~~bash
cd /to/your/flink/installation
./bin/start-local.sh
~~~

On Windows you have to run the following commands

~~~bash
cd C:\to\your\flink\installation
.\bin\start-local.bat
~~~

#### Validate that Flink is running

You can validate that a local Flink instance is running by looking at the log files in `./log/` or opening the JobManager's webinterface at [http://localhost:8081](http://localhost:8081). 

#### Stop local Flink instance

On UNIX you call 

~~~bash
./bin/stop-local.sh
~~~

On Windows you quit the running process with `Ctrl-C`.

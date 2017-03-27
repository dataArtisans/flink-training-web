---
title: Setup Development Environment
layout: page
permalink: /devEnvSetup.html
---

The following instructions guide you through the process of setting up an environment to locally develop, debug, and execute Flink programs. Furthermore, you will install a Flink instance to locally execute Flink programs on your machine.

### 1. Software requirements

Flink supports Linux, OS X, and Windows as development environments for Flink programs and local execution. The following software is required for a Flink development setup and should be installed on your system.

- Java JDK 7 (or higher), a JRE is not sufficient!
- Apache Maven 3.x
- Git
- an IDE for Java (and/or Scala) development. 
  Follow these [instructions](http://ci.apache.org/projects/flink/flink-docs-release-1.2/internals/ide_setup.html) to set up IntelliJ IDEA (preferred) or Eclipse.

<div class="alert alert-info">
<p>
<strong>Note for Windows users:</strong>
In previous trainings we've had the best experiences with UNIX-based setups, and most commands provided in the training instructions are for UNIX systems.
If your main operating system is Windows and you would like everything to work flawlessly, we recommend you setup a virtual machine running Linux.
</p>

<p>
On the other hand, we've also had success doing training with Windows.
But we do recommend you setup Cygwin so that you can take advantage of the bash scripts that come with Flink.
</p>

<p>
We also use Kafka and Elasticsearch for parts of the training. These can be installed and run using Windows, but you may
need to make some adjustments to the instructions we provide.
</p>
</div>

### 2. Generate a Flink Maven project

Flink provides Maven archetypes to correctly setup Maven projects for Java or Scala Flink programs. We need to add an additional dependency to these Maven projects which contains utility classes that are required for the programming exercises of the training. 

Follow the next steps to set up a Flink Maven Quickstart project which can be used for the programming exercises.

#### Generate a Flink Maven Quickstart project

Run one of following commands to generated a Flink Java or Scala project.

**Flink Java Project**

~~~bash
mvn archetype:generate                             \
    -DarchetypeGroupId=org.apache.flink            \
    -DarchetypeArtifactId=flink-quickstart-java    \
    -DarchetypeVersion=1.2.0                       \
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
    -DarchetypeVersion=1.2.0                       \
    -DgroupId=org.apache.flink.quickstart          \
    -DartifactId=flink-scala-project               \
    -Dversion=0.1                                  \
    -Dpackage=org.apache.flink.quickstart          \
    -DinteractiveMode=false
~~~

**Note**: Windows users need to remove the backslashes from the Maven commands.

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
  <groupId>com.data-artisans</groupId>
  <artifactId>flink-training-exercises</artifactId>
  <version>0.8.1</version>
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
  1. Continue, make sure the SDK dialog has a valid path to a JDK, leave the other default options, and finish the import
- Eclipse: 
  1. Select *"File"* -> *"Import"* -> *"Maven"* -> *"Existing Maven Project"*
  1. Follow the import instructions

### 4. Execute and debug a Flink program in an IDE

Flink programs can be executed and debugged from within an IDE. This significantly eases the development process and gives a programming experience similar to working on a regular Java application. Starting a Flink program in your IDE is as easy as starting its `main()` method. Under the hood, the `ExecutionEnvironment` will start a local Flink instance within the execution process. Hence it is also possible to put breakpoints everywhere in your code and debug it.

Assuming you have an IDE with a Flink quickstart project imported, you can execute and debug the example `WordCount` program which is included in the quickstart project as follows:

- Open the `org.apache.flink.quickstart.WordCount` class in your IDE
- Place a breakpoint somewhere in the `flatMap()` method of the `LineSplitter` class which is defined in the `WordCount` class.
- Execute or debug the `main()` method of the `WordCount` class using your IDE.

### 5. Install Flink for local execution

In order to execute programs on a running Flink instance (rather than from within your IDE) you need to install Flink on your machine. To do so, follow these steps:

- Download the Apache Flink 1.2.0 release from the [download page](http://flink.apache.org/downloads.html). Since we won't use HDFS or YARN, any Hadoop version will work.
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

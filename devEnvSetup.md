---
title: Setup your Development Environment
layout: page
permalink: /devEnvSetup.html
nav-title: Setup your Dev Env
nav-parent_id: setup
nav-pos: 10
---

The following instructions guide you through the process of setting up a development environment for the purpose of developing, debugging, and executing solutions to the training exercises and examples on this site.

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
Many of the examples of shell commands provided in the training instructions are for UNIX systems.
To make things easier, you may find it worthwhile to setup cygwin or WSL, but you can use the provided .bat scripts with plain cmd.
For developing Flink jobs, Windows works reasonably well: you can run a Flink cluster on a single machine, submit jobs, run the webUI, and execute jobs in the IDE.
</p>
</div>

### 2. Clone and build the flink-training-exercises project

The `flink-training-exercises` project contains exercises, tests, and reference solutions for the programming exercises, as well as an extensive collection of examples. Clone the `flink-training-exercises` project from Github and build it.

~~~bash
git clone https://github.com/dataArtisans/flink-training-exercises.git
cd flink-training-exercises
mvn clean package
~~~

If you haven't done this before, at this point you'll end up downloading all of the dependencies for this Flink training exercises project. This usually takes a few minutes, depending on the speed of your internet connection.

If all of the tests pass and the build is successful, you are off to a good start.

### 3. Import the flink-training-exercises project into your IDE

The project needs to be imported into your IDE.

- IntelliJ:
  1. Because this project mixes Java and Scala code, you will need to **install the Scala plugin**, if you don't already have it:
    * Go to IntelliJ plugins settings (IntelliJ IDEA -> Preferences -> Plugins) and click on “Install Jetbrains plugin…”.
    * Select and install the “Scala” plugin.
    * Restart IntelliJ
  1. Import the project, selecting its `pom.xml` file
  1. At each step, accept the defaults; do not select a profile
  1. Continue, making sure when you get to the SDK dialog that it has a valid path to a JDK and **leaving all other options to their default values**, finish the project import
  1. Open the project structure dialog, and add a Scala 2.11 SDK in the Global Libraries section (**you'll need this even if you do not intend to use Scala**)
- Eclipse:
  1. Select *"File"* -> *"Import"* -> *"Maven"* -> *"Existing Maven Project"*
  1. Tick the **Add project(s) to working set** option
  1. You can safely ignore the scala-maven-plugin errors

You should now be able to open com.dataartisans.flinktraining.exercises.datastream_java.basics.RideCleansingTest and successfully run this test.

### 4. Download the data sets

You can download the taxi data files used in this training by running the following commands

~~~~
wget http://training.data-artisans.com/trainingData/nycTaxiRides.gz
wget http://training.data-artisans.com/trainingData/nycTaxiFares.gz
~~~~

It doesn't matter if you use wget or something else to fetch these files, but however you get the data, **do not decompress or rename the `.gz` files**.

To learn more about this data, see [Using the Taxi Data Streams]({{site.baseurl}}/setup/taxiData.html).

Note: There's a hardwired path to these data files in the exercises. Before trying to execute them, read [How to do the Labs]({{site.baseurl}}/setup/howto-exercises.html).

<hr style="margin: 0 0 10px 0" />

If you want to also setup a local cluster for executing Flink jobs outside the IDE, see [Setting up a Local Flink Cluster]({{site.baseurl}}/setup/localCluster.html).

If you want to use the SQL client, see [Setting up the SQL Client]({{site.baseurl}}/sqlClient.html).

{% next %}


---
title: Setting up a Local Flink Cluster
layout: page
permalink: /setup/localCluster.html
---

The following instructions guide you through the installation a simple Flink cluster to locally execute Flink programs on your machine.

### 1. Download and install Flink for local execution

In order to execute programs on a running Flink instance (rather than from within your IDE), you need to install Flink on your machine. To do so, follow these steps:

- Download the Apache Flink 1.7.1 release from the [download page](http://flink.apache.org/downloads.html). Since we won't use HDFS or YARN, any Hadoop version will work, including the "without bundled hadoop" version.
- Extract the downloaded archive
- The resulting folder contains a Flink setup that can be locally executed without any further configuration.

### 2. Start a local Flink instance

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

### 3. Validate that Flink is running

You can validate that a local Flink instance is running by looking at the log files in `./log/` or opening the JobManager's webinterface at [http://localhost:8081](http://localhost:8081).

### 4. Run an application

Go to wherever you have put the flink-training-exercises project, and use maven to build it:

~~~bash
mvn clean package
~~~

You can use the Flink CLI to run applications that have been packaged into a jar file. Here's an example of running one of the examples, but you'll probably need to make some adjustments to the paths and version number:

~~~bash
./bin/flink run -c \  
    com.dataartisans.flinktraining.examples.datastream_java.basics.RideCount \
    ~/flink-training-exercises/target/flink-training-exercises-2.5.2.jar
~~~

Because this jar file contains many applications, we've had to specify which class to run, using the -c flag.

Note that the taskmanager(s) will write their output to files in the `./log/` directory.

### 5. Stop the local Flink instance

On UNIX you call

~~~bash
./bin/stop-cluster.sh
~~~

On Windows you quit the running process with `Ctrl-C`.

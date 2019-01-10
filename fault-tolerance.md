---
title: Testing Fault Tolerance
layout: page
permalink: /fault-tolerance.html
---

A couple of these hands-on sessions are about implementing and testing fault-tolerant, stateful DataStream programs.
Here we describe, step-by-step, how to test that a stateful program successfully recovers from a simulated worker failure.

### 1. Implement a stateful program

Any of the exercises involving managed state will serve the purpose. [Expiring State]({{ site.baseurl }}/exercises/richEnrichment-processfunction.html) and [Long Ride Alerts]({{ site.baseurl }}/exercises/longRides.html) are good choices if you want help implementing a program with a stateful operator.

### 2. Use sources that checkpoint their state

The `TaxiRideSource` and `TaxiFareSource` classes do not checkpoint their state, so don't use them when experimenting with fault tolerance.

### 3. Enable checkpointing

[Fault Recovery in Action]({{ site.baseurl }}) shows how to do this in detail.

### 4. Start a local Flink cluster

In order to demonstrate a worker failure, we have to execute the program on a local Flink cluster, not from the IDE.  [Setting up a Local Flink Cluster]({{site.baseurl}}/devEnvSetup.html) explains one way to start a local cluster.

Another approach, after downloading and installing the Flink binaries, is to start a jobmanager and one or more taskmanagers, as follows:

~~~bash
./bin/jobmanager.sh start cluster
./bin/taskmanager.sh start
~~~

You can check that the local Flink cluster is running via the web dashboard at [http://localhost:8081](http://localhost:8081). You should see one available TaskManager with one task slot (or more, if you started more).

### 5. Compile and start your application

The [How to do the Exercises page]({{ site.baseurl }}/howto-exercises.html) explains how to build and package a Flink program with Maven.

Your Flink application writes its results to the standard out of the TaskManager process on which it is running, which is redirected into a file. The file is located in the `./log` directory and follows the naming pattern `flink-<user>-taskmanager-<number>-<host>.out`. Run the following command to continuously display the tail of the file.

~~~bash
tail -F flink-bob-taskmanager-0-localhost.out
~~~~

Since we have not started the job yet, the out file does not receive any data.

You can use the Flink CLI to run applications that have been packaged into a jar file. Here's an example of running one of these exercises, but you'll probably need to make some adjustments to the paths and version number:

~~~bash
flink run -c \  
    com.dataartisans.flinktraining.solutions.datastream_java.process.CheckpointedLongRidesSolution \
    ~/flink-training-exercises/target/flink-training-exercises-2.5.2.jar
~~~

After you have started the job, you will see what output it is writing. By looking at its output, you should be able to distinguish whether the application was started from the very beginning of its input stream, or restarted from some later point in time (via a checkpoint or savepoint).

You can also see the running job in the [Flink web dashboard](http://localhost:8081).

### 6. Stop a taskManager (and start a new one)

Your application is now running in a single worker process (TaskManager) and producing output. Let us see what happens if we kill the worker process by calling

~~~bash
./bin/taskmanager.sh stop
~~~

in your Flink directory.

You will notice that the output file is no longer receiving data. If you go to the web dashboard, you will also see that the connected TaskManager disappeared and the job's status switched to restarting (you may have to wait a while for the heartbeat messages to timeout). The job is now going through the configured restart policy. In a production setup, either a standby TaskManager would pick-up the work or a resource manager like YARN or Mesos would start a new TaskManager to continue processing. In our local setup, we are responsible to bring up a new TaskManager process.

Before we start a new TaskManager, let us discuss what to expect when a new TaskManager continues to process the program.

1. The operator state should not be lost, whether that's the record of ongoing taxi rides from the [Long Ride Alerts exercise]({{ site.baseurl }}/exercises/longRides.html) or the regression models from the [Travel Time Prediction exercise]({{site.baseurl}}/exercises/timePrediction.html).

2. The data source should continue from the last checkpoint before the TaskManager was killed. Hence, we want to see that the ride ids do not start from the beginning.

Now let's bring up a new worker process and resume processing by calling

~~~bash
./bin/taskmanager.sh start
~~~

After a short time you will notice that the job continues to write output. (Note, however, that the output file will rollover; flink-david-taskmanager-0-singularity.local.out becomes flink-david-taskmanager-0-singularity.local.out.1, for example.) Looking at the data, we should see that the data source continued from the last checkpoint before the failure, rather than starting over.

The [Flink web dashboard](http://localhost:8081) will also show that a new TaskManager connected and that the status of our job switched to running.

### 7. Disable checkpointing

We have seen how a program that checkpoints its operator state recovers from a worker failure. In case you want to find out what happens if the program does not checkpoint its state you can simply remove the `env.enableCheckpointing()` line from your program and recompile. (With the filesystem state backend it's also possible to simply delete the checkpoint directory.)

When the program resumes processing after the new TaskManager process has been started, you will notice that

* The data source started processing from the beginning.
* Operator state has been lost.

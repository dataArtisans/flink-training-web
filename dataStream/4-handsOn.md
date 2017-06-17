---
title: DataStream API Stateful Operators - Hands-On
layout: page
permalink: /dataStream/4-handsOn.html
---

In this hands-on session, we will implement a fault-tolerant DataStream program that includes a stateful operator. In addition, the session includes a step-by-step guide to demonstrate how a stateful program successfully recovers from a simulated worker failure. 

### Implement a stateful program to predict travel time

The [Travel Time Prediction exercise]( {{site.baseurl}}/exercises/timePrediction.html) will guide you to implement a program with a stateful operator. The instructions include a detailed task description, implementation hints, and links to reference solutions.

### Failure recovery in action!

The following steps are optional, but well worthwhile. We will demonstrate the recovery of a Flink streaming application that experiences a worker failure.

#### 1. Start a local Flink cluster

In order to demonstrate a worker failure, we have to execute the program on a local Flink cluster, not from the IDE. The [setup instructions]({{site.baseurl}}/devEnvSetup.html) show how to setup Flink locally. Instead of starting a local Flink instance via `./bin/start-local.sh` we need to start a local cluster by running `./bin/start-cluster.sh`. In contrast to a local instance, a local cluster starts two separate processes for master (JobManager) and worker (TaskManager). You can check that the local Flink cluster via the web dashboard on [http://localhost:8081](http://localhost:8081). You should see one available TaskManager with one task slot.

#### 2. Compile and start program

The [basics hands-on session]({{site.baseurl}}/dataStream/1-handsOn.html) explains how to build and package a Flink program with Maven. 

Your Travel Time Prediction program writes its results to the standard out of the TaskManager process which is redirected into a file. The file is located in the `./log` directory and follows the naming pattern `flink-<user>-taskmanager-<number>-<host>.out`. Run the following command to continuously display the tail of the file.

~~~bash
tail -F flink-bob-taskmanager-0-localhost.out 
~~~~

Since we have not started the job yet, the out file does not receive any data. 

The [basics hands-on session]({{site.baseurl}}/dataStream/1-handsOn.html) explains how to execute a packaged program on a running Flink instance using the CLI client. After you have started the job, you will see how it writes its output to the file. In the beginning, you should see a lot of invalid predictions (`-1`). However, after some time, the continuously refined regression models produce more and more valid predictions.

You can also see the running job in the [Flink web dashboard](http://localhost:8081). 

#### 3. Stop a TaskManager (and start a new one)

Our application is running on a single worker process (TaskManager) and producing output. Let us see what happens if we kill the worker process by calling

~~~bash
./bin/taskmanager.sh stop
~~~

in your Flink directory.

You will immediately notice that the output file is no longer receiving data. If you go to the web dashboard, you will also see that the connected TaskManager disappeared and the job's status switched to restarting. The job is now going through the configured restart policy. In a production setup, either a standby TaskManager would pick-up the work or a resource manager like YARN or Mesos would start a new TaskManager to continue processing. In our local setup, we are responsible to bring up a new TaskManager process.

Before we start a new TaskManager, let us discuss what to expect when a new TaskManager continues to process the program. 

1. Our regression models, i.e., the operator state, should not be lost. So we do not want to see lots of invalid predictions after the job continues.

2. The data source should continue from the last checkpoint before the TaskManager was killed. Hence, we want to see that the ride ids do not start from the beginning.

Now let's bring up a new worker process and continue processing by calling

~~~bash
./bin/taskmanager.sh start
~~~

After a short time you will notice that the job continues to write output to the log file. Looking at the data, we should see that not more invalid predictions are generated and that the data source continued from the last checkpoint before the failure.

The [Flink web dashboard](http://localhost:8081) will also show that a new TaskManager connected and that the status of our job switched to running.

#### 4. Disabling Checkpointing

We have seen how a program that checkpoints its operator state recovers from a worker failure. In case you want to find out what happens if the program does not checkpoint its state you can simply remove the `env.enableCheckpointing()` line from your program and continue from "2. Compile and start program".

When the program resumes processing after the new TaskManager process has been started, you will notice that 

* The operator state was lost (all predictions start again with -1 and will improve over time). 
* The data source started processing from the beginning (ride ids are reset).

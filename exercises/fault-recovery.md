---
layout: page
title: Fault Recovery in Action
permalink: /exercises/fault-recovery.html
---

In this exercise we want to modify the Flink application we wrote for the [Long Ride Alerts exercise]() just a bit so that it can take advantage of Flink's checkpointing features, and then test that it is indeed fault tolerant.

### Environment configuration

Stateful and fault-tolerant streaming applications require a couple of settings on the `StreamExecutionEnvironment`.

Configure Flink to perform a consistent checkpoint of a program's operator state every 1000ms.

~~~java
StreamExecutionEnvironment env = ...
env.enableCheckpointing(1000);
~~~~

Configure Flink to try to restart the job 60 times with a 10 second delay. If the job cannot be restarted within 60 attempts, it fails.

~~~java
StreamExecutionEnvironment env = ...
env.setRestartStrategy(
  RestartStrategies.fixedDelayRestart(
    60,                            // 60 retries
    Time.of(10, TimeUnit.SECONDS)  // 10 secs delay
  ));
~~~~

Note that by default, Flink's checkpoints are written to the JobManager's heap. This is usually fine for development and testing, so long as your application doesn't have large amounts of state. But it is easy to setup the filesystem state backend, if you want; see [Setting the Per-job State Backend]({{ site.docs }}/ops/state_backends.html#setting-the-per-job-state-backend).

### Testing Fault Tolerance

[Testing Fault Tolerance]({{ site.baseurl }}/fault-tolerance.html) describes the overall approach you can take to verify if your application is actually fault tolerant. In general, this depends on your being able to tell the difference between having your application start over from the beginning, vs having it resume correctly from an intermediate point.

### Reference Solution

Reference solutions are available on GitHub:

- Java API: [LongRides.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/process/LongRides.java)
- Scala API: [LongRides.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataartisans/flinktraining/exercises/datastream_scala/process/LongRides.scala)

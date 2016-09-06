---
title: DataStream API Stateful Operators - Hands-On
layout: page
permalink: /dataStream/4-handsOn.html
---

In this hands-on session, we will implement a DataStream program that includes a stateful operator. In addition, the session includes a step-by-step guide to demonstrate how a stateful program successfully recovers from a simulated worker failure. 

### Implement a stateful travel time prediction program

The [Travel Time Prediction exercise]( {{site.baseurl}}/exercises/timePrediction.html) will teach you how to implement a program that includes a stateful operator. The instructions include a detailed task description, implementation hints, and links to reference solutions.

### Demonstrating failure recovery

The following steps are optional but an insightful exercise. We will demonstrate the recovery of a Flink streaming application that experiences a worker failure. Most of the preparation steps have been described in the previous hands-on sessions.

#### 1. Start a local Flink cluster

In order to demonstrate a worker failure, we must execute the program on a local Flink cluster and not from the IDE. The [setup instructions]({{site.baseurl}}/devEnvSetup.html) show how to setup Flink. Note, instead of starting a local instance via `./bin/start-local.sh` we need to start a local cluster by running `./bin/start-cluster.sh`. In contrast to a local instance, a local cluster starts two separate processes for master (JobManager) and worker (TaskManager). Make sure to stop a running local Flink instance by calling `./bin/stop-local.sh` before starting a local cluster.
You can check that the local Flink cluster is running by opening the web dashboard on [http://localhost:8081](http://localhost:8081). You will see that one Task Manager with one Task Slot is available.

#### 2. Add Elasticsearch sink

Next, we append an Elasticsearch sink to the Travel Time Prediction program. Writing data to Elasticsearch allows us to visualize the data with Kibana. The [Connectors hands-on session]({{site.baseurl}}/dataStream/3-handson.html) shows how to setup a local Elasticsearch instance. Note, you need a new index and a different index mapping for this task.

* Create an index called `nyc-rides`.

~~~bash
curl -XPUT "http://localhost:9200/nyc-rides"
~~~

* Create an index mapping called `ride-predictions`.

~~~bash
curl -XPUT "http://localhost:9200/nyc-rides/_mapping/ride-predictions" -d'
     {
      "ride-predictions" : {
        "properties" : {
           "rideId": {"type": "long"},
           "departureTime": {"type": "date"},
           "departure": {"type": "geo_point"},
           "destination": {"type": "geo_point"},
           "predTime": {"type": "integer"}
         }
      } 
     }'
~~~

The following [exercise instructions]({{site.baseurl}}/exercises/toElastic.html) show how to add an Elasticsearch sink. Note that you need to adapt the `ElasticsearchSinkFunction` to the schema of the `ride-predictions` mapping.

In addition to Elasticsearch we need Kibana for our demo. The [Connectors hands-on session]({{site.baseurl}}/dataStream/3-handsOn.html) explains how to setup and configure Kibana.

#### 3. Disabling Checkpointing

For demonstration purposes, we first show what happens if Flink's checkpointing mechanism is deactivated. For that you should remove the `StreamExecutionEnvironment.enableCheckpointing()` call from your program.

#### 4. Compile and start program

The [basics hands-on session]({{site.baseurl}}/dataStream/1-handsOn.html) explains how to build and package a Flink program with Maven and how to execute it on a running Flink instance. You will see the running job in the [Flink web dashboard](http://localhost:8081). 

Once the program is running and writing data into Elasticsearch, we can start visualizing the results with Kibana. Note, the new index pattern should be `nyc-rides` and the time attribute should be `departureTime` (instead of `nyc-idx` and `time`). If you have create an index pattern before, you can configure an additional one by clicking on "Settings" on the top. The following steps guide you to create a visualization of the prediction data.

* Click on the "Visualize" button at the top. Select "vertical bar chart". Click on "From a new search" and select the `nyc-rides` index. Kibana will show a bar chart with a single bar. Next we will configure the visualization.

* Click on "x-Axis", select "Date Histogram" and click the green button with the triangle icon (play). The chart will show the number of rides by time.

* Click on "y-Axis", select "Average" and "predTime", and click again on the green button. The charts show the average predicted ride time by time. You can clearly see the training effect of the model. Since we emit -1 if the model was not trained, the average is predicted ride time is much lower in the beginning.

If you reload the Kibana page while the job is running, you will see how more data is written into Elasticsearch and more bars are appearing over time.

#### 5. Kill a TaskManager (and start a new one)

Our application is running on a single worker process (TaskManager). Let's see what happens when we kill this worker process. First we need to identify the process we'd like to kill.

~~~bash
ps -ef | grep taskmanager
~~~

Next, we kill the TaskManager process.

~~~bash
kill -9 your_taskmanager_id
~~~

If you go to the web dashboard, you will see that there are no Task Managers connected and that the job's status switched to restarting. 
When you look at the Kibana dashboard, you will notice that the chart does not change when reloading the page. Hence, no more data is arriving.

Now let's bring up a new worker process and continue processing. Go to your local Flink directory and call:

~~~bash
bin/taskmanager.sh start
~~~

The [Flink web dashboard](http://localhost:8081) will show that a new Task Manager connected and our job soon continue processing.

#### 7. Checking the programs output for consistency








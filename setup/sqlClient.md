---
title: Setting up the SQL Client
layout: page
permalink: /sqlClient.html
---

These instructions will show you how to use Flink's SQL Client with the taxi data used in these exercises.

### Prerequisties:

* If you haven't already done so, follow [these instructions]({{site.baseurl}}/devEnvSetup.html) about using git to clone, and maven with Java 8 to build, the flink-training-exercises project.

* [Part 4 of those same instructions linked to above]({{site.baseurl}}/devEnvSetup.html) explains how to download the taxi data files. Do that now, if you didn't already.

### 1. Edit sql-client-config.yaml

The home directory of the flink-training-exercises repository contains a file named `sql-client-config.yaml`. This file contains hardwired paths to the taxi ride and taxi fare datasets. Edit this file so that it correctly points to your copies of these files:

      ...
      path: "/Users/david/stuff/flink-training/trainingData/nycTaxiRides.gz"
      ...
      path: "/Users/david/stuff/flink-training/trainingData/nycTaxiFares.gz"
      ...

### 2. Start a local flink cluster

Following [these instructions]({{site.baseurl}}/setup/localCluster.html), download the Flink binaries and start a local flink cluster. Leave it running.

### 3. Start the SQL client

~~~bash
$ cd /to/your/clone/of/flink-training-exercises
$ /wherever/you/put/flink/bin/sql-client.sh embedded --jar target/flink-training-exercises-2.5.2.jar -e sql-client-config.yaml
~~~

<div class="alert alert-info">
Windows users, please note that you will need some way to run bash scripts, such as the Windows Subsystem for Linux.
</div>

### 4. Verify that it works

You can list all available tables using the `SHOW TABLES` command. It lists table sources and sinks as well as views.

    Flink SQL> SHOW TABLES;
	TaxiFares
    TaxiRides

You can get information about the schema of `TaxiRides` using the `DESCRIBE` statement.

    Flink SQL> DESCRIBE TaxiRides;
    root
     |-- rideId: Long
     |-- taxiId: Long
     |-- driverId: Long
     |-- isStart: Boolean
     |-- startLon: Float
     |-- startLat: Float
     |-- endLon: Float
     |-- endLat: Float
     |-- passengerCnt: Short
     |-- eventTime: TimeIndicatorTypeInfo(rowtime)

In order to explore the data of the `TaxiRides` table, execute a simple query:

    SELECT * FROM TaxiRides;

The CLI client will enter the result visualization mode and display the results:

    rideId                    taxiId                  driverId
        58                2013000058                2013000058
        38                2013000038                2013000038
        48                2013000048                2013000048
        24                2013000024                2013000024
        12                2013000012                2013000012

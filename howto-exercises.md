---
title: How to do the Exercises
layout: page
permalink: /howto-exercises.html
---

In the hands-on sessions you will implement Flink programs using various Flink APIs. You will also learn how to package a Flink program using Apache Maven and execute the packaged program on a running Flink instance.

The following steps guide you through the process of using the provided data streams, implementing your first Flink streaming program, and packaging and executing your program on a running Flink instance.

We assume you have setup your development environment according to our [setup guide]( {{site.baseurl }}/devEnvSetup.html).

### 1. Get the data

The initial set of exercises are all based on data streams of events about taxi rides and taxi fares. These streams are produced by source functions which reads data from input files. Please follow these [instructions]({{ site.baseurl }}/exercises/taxiData.html) to download the input files for the Taxi Data Stream sources and to learn how to use them.

### 2. Edit `ExerciseBase`

After downloading the datasets, open the `com.dataartisans.flinktraining.exercises.datastream_java.utils.ExerciseBase` class in your IDE, and edit these two lines to point to the two taxi ride data files you have downloaded:

    public final static String pathToRideData =   
        "/Users/david/stuff/flink-training/trainingData/nycTaxiRides.gz";
    public final static String pathToFareData =
        "/Users/david/stuff/flink-training/trainingData/nycTaxiFares.gz";

### 3. Run and debug Flink programs in your IDE

Flink programs can be executed and debugged from within an IDE. This significantly eases the development process and provides an experience similar to working on any other Java (or Scala) application.

Starting a Flink program in your IDE is as easy as running its `main()` method. Under the hood, the execution environment will start a local Flink instance within the same process. Hence it is also possible to put breakpoints in your code and debug it.

Assuming you have an IDE with the flink-training-exercises project imported, you can run (or debug) a simple streaming job as follows:

- Open the `com.dataartisans.flinktraining.examples.datastream_java.basics.RideCount` class in your IDE
- Run (or debug) the `main()` method of the `RideCountExample` class using your IDE.

### 4. Implement the exercises

The first exercise involves the `com.dataartisans.flinktraining.exercises.datastream_java.basics.RideCleansingExercise` class for Java, or `com.dataartisans.flinktraining.exercises.datastream_scala.basics.RideCleansingExercise` for Scala, and corresponding JUnit tests.

Like the other exercises, at some point this class throws an exception

    throw new MissingSolutionException();

Remove this line and implement the missing part(s) of the exercise. You might want to first try something clearly broken, such as

    return false;

in order to verify that the test will fail when you make a mistake, and then work on implementing a proper solution.

Now continue to [the first exercise]({{site.baseurl}}/exercises/rideCleansing.html).

---
layout: page
title: Broadcast State - Nearest Taxi
permalink: /exercises/nearestTaxi.html
---

With this exercise you will connect two streams: (1) a stream of TaxiRide events and (2) a query stream on which you can type queries. In this case a query is two comma-separated floating point numbers representing a (longitude, latitude) pair. The expected output is a stream of rides ending after the query was received, with each successive ride being closer to the requested location.

On MacOS and Linux you can start the broadcast query stream via

    nc -lk 9999

and on Windows you can install ncat from [https://nmap.org/ncat/](https://nmap.org/ncat/) and then use

    ncat -lk 9999

Some good locations:

    -74, 41                   // Near, but outside the city to the NNW
    -73.7781, 40.6413         // JFK Airport
    -73.977664, 40.761484     // The Museum of Modern Art

### Getting Started

#### Exercise Class

- Java: [com.dataartisans.flinktraining.exercises.datastream_java.broadcast.NearestTaxiExercise]({{ site.javaexercises }}/broadcast/NearestTaxiExercise.java)

#### Documentation

- [Broadcast State]({{ site.docs }}/dev/stream/state/broadcast_state.html)

### Extra Credit

The intent of this exercise is to support many ongoing queries simultaneously. In a real application it would make sense to think about how to eventually clear all of the state associated with obsolete queries.

### Reference Solutions

Reference solutions are available at GitHub:

- Java:  
    [NearestTaxiSolution.java]({{site.javasolutions}}/broadcast/NearestTaxiSolution.java)  
    [NearestTaxiWithCleanupSolution.java]({{site.javasolutions}}/broadcast/NearestTaxiWithCleanupSolution.java)

---
gated: true
layout: page
title: Reporting Ongoing Rides
permalink: /exercises/ongoingRides.html
nav-parent_id: broadcast
nav-pos: 20
---

With this exercise you will connect two streams: (1) a stream of TaxiRide events and (2) a query stream on which you can type queries (a query being an integer *n* on a line by itself). The expected output is all rides which, at the time the query is processed, started at least *n* minutes ago (in event time) and haven't yet ended.

On MacOS and Linux you can start the broadcast query stream via

    nc -lk 9999

and on Windows you can install ncat from [https://nmap.org/ncat/](https://nmap.org/ncat/) and then use

    ncat -lk 9999

### Getting Started

#### Exercise Class

- Java: [com.ververica.flinktraining.exercises.datastream_java.broadcast.OngoingRidesExercise]({{ site.javaexercises }}/broadcast/OngoingRidesExercise.java)

#### Documentation

- [Broadcast State]({{ site.docs }}/dev/stream/state/broadcast_state.html)

### Extra Credit

There's no integration test for this exercise. How might you go about testing your solution?

### Reference Solution

Reference solutions are available at GitHub:

- Java: [OngoingRidesSolution.java]({{site.javasolutions}}/broadcast/OngoingRidesSolution.java)

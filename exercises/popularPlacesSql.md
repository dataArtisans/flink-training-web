---
layout: page
title: Table API / SQL - Popular Places
permalink: /exercises/popularPlacesSql.html
---

The task of the "Popular Places" exercise is to identify popular places from the [taxi rides table]({{ site.baseurl }}/exercises/taxiRidesTable.html) using Flink's Table API or SQL. This is done by counting every five minutes the number of taxi rides that started and ended in the same area within the last 15 minutes. Arrival and departure locations should be separately counted. Only locations with more arrivals or departures than a provided popularity threshold should be forwarded to the result stream.

The `GeoUtils` class provides as set of user-defined function (UDFs):

- `GeoUtils.IsInNYC` checks if a location (longitude, latitude) is in New York City.
- `GeoUtils.ToCellId` maps a location (longitude, latitude) to a cell id that refers to an area of approximately 100x100 meters size
- `GeoUtils.ToCoords` converts a grid cell id back into a longitude/latitude pair. 

The exercise can be solved with a Table API or SQL query. Please note that the query should operate in event time.

### Input Data

The input data of this exercise is a `Table` of taxi ride events. The table is provided by the [Taxi Rides Table Source]({{ site.baseurl }}/exercises/taxiRidesTable.html). The table rows should be filtered for valid departure and arrival coordinates using the `IsInNYC` user-defined function.

### Expected Output

The result of this exercise is a `Table` with the following schema:

~~~
coords         : (Float, Float) // pair of longitude/latitude
isStart        : Boolean        // flag indicating departure or arrival count
wstart         : Timestamp      // the start time of the sliding window
wend           : Timestamp      // the end time of the sliding window
popCnt         : Long           // the number of rides departing or arriving
~~~

The resulting `Table` should be printed to standard out.

### Implementation Hints

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingOne">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
Program Structure
        </a>
      </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
      <div class="panel-body" markdown="span">
This task requires to count taxi ride events by location (cell id), event type (departure or arrival), and time (sliding window). First, we need to obtain the corresponding cell id for each row. Subsequently, we define a sliding time windows of 15 minutes length and 5 minutes evaluation interval and group by the window, cell, and event type. For each group, we count the number of events. The counts need to be filtered by the popularity threshold. Finally, the cell id should be converted back into longitude and latitude before the result stream is emitted.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
Computing the cell ID for each row
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body" markdown="span">
Depending on the event type (departure or arrival), we need to compute the cell ID either on the `startLon` and `startLat` or on the `endLon` and `endLat` values. The Table API and SQL support conditional expressions in their SELECT method or clause.
      </div>
    </div>
  </div>
</div>

### Reference Solution

Reference solutions are available at GitHub:

- Java Table API: [PopularPlacesTableApi.java](https://github.com/dataArtisans/flink-training-
exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/table_java/stream/popularPlaces/PopularPlacesTableApi.java)
- Java SQL: [PopularPlacesSql.java](https://github.com/dataArtisans/flink-training-
exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/table_java/stream/popularPlaces/PopularPlacesSql.java)
- Scala Table API: [PopularPlacesTableApi.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataartisans/flinktraining/exercises/table_scala/stream/popularPlaces/PopularPlacesTableApi.scala)
- Scala SQL: [PopularPlacesSql.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataartisans/flinktraining/exercises/table_scala/stream/popularPlaces/PopularPlacesSql.scala)

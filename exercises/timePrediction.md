---
layout: page
title: DataStream API - Travel Time Prediction
permalink: /exercises/timePrediction.html
---

The task of the "Travel Time Prediction" exercise is to predict the travel time of a taxi ride whenever a ride start event occurs. This is done by using the end events, which carry the information how much time the ride took, to incrementally train a regression model. 

The idea of the exercise is to train a model for each destination grid cell based on the direction from which the taxi arrives and the air-line distance from departure to destination location. The `GeoUtils` class provides two methods to compute these values: `GeoUtils.getEuclideanDistance()` and `GeoUtils.getDirectionAngle()`. The actual travel time can be compute from the start and end time of an end record. We provide a simple prediction model `TravelTimePredictionModel` for the prediction task. `TravelTimePredictionModel.predictTravelTime()` returns a time prediction for a given distance and direction and -1.0 if no prediction is possible yet. `TravelTimePredictionModel.refineModel()` improves the model for a given direction, distance, and actual travel time.  

Since the prediction model is valuable operator state, it should not get lost in case of a failure. Therefore, you should register the model as operator state such that Flink can take care of checkpointing the model and restoring it in case of a failure.

### Input Data

This exercise is based on a stream of taxi ride events. Since the `TaxiRideSource` that we used so far is not able to checkpoint its internal state, we are using the `CheckpointedTaxiRideSource` for this exercise. `CheckpointedTaxiRideSource` is used similar to `TaxiRideSource` except that it does not accept a `maxServingDelay` parameter.

### Expected Output

The result of the exercise should be a `DataStream<Tuple2<TaxiRide, Integer>>` where the first field is a `TaxiRide` start event and the second field is the predicted travel time in minutes. In case, no prediction is possible, the second field should contain `-1`.

The resulting stream should be printed to standard out.

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
The program starts with a `TaxiRide` source function and requires a filter transformation to remove all records that do not start or end in New York City. Since we want to build a model for each destination grid cell, we need to compute grid cell id of the destination location for each event and organize the stream by that cell id. Subsequently, we need a `FlatMapFunction` that emits predictions for start ride events and updates the model for end ride events. Finally, the predictions are printed to the standard out.
Do not forget to configure the checkpointing interval to enable state checkpoints by calling `env.enableCheckpointing()`.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingFive">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
Organizing the Stream by Cell Id.
        </a>
      </h4>
    </div>
    <div id="collapseFive" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFive">
      <div class="panel-body" markdown="span">
Similar to the previous exercises, a `MapFunction` that calls the `GeoUtils.mapToGridCell()` with the `TaxiRide.endLon` and `TaxiRide.endLat` coordinates and a subsequent `keyBy` operation can be used to organize the stream by grid cell id.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
Time Prediction and Model Refinement
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body" markdown="span">
Time predictions and model refinement are done in a `RichFlatMapFunction` that holds the prediction model as a key-value `ValueState`. The key-value state is defined in the function's `open()` method by creating a `ValueStateDescriptor` and calling the `getRuntimeContext().getState()` method which returns a `ValueState` object that is kept as a local member variable in the function. In the `flatMap()` method, the state for the current key is obtained by calling `ValueState.value()` and updated by calling `ValueState.update()`.
      </div>
    </div>
  </div>
</div>

### Reference Solution

Reference solutions are available at GitHub:

- Java: [TravelTimePrediction.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataartisans/flinktraining/exercises/datastream_java/ride_prediction/TravelTimePrediction.java)
- Scala: [TravelTimePrediction.scala](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/scala/com/dataartisans/flinktraining/exercises/datastream_scala/ride_prediction/TravelTimePrediction.scala)

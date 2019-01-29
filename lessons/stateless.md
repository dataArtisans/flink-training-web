---
gated: true
title: Stateless Transformations
layout: page
permalink: /lessons/stateless.html
nav-parent_id: transformations
nav-pos: 10
---

## map()

In the first exercise we filtered a stream of taxi ride events. In that same code base there's a `GeoUtils` class that provides a static method `GeoUtils.mapToGridCell(float lon, float lat)` which maps a location (longitude, latitude) to a grid cell that refers to an area that is approximately 100x100 meters in size.

Now let's enrich our stream of taxi ride objects by adding `startCell` and `endCell` fields to each event. We can create an `EnrichedRide` object that extends `TaxiRide`, adding these fields:

{% java %}
public static class EnrichedRide extends TaxiRide {
  public int startCell;
  public int endCell;

  public EnrichedRide() {}

  public EnrichedRide(TaxiRide ride) {
    this.rideId = ride.rideId;
    this.isStart = ride.isStart;
    ...
    this.startCell = GeoUtils.mapToGridCell(ride.startLon, ride.startLat);
    this.endCell = GeoUtils.mapToGridCell(ride.endLon, ride.endLat);
  }

  public String toString() {
    return super.toString() + "," +
      Integer.toString(this.startCell) + "," +
      Integer.toString(this.endCell);
  }
}
{% endjava %}

We can then create an application that transforms the stream

{% java %}
DataStream<TaxiRide> rides = env.addSource(new TaxiRideSource(...));

DataStream<EnrichedRide> enrichedNYCRides = rides
    .filter(new RideCleansing.NYCFilter())
    .map(new Enrichment());

enrichedNYCRides.print();
{% endjava %}

with this `MapFunction`:

{% java %}
public static class Enrichment implements MapFunction<TaxiRide, EnrichedRide> {
  @Override
  public EnrichedRide map(TaxiRide taxiRide) throws Exception {
    return new EnrichedRide(taxiRide);
  }
}
{% endjava %}

## flatmap()

A `MapFunction` is suitable only when performing a one-to-one transformation: for each and every stream element coming in, `map()` will emit one transformed element. Otherwise, you'll want to use `flatmap()`

{% java %}
DataStream<TaxiRide> rides = env.addSource(new TaxiRideSource(...));

DataStream<EnrichedRide> enrichedNYCRides = rides
    .flatMap(new NYCEnrichment());

enrichedNYCRides.print();
{% endjava %}

together with a `FlatMapFunction`:

{% java %}
public static class NYCEnrichment implements FlatMapFunction<TaxiRide, EnrichedRide> {
  @Override
  public void flatMap(TaxiRide taxiRide, Collector<EnrichedRide> out) throws Exception {
    FilterFunction<TaxiRide> valid = new RideCleansing.NYCFilter();
    if (valid.filter(taxiRide)) {
      out.collect(new EnrichedRide(taxiRide));
    }
  }
}
{% endjava %}

With the `Collector` provided in this interface, the `flatmap()` method can emit as many stream elements as you like, including none at all.

## Further Reading

- [DataStream Transformations]({{site.docs}}/dev/stream/operators/#datastream-transformations) (Apache Flink Documentation)

{% next %}

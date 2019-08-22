---
gated: true
title: ProcessFunction
nav-parent_id: event-driven
layout: page
permalink: /lessons/processfunction.html
nav-pos: 10
---

ProcessFunction combines event processing with timers and state, making it a powerful building block for stream processing applications. This is the basis for creating event-driven applications with Flink. It is very similar to a RichFlatMap, but with the addition of timers.

There's a complete example of using a ProcessFunction to sort a stream of events from connected cars in [CarEventSort on GitHub](https://github.com/ververica/flink-training-exercises/blob/master/src/main/java/com/ververica/flinktraining/examples/datastream_java/process/CarEventSort.java), which is part of the training exercises repo that you have probably already cloned. Let's examine how this application works in some detail.

{% java %}
events.keyBy((ConnectedCarEvent event) -> event.carId)
	.process(new SortFunction())
{% endjava %}

In this code snippet we see a ProcessFunction called SortFunction being applied to a keyed stream. This means that we will be sorting (by timestamp) the events for each car individually, rather than trying to achieve a total, global ordering of the entire stream -- which couldn't be done in parallel.

The overall outline of SortFunction has this shape:

{% java %}
public static class SortFunction extends KeyedProcessFunction<String, ConnectedCarEvent, ConnectedCarEvent> {
	/* we'll use a PriorityQueue to buffer not-yet-fully-sorted events */
	private ValueState<PriorityQueue<ConnectedCarEvent>> queueState = null;

	@Override
	public void open(Configuration config) {
	    /* set up the state we want to use */
		...
	}

	@Override
	public void processElement(ConnectedCarEvent event, Context context, Collector<ConnectedCarEvent> out) throws Exception {
		/* add/sort this event into the queue */ 
		...
		
		/* set an event-time timer for when the stream is complete up to the event-time of this event */
		...
	}

	@Override
	public void onTimer(long timestamp, OnTimerContext context, Collector<ConnectedCarEvent> out) throws Exception {
	    /* release the items at the head of the queue that are now ready, based on the CurrentWatermark */
		...
	}
}
{% endjava %}

Things to be aware of:

* There are several types of ProcessFunctions -- this is a KeyedProcessFunction, but there are also CoProcessFunctions, BroadcastProcessFunctions, etc. 

* A KeyedProcessFunction is a kind of RichFunction. Being a RichFunction, it has access to the open and getRuntimeContext methods needed for working with managed keyed state.

* There are two callbacks to implement: processElement and onTimer. processElement is called with each incoming event; onTimer is called when timers fire. These can be either event-time or processing-time timers. Both callbacks are provided with a context object that can be used to interact with a `TimerService` (among other things). Both callbacks are also passed a `Collector` that can be used to emit results.

#### open()

{% java %}
@Override
public void open(Configuration config) {
	ValueStateDescriptor<PriorityQueue<ConnectedCarEvent>> descriptor = new ValueStateDescriptor<>(
		"sorted-events", TypeInformation.of(new TypeHint<PriorityQueue<ConnectedCarEvent>>() {})
	);
	queueState = getRuntimeContext().getState(descriptor);
}
{% endjava %}

Up until now we've used something like `TaxiRide.class` to provide type information when creating ValueStateDescriptors. In cases where generics are involved, Flink needs more information.

#### processElement()

{% java %}
@Override
public void processElement(ConnectedCarEvent event, Context context, Collector<ConnectedCarEvent> out) throws Exception {
	TimerService timerService = context.timerService();

	if (context.timestamp() > timerService.currentWatermark()) {
		PriorityQueue<ConnectedCarEvent> queue = queueState.value();
		if (queue == null) {
			queue = new PriorityQueue<>(10);
		}
		queue.add(event);
		queueState.update(queue);
		timerService.registerEventTimeTimer(event.timestamp);
	}
}
{% endjava %}

Things to consider:

* What happens with late events? Events that are behind the watermark (i.e., late) are being dropped. If you want to do something better than this, consider using a side output, which is explained in the [next section]({{ site.baseurl }}/lessons/side-outputs.html).

* We are setting an event-time timer for `event.timestamp`. This is actually a very common pattern. You can think of this as saying "please wake up me when all of the out-of-orderness affecting earlier events has been resolved." 

#### onTimer()

When the time does come that all of that out-of-orderness potentially affecting earlier events is no longer an issue, we can release all the events in the queue that are ahead of the watermark. They are correctly sorted, ready to go, and anything earlier should have arrived by now, assuming you can trust your watermarks. 

There might be more than one event to release, because there could be several events with the same timestamp. Flink de-duplicates timers -- it will only create one timer for a given timestamp and key -- so we're not guaranteed a one-to-one relationship between timers and events.

{% java %}
@Override
public void onTimer(long timestamp, OnTimerContext context, Collector<ConnectedCarEvent> out) throws Exception {
	PriorityQueue<ConnectedCarEvent> queue = queueState.value();
	Long watermark = context.timerService().currentWatermark();
	ConnectedCarEvent head = queue.peek();
	while (head != null && head.timestamp <= watermark) {
		out.collect(head);
		queue.remove(head);
		head = queue.peek();
	}
}
{% endjava %}

## Further Reading

- [ProcessFunction]({{ site.docs }}/dev/stream/operators/process_function.html) (Apache Flink Documentation)

{% next %}

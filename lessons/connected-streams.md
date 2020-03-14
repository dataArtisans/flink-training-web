---
gated: true
title: Connected Streams
nav-parent_id: transformations
layout: page
permalink: /lessons/connected-streams.html
nav-pos: 40
---

Sometimes instead of applying a pre-defined transformation like this:

![simple transformation]({{site.images}}/transformation.svg)

you want to be able to dynamically alter some aspects of the transformation -- by streaming in thresholds, or rules, or other parameters. The pattern in Flink that supports this is something called _connected streams_, wherein a single operator has two input streams, like this:

![connected streams]({{site.images}}/connected-streams.svg)

Connected streams can also used for implementing streaming joins, a topic that's covered in a later exercises.

## Example

In this example a control stream is used to specify words which must be filtered out of the streamOfWords. A `RichCoFlatMapFunction` called ControlFunction is applied to the connected streams to get this done. 

{% java %}
public static void main(String[] args) throws Exception {
    StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

	DataStream<String> control = env.fromElements("DROP", "IGNORE").keyBy(x -> x);
	DataStream<String> streamOfWords = env.fromElements("data", "DROP", "artisans", "IGNORE").keyBy(x -> x);
	
	control
	    .connect(datastreamOfWords)
		.flatMap(new ControlFunction())
        .print();

    env.execute();
}
{% endjava %}

Note that the two streams being connected must be keyed in compatible ways -- either both streams are not keyed, or both are keyed, and if they are both keyed, the key values have to be the same. In this case the streams are both of type DataStream&lt;String&gt;, and both streams are keyed by the string. As you will see below, this RichCoFlatmap is storing a Boolean value in keyed state, and this Boolean is shared by the two streams.

{% java %}
public static class ControlFunction extends RichCoFlatMapFunction<String, String, String> {
	private ValueState<Boolean> blocked;
		
	@Override
	public void open(Configuration config) {
	    blocked = getRuntimeContext().getState(new ValueStateDescriptor<>("blocked", Boolean.class));
	}
		
	@Override
	public void flatMap1(String control_value, Collector<String> out) throws Exception {
	    blocked.update(Boolean.TRUE);
	}
		
	@Override
	public void flatMap2(String data_value, Collector<String> out) throws Exception {
	    if (blocked.value() == null) {
		    out.collect(data_value);
		}
	}
}
{% endjava %}

A `RichCoFlatMapFunction` is a kind of FlatMapFunction that can be applied to a pair of connected streams, and has access to the rich function interface -- which we will take advantage of in this case to make it stateful. 

The `blocked` Boolean is being used to remember the keys (or the words) that have been mentioned on the `control` stream, and those words are being filtered from the `streamOfWords` stream. This is _keyed_ state, and it is shared between the two streams, which is why the two streams have to share the same keyspace.

`flatMap1` and `flatMap2` are called by the Flink runtime with elements from each of the two connected streams -- in our case, elements from the `control` stream are passed into `flatMap1`, and elements from `streamOfWords` are passed into `flatMap2`. This was determined by the order in which we connected the two streams via `control.connect(datastreamOfWords)`. 

It is important to recognize that you have no control over the order in which the `flatMap1` and `flatMap2` callbacks are called. These two input streams are racing against each other, and the Flink runtime will do what it wants to regarding consuming events from one stream or the other. In cases where timing and/or ordering matter, you may find it necessary to buffer events in managed Flink state until your application is ready to process them.

{% next %}

---
gated: true
layout: page
title: Lab 3 - Discussion
permalink: /exercises/hourlyTips-discussion.html
nav-parent_id: lab3
nav-pos: 20
---

The Java and Scala reference solutions illustrate two different approaches, though they have a lot of similarities. Both first compute the sum of the tips for every hour for each driver. In [HourlyTipsSolution.java]({{site.javasolutions}}/windows/HourlyTipsSolution.java) that looks like this,

{% java %}
DataStream<Tuple3<Long, Long, Float>> hourlyTips = fares
	.keyBy((TaxiFare fare) -> fare.driverId)
	.timeWindow(Time.hours(1))
	.process(new AddTips());
{% endjava %}

where a ProcessWindowFunction does all the heavy lifting:

{% java %}
public static class AddTips extends ProcessWindowFunction<
		TaxiFare, Tuple3<Long, Long, Float>, Long, TimeWindow> {
	@Override
	public void process(Long key, Context context, Iterable<TaxiFare> fares, Collector<Tuple3<Long, Long, Float>> out) throws Exception {
		Float sumOfTips = 0F;
		for (TaxiFare f : fares) {
			sumOfTips += f.tip;
		}
		out.collect(new Tuple3<>(context.window().getEnd(), key, sumOfTips));
	}
}
{% endjava %}

This is straightforward, but has the drawback that it's buffering all of the TaxiFare objects in the windows until the windows are triggered, which is less efficient than computing the sum of the tips incrementally, using a reduce or agggregate function. 

The [Scala solution]({{site.scalasolutions}}/windows/HourlyTipsSolution.scala) uses a reduce function

{% scala %}
val hourlyTips = fares
  .map((f: TaxiFare) => (f.driverId, f.tip))
  .keyBy(_._1)
  .timeWindow(Time.hours(1))
  .reduce(
    (f1: (Long, Float), f2: (Long, Float)) => { (f1._1, f1._2 + f2._2) },
    new WrapWithWindowInfo())
{% endscala %}

along with this ProcessWindowFunction

{% scala %}
class WrapWithWindowInfo() extends ProcessWindowFunction[(Long, Float), (Long, Long, Float), Long, TimeWindow] {
  override def process(key: Long, context: Context, elements: Iterable[(Long, Float)], out: Collector[(Long, Long, Float)]): Unit = {
    val sumOfTips = elements.iterator.next()._2
    out.collect((context.window.getEnd(), key, sumOfTips))
  }
}
{% endscala %}

to compute HourlyTips.

Having computed HourlyTips, it's a good idea to take a took at what this stream looks like. `hourlyTips.print()` yields this,

```
1> (1357002000000,2013000019,1.0)
1> (1357002000000,2013000036,6.4)
1> (1357002000000,2013000027,15.4)
1> (1357002000000,2013000071,1.0)
1> (1357002000000,2013000105,3.65)
1> (1357002000000,2013000110,1.8)
1> (1357002000000,2013000237,0.0)
1> (1357002000000,2013000580,0.0)
1> (1357002000000,2013000968,0.0)
1> (1357002000000,2013002242,2.0)
1> (1357002000000,2013004131,0.0)
1> (1357002000000,2013008339,0.0)
3> (1357002000000,2013000026,5.45)
3> (1357002000000,2013000009,2.0)
1> (1357002000000,2013008305,0.0)
...
```

or in other words, lots of tuples for each hour that show for each driver, the sum of their tips for that hour.

Now, how to find the maximum within each hour? The reference solutions both do this, more or less:

{% java %}
DataStream<Tuple3<Long, Long, Float>> hourlyMax = hourlyTips
	.timeWindowAll(Time.hours(1))
	.maxBy(2);
{% endjava %}

which works just fine, producing this stream of results:

```
1> (1357002000000,2013000493,54.45)
2> (1357005600000,2013010467,64.53)
3> (1357009200000,2013010589,104.75)
4> (1357012800000,2013010182,150.0)
1> (1357016400000,2013010182,90.0)
```

But, what if we were to do this, instead?

{% java %}
DataStream<Tuple3<Long, Long, Float>> hourlyMax = hourlyTips
	.keyBy(0)
	.maxBy(2);
{% endjava %}

This says to group the stream of hourlyTips by timestamp, and within each timestamp, find the maximum of the sum of the tips. That sounds like it's exactly what we want. And while this alternative does find the same results, there are a couple of reasons why it's not a very good solution.

First, instead of producing a single result at the end of each window, with this approach we get a stream that is continuously reporting the maximum achieved so far, for each key (i.e., each hour), which is an awkward way to consume the result if all you wanted was a single value for each hour.

```
3> (1357002000000,2013000019,1.0)
3> (1357002000000,2013000036,6.4)
3> (1357002000000,2013000027,15.4)
...
3> (1357002000000,2013009336,25.0)
...
3> (1357002000000,2013006686,38.26)
...
3> (1357002000000,2013005943,40.08)
...
3> (1357002000000,2013005747,51.8)
...
3> (1357002000000,2013000493,54.45)
...
```

Second, Flink will be keeping in state the maximum seen so far for each key (each hour), forever. Flink has no idea that these keys are event-time timestamps, and that the watermarks could be used as an indicator of when this state can be cleared -- to get those semantics, we need to use windows.

{% next %}

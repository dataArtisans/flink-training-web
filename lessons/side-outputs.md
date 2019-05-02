---
gated: true
title: Side Outputs
layout: page
permalink: /lessons/side-outputs.html
nav-parent_id: event-driven
nav-pos: 20
---

There are several good reasons to want to have more than one output stream from your Flink pipeline, such as reporting:

* exceptions
* malformed events
* late events
* operational alerts, such as timed-out connections to external services

Side outputs are a convenient way to do this. 

Each side output channel is associated with an `OutputTag<T>`. The tags have generic types that correspond to the type of the side output's DataStream, and they have names. Two OutputTags with the same name should have the same type, and will refer to the same side output.

In this example we extend the classic word count program to only count words that are at least 5 letters long, and send shorter words to a side output.

{% java %}
public class WordCount {
	static final OutputTag<String> shortWordsTag = new OutputTag<String>("short") {};

	public static void main(String[] args) throws Exception {
		final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

		SingleOutputStreamOperator<Tuple2<String, Integer>> tokenized = env
			.addSource(new SocketTextStreamFunction("localhost", 9999, "\n", -1))
			.process(new Tokenizer());

		DataStream<String> shortWords = tokenized.getSideOutput(shortWordsTag);
		shortWords.print();

		DataStream<Tuple2<String, Integer>> wordCounts = tokenized.keyBy(0).sum(1);
		wordCounts.print();

		env.execute("Streaming WordCount");
	}

	public static final class Tokenizer 
	  extends ProcessFunction<String, Tuple2<String, Integer>> { ... }
}
{% endjava %}

Note that if you want to access the side output stream, you need to capture the stream being emited by a ProcessFunction, and access the side output from there.

Below you will see that the context passed to the processElement method is used to write to a side output, by using the output tag to specify which side output to write to. In this example, short words are being sent to the side output collecting rejected words, while the remaining words are emitted with the primary Collector as Tuples, in classic word-count-style.

{% java %}
public static final class Tokenizer extends ProcessFunction<String, Tuple2<String, Integer>> {

	@Override
	public void processElement(String value, Context ctx, Collector<Tuple2<String, Integer>> out) {
		// normalize and split the line
		String[] tokens = value.toLowerCase().split("\\W+");

		for (String token : tokens) {
			if (token.length() < 5) {
				// send short words to a side output
				ctx.output(shortWordsTag, token);
			} else if (token.length() > 0) {
				// emit the pair
				out.collect(new Tuple2<>(token, 1));
			}
		}
	}
}
{% endjava %}

## Further Reading

- [Side Outputs]({{ site.docs }}/dev/stream/side_output.html) (Apache Flink Documentation)

{% next %}

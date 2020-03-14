---
title: What can be Streamed?
layout: page
permalink: /intro/intro-2.html
nav-parent_id: intro
nav-pos: 20
---

Flink's DataStream APIs for Java and Scala will let you stream anything they can serialize. Flink's own serializer is used for

- basic types, i.e., String, Long, Integer, Boolean, Array
- composite types: Tuples, POJOs, and Scala case classes

and Flink falls back to Kryo for other types. It's also possible to use other serializers with Flink. Avro, in particular, is well supported.

### Java

#### Tuples

For Java, Flink defines its own Tuple1 thru Tuple25 types.

{% java %}
Tuple2<String, Integer> person = new Tuple2<>("Fred", 35);

// zero based index!  
String name = person.f0;
Integer age = person.f1;
{% endjava %}

#### POJOs

A POJO (plain old Java object) is any Java class that

- has an empty default constructor
- all fields are either
  - public, or
  - have a default getter and setter


Example:

{% java %}
public class Person {
    public String name;  
    public Integer age;  
    public Person() {};  
    public Person(String name, Integer age) {  
        …  
    };  
}  

Person person = new Person("Fred Flintstone", 35);
{% endjava %}

### Scala tuples and case classes

These work just as you'd expect.

## Further Reading

- [Data Types & Serialization]({{ site.docs }}/dev/types_serialization.html) (Apache Flink Documentation)
- [State Schema Evolution]({{site.docs}}/dev/stream/state/schema_evolution.html) (Apache Flink Documentation)

{% next %}

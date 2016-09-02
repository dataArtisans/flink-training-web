---
title: DataStream API Stateful Operators - Hands-On
layout: page
permalink: /dataStream/4-handsOn.html
---

In this hands-on session you will implement a DataStream program that includes a stateful operator.

### **Add description**

* Link to Avg Speed exercise
  * served through Kafka
  * inserted into Elasticsearch
  * Maybe another exercise which can be better visualized?

* Instruction for recovery demo 
  * Explain stateful setup and checkpoint configuration?
  * Process killing
  * Monitoring (via Elastic)?

### Implement a stateful streaming application

Follow the instructions of the [Travel Time Prediction exercise]( {{site.baseurl}}/exercises/timePrediction.html).

### Monitor with Elasticsearch

~~~bash
curl -XPUT "http://localhost:9200/nyc-rides"
~~~

~~~bash
curl -XPUT "http://localhost:9200/nyc-rides/_mapping/ride-predictions" -d'
     {
      "ride-predictions" : {
        "properties" : {
		   "rideId": {"type": "long"},
           "departureTime": {"type": "date"},
           "departure": {"type": "geo_point"},
           "destination": {"type": "geo_point"},
           "predTime": {"type": "integer"}
         }
      } 
     }'
~~~


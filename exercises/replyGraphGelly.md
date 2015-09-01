---
layout: page
title: Gelly API - PageRank on Reply Graph
permalink: /exercises/replyGraphGelly.html
---
The task of the “Reply Graph with PageRank” exercise is to define a graph using Flink's Gelly API and then to analyze the structure of the Flink community by running a pageRank algorithm over it.
The input data set for graph generation is the output of the  [Reply Graph]({{ site.baseurl }}/exercises/replyGraph.html) exercise.


### Input Data

This exercise uses the output of the [Reply Graph]({{ site.baseurl }}/exercises/replyGraph.html) exercise as input (`CsvInputFormat`).

The input data can be read as `DataSet<Tuple3<String, String, Integer>>`. The first field is the sender email address of the reply mail, the second field is the sender email address of the mail that was replied to, and the third field is the number of reply connections between these two email addresses. When printed, the data set should look like this:

~~~
(sewen@apache.org,rmetzger@apache.org,72)
(aljoscha@apache.org,sewen@apache.org,40)
(fhueske@apache.org,rmetzger@apache.org,22)
(rmetzger@apache.org,fhueske@apache.org,22)
~~~


### Expected Output


The result of the exercise should be a `DataSet<Vertex<String,Double>>`. The first field indicates the vertex id, i.e., email address, the second field is its associated rank.
When printed, the data set should look like this:

~~~
sewen@apache.org,0.09693645392297123
aljoscha@apache.org,0.038048230343289406
~~~

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
This exercise can be solved in three steps. First, read Reply Graph as edge DataSet. Then generate Graph from edge DataSet and finally apply the Gelly PageRank algorithm.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
Read Reply Graph as edge DataSet
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body" markdown="span">
Read each tuple `DataSet<Tuple3<String, String, Double>>` of the replyGraph exercise as an Edge. The data generated from the reply-graph exercise can be read as a data set of edges with emails being the source and target edge ids, while the number of reply connections can be stored as edge weights. 
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingThree">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
Generate Graph from edge DataSet
        </a>
      </h4>
    </div>
    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <div class="panel-body" markdown="span">
Use one of the methods of Gelly API to create a weighted graph, such as the `fromDataSet` method. It is recommended to create a class which takes as input arguments: path of input file, output file and number of iterations for the PageRank algorithm. **Note**, Add the `gelly dependency` in the pom file.
      </div>
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingFour">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
Apply Gelly PageRank algorithm
        </a>
      </h4>
    </div>
    <div id="collapseFour" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">
      <div class="panel-body" markdown="span">
The final step of this exercise is to apply Gelly's [PageRank algorithm](https://github.com/apache/flink/blob/master/flink-staging/flink-gelly/src/main/java/org/apache/flink/graph/library/PageRankAlgorithm.java) by calling `graph.run(new PageRankAlgorithm<..>(input parameters))`. In Gelly's PageRank implementation, a vertex distributes its rank to the target vertices according to the weight of its outgoing edges e.g. if vertex A has two outgoing links (`<A,B,2>`, `<A,C,1>`), vertex B will get 2/3 of the total share of rank distributed by A, while C will get only 1/3. A suggestion would be to update edge values once a graph has been obtained, by taking into consideration the sum of all the outgoing edges from a given vertex,(`<A,B,2/3>`,`<A,C,1/3>`). 
      </div>
    </div>
  </div>
</div>

### Reference Solution

Reference solution is available at GitHub:

- Java: [PageRankWithEdgeWeights.java](https://github.com/dataArtisans/flink-training-exercises/blob/master/src/main/java/com/dataArtisans/flinkTraining/exercises/gellyJava/PageRankWithEdgeWeights.java)

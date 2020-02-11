---
title: Setup your Development Environment
layout: page
permalink: /devEnvSetup.html
nav-title: Setup your Dev Env
nav-parent_id: setup
nav-pos: 10
---

The following instructions guide you through the process of setting up a development environment for the purpose of developing, debugging, and executing solutions to the training exercises and examples on this site.

### 1. Software requirements

Flink supports Linux, OS X, and Windows as development environments for Flink programs and local execution. The following software is required for a Flink development setup and should be installed on your system:

- a JDK for Java 8 or Java 11 (a JRE is not sufficient; other versions of Java are not supported)
- Apache Maven 3.x
- Git
- an IDE for Java (and/or Scala) development. We recommend IntelliJ, but Eclipse or Visual Studio Code can also be used so long as you stick to Java. For Scala you will need to use IntelliJ (and its Scala plugin).

<div class="alert alert-info">
<p>
<strong>Note for Windows users:</strong>
Many of the examples of shell commands provided in the training instructions are for UNIX systems.
To make things easier, you may find it worthwhile to setup cygwin or WSL, but you can use the provided .bat scripts with plain cmd.
For developing Flink jobs, Windows works reasonably well: you can run a Flink cluster on a single machine, submit jobs, run the webUI, and execute jobs in the IDE.
</p>
</div>

### 2. Clone and build the flink-training-exercises project

The `flink-training-exercises` project contains exercises, tests, and reference solutions for the programming exercises, as well as an extensive collection of examples. Clone the `flink-training-exercises` project from Github and build it.

For Java, use the java branch:

~~~bash
git clone --branch java https://github.com/dataArtisans/flink-training-exercises.git
cd flink-training-exercises
mvn clean package
~~~

For Scala, use the master branch:

~~~bash
git clone https://github.com/dataArtisans/flink-training-exercises.git
cd flink-training-exercises
mvn clean package
~~~

If you haven't done this before, at this point you'll end up downloading all of the dependencies for this Flink training exercises project. This usually takes a few minutes, depending on the speed of your internet connection.

If all of the tests pass and the build is successful, you are off to a good start.

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingOne">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
Users in China: click here for instructions about using a local maven mirror.
        </a>
      </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
      <div class="panel-body">
If you are in China, we recommend configuring maven to use a mirror. This is done by adding some configuration to your maven settings file (in <code>~/.m2/settings.xml</code>). If you don't already have any customized maven settings, you can use this:

<pre><code>
&lt;settings&gt;
  &lt;mirrors&gt;
    &lt;mirror&gt;
       &lt;id&gt;nexus-aliyun&lt;/id&gt;
       &lt;mirrorOf&gt;*&lt;/mirrorOf&gt;
       &lt;name&gt;Nexus aliyun&lt;/name&gt;
       &lt;url&gt;http://maven.aliyun.com/nexus/content/groups/public&lt;/url&gt;
    </mirror>
  </mirrors>
</settings>
</code></pre>

      </div>
    </div>
  </div>
</div>

### 3. Import the flink-training-exercises project into your IDE

The project needs to be imported as a maven project into your IDE.

Once that's done you should be able to open `com.dataartisans.flinktraining.exercises.datastream_java.basics.RideCleansingTest` and successfully run this test.

<div class="alert alert-info">
<p>
<strong>Note for Scala users:</strong>
For Scala you will need to use IntelliJ with the JetBrains Scala plugin, and you will need to add a Scala 2.12 SDK to the Global Libraries section of the Project Structure.</p>
</div>

### 4. Download the data sets

You will also need to download the taxi data files used in this training by running the following commands

~~~~
wget http://training.ververica.com/trainingData/nycTaxiRides.gz
wget http://training.ververica.com/trainingData/nycTaxiFares.gz
~~~~

It doesn't matter if you use wget or something else (like curl, or Chrome) to download these files, but however you get the data, **do not decompress or rename the `.gz` files**. Some browsers will do the wrong thing by default.

To learn more about this data, see [Using the Taxi Data Streams]({{site.baseurl}}/setup/taxiData.html).

Note: There's a hardwired path to these data files in the exercises. Before trying to execute them, read [How to do the Labs]({{site.baseurl}}/setup/howto-exercises.html).

<hr style="margin: 0 0 10px 0" />

If you want to also setup a local cluster for executing Flink jobs outside the IDE, see [Setting up a Local Flink Cluster]({{site.baseurl}}/setup/localCluster.html).

{% next %}

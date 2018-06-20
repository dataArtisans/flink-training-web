---
title: Setup Development Environment
layout: page
permalink: /devEnvSetup.html
---

The following instructions guide you through the process of setting up an environment to locally develop, debug, and execute Flink programs. Furthermore, you will install a Flink instance to locally execute Flink programs on your machine.

### 1. Software requirements

Flink supports Linux, OS X, and Windows as development environments for Flink programs and local execution. The following software is required for a Flink development setup and should be installed on your system:

- Java JDK 8 (a JRE is not sufficient!)
- Apache Maven 3.x
- Git
- an IDE for Java (and/or Scala) development. We recommend IntelliJ, but Eclipse will work so long as you stick to Java. For Scala you will need to use IntelliJ (and its Scala plugin).

<div class="alert alert-info">
<p>
<strong>Note for Windows users:</strong>
In previous trainings we've had the best experiences with UNIX-based setups, and most commands provided in the training instructions are for UNIX systems.
If your main operating system is Windows and you would like everything to work flawlessly, we recommend you setup a virtual machine running Linux.
</p>

<p>
On the other hand, we've also had success doing training with Windows.
Note, however, that some of the installation steps require administrator privileges.
And we recommend you setup Cygwin so that you can take advantage of the bash scripts that come with Flink.
</p>
</div>

### 2. Generate a Flink Maven project

Flink provides Maven archetypes to correctly setup Maven projects for Java or Scala Flink programs. We need to add an additional dependency to these Maven projects which contains utility classes that are required for the programming exercises of the training.

Follow the next steps to set up a Flink Maven Quickstart project which can be used for the programming exercises.

#### Generate a Flink Maven Quickstart project

Run one of following commands to generated a Flink Java or Scala project.

**Flink Java Project**

~~~bash
mvn archetype:generate                             \
    -DarchetypeGroupId=org.apache.flink            \
    -DarchetypeArtifactId=flink-quickstart-java    \
    -DarchetypeVersion=1.5.0                       \
    -DgroupId=org.apache.flink.quickstart          \
    -DartifactId=flink-java-project                \
    -Dversion=0.1                                  \
    -Dpackage=org.apache.flink.quickstart          \
    -DinteractiveMode=false
~~~

**Flink Scala project**

~~~bash
mvn archetype:generate                             \
    -DarchetypeGroupId=org.apache.flink            \
    -DarchetypeArtifactId=flink-quickstart-scala   \
    -DarchetypeVersion=1.5.0                       \
    -DgroupId=org.apache.flink.quickstart          \
    -DartifactId=flink-scala-project               \
    -Dversion=0.1                                  \
    -Dpackage=org.apache.flink.quickstart          \
    -DinteractiveMode=false
~~~

**Note**: Windows users need to remove the backslashes from the Maven commands.

The generated Flink quickstart project is located in a folder called `flink-java-project` (or `flink-scala-project` for Scala projects).

#### Clone and build the flink-training-exercises project

The `flink-training-exercises` project contains utility classes and reference solutions for the programming exercises. Clone the `flink-training-exercises` project from Github and build it.

~~~bash
git clone https://github.com/dataArtisans/flink-training-exercises.git
cd flink-training-exercises
mvn clean install
~~~

#### Add this dependency to your pom.xml

Open the `pom.xml` file in your Maven project (`./flink-java-project/pom.xml` or `flink-scala-project/pom.xml`) with a text editor and add the following dependency *after the other flink dependencies*:

~~~xml
<dependency>
  <groupId>com.data-artisans</groupId>
  <artifactId>flink-training-exercises</artifactId>
  <version>1.1.0</version>
</dependency>
~~~

#### Only for Eclipse, add this plugin to your pom.xml

If you are using Eclipse, add the `exec-maven-plugin` plugin to the &lt;build&gt; &lt;plugins&gt; section of pom.xml:

~~~xml
<plugin>
  <groupId>org.codehaus.mojo</groupId>
  <artifactId>exec-maven-plugin</artifactId>
  <version>1.6.0</version>
  <executions>
    <execution>
      <goals>
        <goal>java</goal>
      </goals>
    </execution>
  </executions>
  <configuration>
    <mainClass>org.apache.flink.flink_quickstart_java.StreamingJob</mainClass>
    <arguments>
    </arguments>
  </configuration>
</plugin>
~~~

#### Build your Flink quickstart project

In order to test the generated project and to download all required dependencies run the following command in the `flink-java-project` folder (or the `flink-scala-project` folder for Scala projects).

~~~bash
mvn clean package
~~~

Maven will now start to download all required dependencies and build the Flink quickstart project.

### 3. Import the Flink Maven project into your IDE

The generated Maven project needs to be imported into your IDE.

- IntelliJ:
  1. Select *"File"* -> *"New"* -> *"Project from Existing Sources..."*
  1. Select the `pom.xml` file in your project (*flink-java-project* or *flink-scala-project*)
  1. Accept the defaults in the first *Import Project from Maven* dialog
  1. Tick the checkbox to select the `add-dependencies-for-IDEA` profile
  1. Continue, making sure when you get to the SDK dialog that it has a valid path to a JDK and **leaving all other options to their default values**, finish the maven project import
- Eclipse:
  1. Select *"File"* -> *"Import"* -> *"Maven"* -> *"Existing Maven Project"*
  1. Tick the **Add project(s) to working set** option
  1. Right click on the project in the Explorer, and under *"Maven" / "Select Maven Profiles..."* select the `add-dependencies-for-IDEA` profile, and **Force Update**

### 4. Running and debugging Flink programs in your IDE

Flink programs can be executed and debugged from within an IDE. This significantly eases the development process and provides an experience similar to working on any other Java application.

Starting a Flink program in your IDE is as easy as running its `main()` method. Under the hood, the execution environment will start a local Flink instance within the same process. Hence it is also possible to put breakpoints in your code and debug it.

Assuming you have an IDE with a Flink quickstart project imported, you can run (or debug) a simple streaming job as follows:

- Open the `org.apache.flink.quickstart.StreamingJob` class in your IDE
- Add a line of code so the streaming job has something (trivial) to do:

<pre><code class="lang-java">final StreamExecutionEnvironment env =
  StreamExecutionEnvironment.getExecutionEnvironment();

// add this line
env.fromElements(1, 2, 3).print();

env.execute("...");
</code></pre>

- Run (or debug) the `main()` method of the `StreamingJob` class using your IDE.

### 5. Install Flink for local execution

In order to execute programs on a running Flink instance (rather than from within your IDE), you need to install Flink on your machine. To do so, follow these steps:

- Download the Apache Flink 1.5.0 release from the [download page](http://flink.apache.org/downloads.html). Since we won't use HDFS or YARN, any Hadoop version will work, including the "without bundled hadoop" version.
- Extract the downloaded archive
- The resulting folder contains a Flink setup that can be locally executed without any further configuration.

### 6. Start a local Flink instance

If you have a local Flink installation, you can start a Flink instance that runs a master and a worker process on your local machine in a single JVM. This execution mode is useful for local testing.

#### Start local Flink instance

On UNIX system you can start a Flink instance as follows:

~~~bash
cd /to/your/flink/installation
./bin/start-local.sh
~~~

On Windows you have to run the following commands

~~~bash
cd C:\to\your\flink\installation
.\bin\start-local.bat
~~~

#### Validate that Flink is running

You can validate that a local Flink instance is running by looking at the log files in `./log/` or opening the JobManager's webinterface at [http://localhost:8081](http://localhost:8081).

#### Stop local Flink instance

On UNIX you call

~~~bash
./bin/stop-local.sh
~~~

On Windows you quit the running process with `Ctrl-C`.

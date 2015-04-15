set JAVA_HOME=C:/jdk1.4.2
$JAVA_HOME/bin/javac -classpath $JAVA_HOME/jre/lib/plugin.jar -d . *.java
$JAVA_HOME/bin/jar cvf examples.jar *.class com
zip -r examples.zip *.html *.java -x index.html

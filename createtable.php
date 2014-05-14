<?php
$con = mysqli_connect('127.0.0.1', 'test1', 'test1', 'dbviz');
// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
$tableName = strval($_POST["name"]);
// Create table
$sql="CREATE TABLE " . $tableName;

// Execute query
if (mysqli_query($con,$sql)) {
  echo "Table created successfully";
} else {
  echo "Error creating table: " . mysqli_error($con);
}
?>
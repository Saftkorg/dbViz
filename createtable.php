<?php
$con = mysqli_connect('127.0.0.1', 'test1', 'test1', strval($_POST["db"]));
// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
$tableName = strval($_POST["name"]);
// Create table
$sql="CREATE TABLE " . $tableName . " ("; 
foreach(array_chunk($_POST["columnNames"], 2) as &$values) {
	$sql = $sql . $values[0] . " " . $values[1] . ", ";
}
$sql = substr($sql, 0, -2);
$sql = $sql . ");";
//$sql="CREATE TABLE " . $tableName . " (" . $columnName1 . " " . $columnType1 . ", " . $columnName2 . " " . $columnType2 . ");";

// Execute query
if (mysqli_query($con,$sql)) {
  echo "Table created successfully";
} else {
  echo "Error creating table: " . mysqli_error($con);
}
?>
<?php
$con = mysqli_connect('127.0.0.1', 'test1', 'test1', 'dbviz');
// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

// Create database
$sql="CREATE DATABASE " . $_POST["name"];
if (mysqli_query($con,$sql)) {
  echo "Database my_db created successfully";
} else {
  echo "Error creating database: " . mysqli_error($con);
}
?>
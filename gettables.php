<?php

$q = intval($_GET['q']);

$con = mysqli_connect('127.0.0.1', 'test1', 'test1', 'dbviz');
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

mysqli_select_db($con, "dbviz");
$sql = "SHOW TABLES";
$result = mysqli_query($con, $sql);

$tables = array();
while ($row = mysqli_fetch_array($result)) {
    $tables[] = $row[0];
}

foreach ($tables as $i => $value) {
    
    echo "<table class=\"table\">";
    echo "<thead><tr><th>" . $value . "</th></tr></thead>";
    echo "<tbody>";
    $sql = "SELECT * FROM " . $value . "";
    $result = mysqli_query($con, $sql);
    $fields = mysqli_field_count($con);
    for ($j = 0; $j < $fields; $j++) {
	echo "<tr><td>" . mysqli_fetch_field_direct($result, $j)->name . "</td></tr>";
    }
    $sql = "SHOW KEYS FROM " . $value . " WHERE Key_name = 'PRIMARY'";
    $result = mysqli_query($con, $sql);
    while ($row = mysqli_fetch_array($result)) {
	//echo "\t primarykey: " . $row['Column_name'] . "</br>";
    }
    
    
    //$sql = "SELECT * FROM information_schema.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_NAME = '" . $value ."'";
    $sql = "SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = '" . $value ."' AND REFERENCED_TABLE_NAME IS NOT NULL";
    $result = mysqli_query($con, $sql);
    while ($row = mysqli_fetch_array($result)) {
	//echo "\t foreignkey: " . $row['COLUMN_NAME'] . " ref to: " . $row['REFERENCED_TABLE_NAME'] . " -> " . $row['REFERENCED_COLUMN_NAME'] . "</br>";
    }
    echo "</tbody>";
}

mysqli_close($con);
?>
 
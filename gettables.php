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

    echo $value . "\n";
    $sql = "SELECT * FROM " . $value . "";
    $result = mysqli_query($con, $sql);
    $fields = mysqli_field_count($con);
    for ($j = 0; $j < $fields; $j++) {
	echo "\t" . mysqli_fetch_field_direct($result, $j)->name . "\n";
    }
}

mysqli_close($con);
?>
 
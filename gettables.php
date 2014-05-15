<?php

$q = preg_replace("/[^a-zA-Z0-9_]+/", "", strval($_POST['q']));

$con = mysqli_connect('127.0.0.1', 'test1', 'test1', $q);
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

mysqli_select_db($con, $q);
$sql = "SHOW TABLES";
$result = mysqli_query($con, $sql);

$tables = array();
while ($row = mysqli_fetch_array($result)) {
    $tables[] = $row[0];
}
$html = "";
$data = array();
foreach ($tables as $i => $value) {

    $html .= "<table id=\"" . $value . "\" class=\"table\">"
	    . "<thead><tr><th>" . $value . "</th></tr></thead><tbody>";

    $sql = "SHOW KEYS FROM " . $value . " WHERE Key_name = 'PRIMARY'";
    $result = mysqli_query($con, $sql);
    $primaryKeys = array();
    while ($row = mysqli_fetch_array($result)) {
	//echo "\t primarykey: " . $row['Column_name'] . "</br>";
	$primaryKeys[] = $row['Column_name'];
    }
    //$sql = "SELECT * FROM information_schema.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_NAME = '" . $value ."'";
    $sql = "SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME "
	    . "FROM information_schema.KEY_COLUMN_USAGE WHERE CONSTRAINT_SCHEMA  = '" . $q . "' AND TABLE_NAME = '"
	    . $value . "' AND REFERENCED_TABLE_NAME IS NOT NULL";
    $result = mysqli_query($con, $sql);
    $tmpForeign;
    while ($row = mysqli_fetch_array($result)) {
	//echo "\t foreignkey: " . $row['COLUMN_NAME'] . " ref to: " . $row['REFERENCED_TABLE_NAME'] . " -> " . $row['REFERENCED_COLUMN_NAME'] . "</br>";
	$tmpForeign[$value][$row['COLUMN_NAME']] = array(
	    "table" => $row['REFERENCED_TABLE_NAME'],
	    "column" => $row['REFERENCED_COLUMN_NAME'],
	    "constraint" => $row['CONSTRAINT_NAME']);
    }

    $sql = "SELECT * FROM " . $value . ";";
    $result = mysqli_query($con, $sql);
    $fields = mysqli_field_count($con);
    for ($j = 0; $j < $fields; $j++) {
	$html .= "<tr><td";
	$name = mysqli_fetch_field_direct($result, $j)->name;
	if (in_array($name, $primaryKeys)) {
	    $html .= " class=\"primaryKey\"";
	} else if (isset($tmpForeign[$value]) && isset($tmpForeign[$value][$name])) {
	    $html .= " class=\"foreignKey\"";
	}

	$html .= ">" . $name . "</td></tr>";
    }

    $html .= "</tbody></table>";
    if(isset($tmpForeign)){
	$data = $data + $tmpForeign;
    }
}



mysqli_close($con);

echo json_encode(array('html' => $html, 'data' => $data));
?>

<?php
$db = strval($_POST["db"]);
$con = mysqli_connect('127.0.0.1', 'test1', 'test1', $db);
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
    $html = "<table id=\"" . $tableName . "\" class=\"table\">"
	    . "<thead><tr><th>" . $tableName . "</th></tr></thead><tbody>";

    $sql = "SHOW KEYS FROM " . $tableName . " WHERE Key_name = 'PRIMARY'";
    $result = mysqli_query($con, $sql);
    $primaryKeys = array();
    while ($row = mysqli_fetch_array($result)) {
	//echo "\t primarykey: " . $row['Column_name'] . "</br>";
	$primaryKeys[] = $row['Column_name'];
    }
    //$sql = "SELECT * FROM information_schema.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_NAME = '" . $value ."'";
    $sql = "SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME "
	    . "FROM information_schema.KEY_COLUMN_USAGE WHERE CONSTRAINT_SCHEMA  = '" . $db . "' AND TABLE_NAME = '"
	    . $tableName . "' AND REFERENCED_TABLE_NAME IS NOT NULL";
    $result = mysqli_query($con, $sql);
    $tmpForeign;
    while ($row = mysqli_fetch_array($result)) {
	//echo "\t foreignkey: " . $row['COLUMN_NAME'] . " ref to: " . $row['REFERENCED_TABLE_NAME'] . " -> " . $row['REFERENCED_COLUMN_NAME'] . "</br>";
	$tmpForeign[$tableName][$row['COLUMN_NAME']] = array(
	    "table" => $row['REFERENCED_TABLE_NAME'],
	    "column" => $row['REFERENCED_COLUMN_NAME'],
	    "constraint" => $row['CONSTRAINT_NAME']);
    }

    $sql = "SELECT * FROM " . $tableName . "";
    $result = mysqli_query($con, $sql);
    $fields = mysqli_field_count($con);
    for ($j = 0; $j < $fields; $j++) {
	$html .= "<tr><td";
	$name = mysqli_fetch_field_direct($result, $j)->name;
	if (in_array($name, $primaryKeys)) {
	    $html .= " class=\"primaryKey\"";
	} else if (isset($tmpForeign[$tableName]) && isset($tmpForeign[$tableName][$name])) {
	    $html .= " class=\"foreignKey\"";
	}

	$html .= ">" . $name . "</td></tr>";
    }

    $html .= "</tbody></table>";
	echo json_encode(array('tableHTML' => $html, 'tableName' => $tableName));
} else {
  echo "Error creating table: " . mysqli_error($con);
}
mysqli_close($con);

?>
<?php
if ($_POST["table1"] && $_POST["field1"] && $_POST["table2"] && $_POST["field2"] && $_POST["constraint"] && $_POST["db"]) {
    $table1 = preg_replace("/[^a-zA-Z0-9_]+/", "", strval($_POST["table1"]));
    $field1 = preg_replace("/[^a-zA-Z0-9_]+/", "", strval($_POST["field1"]));
    $table2 = preg_replace("/[^a-zA-Z0-9_]+/", "", strval($_POST["table2"]));
    $field2 = preg_replace("/[^a-zA-Z0-9_]+/", "", strval($_POST["field2"]));
    $constraint = preg_replace("/[^a-zA-Z0-9_]+/", "", strval($_POST["constraint"]));
    $db = preg_replace("/[^a-zA-Z0-9_]+/", "", strval($_POST["db"]));
    
    $con = mysqli_connect('127.0.0.1', 'test1', 'test1', $db);
    if ($con->connect_errno) {
	echo json_encode(array('error' => "Connect failed: " . $con->connect_error));
	exit();
    }
    $sql = "ALTER TABLE `".$table1."` ADD CONSTRAINT `".$constraint."` FOREIGN KEY (`".$field1."`) REFERENCES `".$db."`.`".$table2."`(`".$field2."`) ON DELETE RESTRICT ON UPDATE CASCADE;";
    //$sql = "ALTER TABLE `" . $table . "` DROP FOREIGN KEY `" . $constraint . "`;";
     
    if($con->query($sql) === TRUE){
	echo json_encode(array('success' => "jupp"));
    }else{
	echo json_encode(array('error' => $con->error));
    }
    $con->close();

}
//ALTER TABLE `test1` ADD CONSTRAINT `fdghfdgh` FOREIGN KEY (`test2`) REFERENCES `dbviz`.`contract`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
//ALTER TABLE `table1` ADD CONSTRAINT `constraint` FOREIGN KEY (`field1`) REFERENCES `db`.`table2`(`field2`) ON DELETE RESTRICT ON UPDATE CASCADE;"
?>
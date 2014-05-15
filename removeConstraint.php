<?php

if ($_POST["table"] && $_POST["constraint"] && $_POST["db"]) {
    $table = preg_replace("/[^a-zA-Z0-9_]+/", "", strval($_POST["table"]));
    $constraint = preg_replace("/[^a-zA-Z0-9_]+/", "", strval($_POST["constraint"]));
    $db = preg_replace("/[^a-zA-Z0-9_]+/", "", strval($_POST["db"]));
    $con = mysqli_connect('127.0.0.1', 'test1', 'test1', $db);
    if ($con->connect_errno) {
	echo json_encode(array('error' => "Connect failed: " . $con->connect_error));
	exit();
    }

    $sql = "ALTER TABLE `" . $table . "` DROP FOREIGN KEY `" . $constraint . "`;";
     
    if($con->query($sql) === TRUE){
	echo json_encode(array('success' => "jupp"));
    }else{
	echo json_encode(array('error' => $con->error));
    }
    $con->close();

}
?>

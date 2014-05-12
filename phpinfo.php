<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head><title>none</title>
</head>
<body>
<div id="c2">
<div id="c">
<?php
    if($_POST["choices"]){
	$array = $_POST["choices"];
	foreach($array as $v){
	    echo $v;
	}
    }
    
?>

</div>
</div>
</body>
</html>
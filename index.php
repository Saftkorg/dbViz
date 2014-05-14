<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <title>dbViz</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">  
        <link rel="stylesheet" href="css/index.css" />
        <link rel="stylesheet" href="css/ui-lightness/jquery-ui-1.10.4.css" />
        <script src="js/jquery-1.10.2.js"></script>
        <script src="js/jquery-ui-1.10.4.js"></script>
        <script src="js/index.js"></script>
    </head>
    <body>
	<table>
	    <tr>
		<td>
		    <form>
			<select name="dbs" onchange="showTables(this.value)">
			    <option value="">Select a database</option>
			    <?php
			    $con = mysqli_connect('127.0.0.1', 'test1', 'test1', 'dbviz');
			    if (!$con) {
				die('Could not connect: ' . mysqli_error($con));
			    }
			    $sql = "SHOW DATABASES";
			    $result = mysqli_query($con, $sql);
			    while ($row = mysqli_fetch_array($result)) {
				echo "<option value=\"" . $row[0] . "\">" . $row[0] . "</option>";
			    }
			    /*
			     * To change this license header, choose License Headers in Project Properties.
			     * To change this template file, choose Tools | Templates
			     * and open the template in the editor.
			     */
			    ?></select>
		    </form></td>
		<td>
		    <button id="create-database">New Database</button>
		</td>
		<td>
		    <button id="create-table">New Table</button>
		</td>

	    </tr>
	</table>
	<div id="database-dialog" title="Create new database">
	    <form action="createdatabase.php" method="post">
		<fieldset>
		    <label for="name">Name</label>
		    <input type="text" name="name" class="name text ui-widget-content ui-corner-all">
		</fieldset>
		<input type="submit">
	    </form>
	</div>

	<div id="table-dialog" title="Create new table">
	    <!--p class = "validateTips">All form fields are required.</p-->

	    <form action="createtable.php" method="post">
		<fieldset>
		    <label for="name">Name</label>
		    <input type="text" name="name" class="name ui-widget-content ui-corner-all" />
		    <label for="numColumns">Number of columns</label>
		    <input type="number" min="0" step="1"  />
		</fieldset>
		<input type="submit">
	    </form>
	</div>
        <br>
        <div id="container" onmousewheel="scroll(event);" >

	    <svg id="svgContainer" style="zoom:1;">
	    <g id="svgGroup" style="-webkit-transform: translate(0px, 0px);">
	    </g>
	    </svg>
	    <div id="txtCont" style="zoom:1;-webkit-transform: translate(0px, 0px);">
		<table style="width: 200px;">
		    <tbody>
			<tr>
			    <td><b>Choose a database</b></td>
			</tr>
		    </tbody>
		</table>
		<div id="menuContainer">
		    <ul id="menu">
			
		    </ul>
		</div>
	    </div>


            <div id="underlay" onmouseout="stopDrag();" onmousedown="startDrag(event);" onmousemove="duringDrag(event);" onmouseup="stopDrag();"></div>
        </div>
        <div id="status" onclick="testPost();" style="width: 100px; height: 50px; background-color: red;"></div>
    </body>
</html> 
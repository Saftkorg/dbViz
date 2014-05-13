/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mouseOrgXY = [0.0, 0.0];
var transXY = [0.0, 0.0];
var mouseDown = false;
var constraints = [];
function startDrag(e) {
    e.preventDefault();
    var myDiv = document.getElementById("txtCont");
    mouseOrgXY[0] = e.clientX;
    mouseOrgXY[1] = e.clientY;
    var XY = myDiv.style.webkitTransform.replace(/[^-\d,]/g, '').split(",");
    transXY[0] = parseInt(XY[0]);
    transXY[1] = parseInt(XY[1]);
    mouseDown = true;
}
function duringDrag(e) {
    if (mouseDown) {
	e.preventDefault();
	var myDiv = document.getElementById("txtCont");
	var mySvg = document.getElementById("svgGroup");
	var zoom = parseFloat(myDiv.style.zoom);
	myDiv.style.webkitTransform = "translate(" +
		Math.round(transXY[0] + (1 / zoom) * (e.clientX - mouseOrgXY[0])) + "px," +
		Math.round(transXY[1] + (1 / zoom) * (e.clientY - mouseOrgXY[1])) + "px)";
	mySvg.style.webkitTransform = myDiv.style.webkitTransform;
    }
}
function stopDrag() {
    if (mouseDown) {
	mouseDown = false;

    }
}
function scroll(e) {
    var myDiv = document.getElementById("txtCont");
    var mySvg = document.getElementById("svgContainer");
    var zoom = parseFloat(myDiv.style.zoom);
    if (e.wheelDeltaY < 0) {
	zoom = (zoom - 0.1) % 10;
    } else {
	zoom = (zoom + 0.1);
	if (zoom > 10) {
	    zoom = 10;
	}
    }

    myDiv.style.zoom = zoom;
    mySvg.style.zoom = zoom;
}
function showTables(str) {
    if (str === "") {
	document.getElementById("txtCont").innerHTML = "";
	return;
    }
    $.post(
	    "gettables.php",
	    {'q': str},
    function(data) {
	var response = jQuery.parseJSON(data);
	$("#txtCont").html(response.html);
	$.each(response.data, function(table1, value) {
	    $.each(value, function(field1, tableField) {
		var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		newLine.setAttribute('x1', '0');
		newLine.setAttribute('y1', '0');
		newLine.setAttribute('x2', '0');
		newLine.setAttribute('y2', '0');
		$("#svgGroup").append(newLine);

		if (!(table1 in constraints)) {
		    constraints[table1] = new Array();
		}
		if (!(field1 in constraints[table1])) {
		    constraints[table1][field1] = new Array();
		}
		//$('#' + table1).data(field1, {
		constraints[table1][field1].push({
		    'x': newLine.attributes.x1,
		    'y': newLine.attributes.y1,
		    'x2': newLine.attributes.x2,
		    'line': newLine,
		    'table': tableField[0],
		    'field': tableField[1]});
		//$('#' + tableField[0]).data(tableField[1]).append( {

		if (!(tableField[0] in constraints)) {
		    constraints[tableField[0]] = new Array();
		}
		if (!(tableField[1] in constraints[tableField[0]])) {
		    constraints[tableField[0]][tableField[1]] = new Array();
		}

		constraints[tableField[0]][tableField[1]].push({
		    'x': newLine.attributes.x2,
		    'y': newLine.attributes.y2,
		    'x2': newLine.attributes.x1,
		    'line': newLine,
		    'table': table1,
		    'field': field1});
	    });
	});
	$('#txtCont table').draggable({
	    scroll: true,
	    snap: true,
	    drag: function(event) {
		var parentPos = $(this).position();
		var parent = this;
		$("#" + this.id + " .foreignKey, #" + this.id + " .primaryKey").each(function(index) {

		    //var tableData = $(parent).data($(this).text());
		    if (parent.id in constraints && $(this).text() in constraints[parent.id]) {
			var field = $(this).position();
			var width = $(this).width() / 2;
			var tmp = constraints[parent.id][$(this).text()];
			for (key in tmp) {
			    var tableData = tmp[key];
			    if (parseInt(tableData.x2.value) > (width + parseInt(tableData.x.value))) {
				tableData.x.value = (parentPos.left + field.left + (width * 2));
			    } else {
				tableData.x.value = (parentPos.left + field.left);
			    }

			    tableData.y.value = (parentPos.top + field.top + 8);
			}


		    }

		});
		//$('line')[0].attributes.y1.value = (parentPos.top + elementPos.top + 8);
		//$('line')[0].attributes.x1.value = (parentPos.left + elementPos.left);
	    }});


	//constraints = constraints.concat(response.data);
    }
    );


//    if (window.XMLHttpRequest) {
//	// code for IE7+, Firefox, Chrome, Opera, Safari
//	xmlhttp = new XMLHttpRequest();
//    } else { // code for IE6, IE5
//	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//    }
//    xmlhttp.onreadystatechange = function() {
//	if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
//	    document.getElementById("txtCont").innerHTML = xmlhttp.responseText;
//	    $('#txtCont table').draggable({
//		drag: function(event) {
//		    $('#status').text(event.target.style.top);
//		    var line = $('line')[0];
//		    $('line')[0].attributes.y1.value = parseInt(event.target.style.top);
//		    $('line')[0].attributes.x1.value = parseInt(event.target.style.left);
//		    //$( 'line' ).x1 = event.clientX;
//		}});
//	}
//    };
//    xmlhttp.open("POST", "gettables.php" , true);
//    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//    xmlhttp.send("q=" + str);
}
function testPost() {
    var parentPos = $("#houses").position();
    var elementPos = $("#houses .foreignKey").position();
    $("#status").html("top " + (parentPos.top + elementPos.top) + " left " +
	    (parentPos.left + elementPos.left));
    /*
     var sendThis = {'choices[]':["jon","susan"]};
     var posting = $.post("phpinfo.php", sendThis);
     posting.done(function(data){
     var content =  $( data ).find("#c");
     var cont = $( "div" ).find("#status");
     $( "#status" ).append( content );
     });*/
}
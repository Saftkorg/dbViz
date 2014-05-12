/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mouseOrgXY = [0.0, 0.0];
var transXY = [0.0, 0.0];
var mouseDown = false;
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
    if (window.XMLHttpRequest) {
	// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
	    document.getElementById("txtCont").innerHTML = xmlhttp.responseText;
	    $('#txtCont table').draggable({
		drag: function(event) {
		    $('#status').text(event.target.style.top);
		    var line = $('line')[0];
		    $('line')[0].attributes.y1.value = parseInt(event.target.style.top);
		    $('line')[0].attributes.x1.value = parseInt(event.target.style.left);
		    //$( 'line' ).x1 = event.clientX;
		}});
	}
    };
    xmlhttp.open("GET", "gettables.php?q=" + str, true);
    xmlhttp.send();
}
function testPost(){
    var posting = $.post("phpinfo.php", {'choices[]':["jon","susan"]});
    posting.done(function(data){
	var content =  $( data ).find("#c");
	var cont = $( "div" ).find("#status");
	$( "#status" ).append( content );
    });
}
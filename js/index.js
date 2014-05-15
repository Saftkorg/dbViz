/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mouseOrgXY = [0.0, 0.0];
var transXY = [0.0, 0.0];
var mouseDown = false;
var constraints = [];
var db = "";
var addConstraint = false;

$(document).ready(function() {
    //var name = $("#name");
    $("#database-dialog").dialog({
	autoOpen: false,
	height: 300,
	width: 350,
	modal: true,
	close: function() {
	    //name.val("").removeClass("ui-state-error");
	    $("#database-dialog fieldset input").val("").removeClass("ui-state-error");
	}
    });


    //var name = $("#name"),
    //	    numColumns = $("#numColumns"),
    //	    allFields = $([]).add(name).add(numColumns);
    //     tips = $( ".validateTips" );
	var inputWrapper = $("#table-dialog fieldset");
	var addButton = $("#addButton");
	var x = inputWrapper.length;
	var fieldCount = 1;
	
	$(addButton).click(function() {
		fieldCount++;
		$(inputWrapper).append('Column Name: <input type="text" name="columnNames[]" class="name ui-widget-content ui-corner-all" /><br>'
		    + 'Column type: <input type="text" name="columnNames[]" class="name ui-widget-content ui-corner-all" /><br>');
		x++;
    });
	
    $("#table-dialog").dialog({
	autoOpen: false,
	height: 300,
	width: 300,
	modal: true,
	close: function() {

	    $( "#table-dialog fieldset input" ).val("").removeClass("ui-state-error");
		$("#table-dialog fieldset").empty();
		fieldCount = 1;
		$(inputWrapper).append('Column Name: <input type="text" name="columnNames[]" class="name ui-widget-content ui-corner-all" /><br>'
		    + 'Column type: <input type="text" name="columnNames[]" class="name ui-widget-content ui-corner-all" /><br>');

	}
	});
	
    $('#create-table').click(function() {
	$('#table-dialog').dialog('open');
    });

    $('#create-database').click(function() {
	$('#database-dialog').dialog('open');
    });

	$('#table-dialog form').submit(function(event) {
		$.ajax({
			type: 'POST',
			url: 'createtable.php',
			data: $(this).serialize()
			}).done(function(data) {
				var response = jQuery.parseJSON(data);
				if(typeof (response.tableHTML) != "undefined") {
					$(response.tableHTML).insertAfter("#menuContainer");
				} else {
					$("#status").html("Create Table Failed");
				}
			})
			
			;
		event.preventDefault();
		$("#table-dialog").dialog('close');
	});

});




function startDrag(e) {
    $("#menu").remove();
    addConstraint = false;
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

function enforceConstraint(table1,field1,table2,field2, constraint) {
    
    var parent1Pos = $('#'+table1).position();
    var parent2Pos = $('#'+table2).position();
    
    var child1 = $('#'+table1 + " td").filter(function(idx){
	return this.innerHTML == field1;
    });
    var child2 = $('#'+table2 + " td").filter(function(idx){
	return this.innerHTML == field2;
    });
    
    var child1Pos = $(child1[0]).position();
    var child2Pos = $(child2[0]).position();
    
    
    
    
    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.setAttribute('x1', (child1Pos.left));
    newLine.setAttribute('y1', (child1Pos.top));
    newLine.setAttribute('x2', (child2Pos.left));
    newLine.setAttribute('y2', (child2Pos.top));
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
	'table': table2,
	'field': field2,
	'constraint': constraint
    });
    //$('#' + tableField[0]).data(tableField[1]).append( {

    if (!(table2 in constraints)) {
	constraints[table2] = new Array();
    }
    if (!(field2 in constraints[table2])) {
	constraints[table2][field2] = new Array();
    }

    constraints[table2][field2].push({
	'x': newLine.attributes.x2,
	'y': newLine.attributes.y2,
	'x2': newLine.attributes.x1,
	'line': newLine,
	'table': table1,
	'field': field1,
	'constraint': constraint
    });
}

function showTables(str) {
    db = str;
	$('[name="db"]').val(db);
    $("g").empty();
    $("#txtCont table").remove();
    constraints = [];
    if (str === "") {
	$("txtCont").html("");
	return;
    }
    $.post(
	    "gettables.php",
	    {'q': str},
    function(data) {
	var response = jQuery.parseJSON(data);
	$("#txtCont").append(response.html);
	$.each(response.data, function(table1, value) {
	    $.each(value, function(field1, tableField) {
		enforceConstraint(table1,field1,tableField["table"],tableField["column"],tableField["constraint"]);
	    });
	});
	$('#txtCont table').draggable({
	    scroll: true,
	    snap: true,
	    drag: function(event) {
		$("#menu").remove();
		var parentPos = $(this).position();
		var parent = this;
		$("#" + this.id + " .foreignKey, #" + this.id + " .primaryKey").each(function(index) {

		    //var tableData = $(parent).data($(this).text());
		    if (parent.id in constraints && $(this).text() in constraints[parent.id]) {
			var field = $(this).position();
			var width = $(this).parent().width() / 2;
			var tmp = constraints[parent.id][$(this).text()];
			for (key in tmp) {
			    var tableData = tmp[key];

			    var x1 = parentPos.left;
			    if (parseInt(tableData.x2.value) > (width + parentPos.left)) {
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

	$("#txtCont td").click(function(event) {
	    if (addConstraint) {
		adConstraint(event.target.offsetParent.id, event.target.innerHTML);
		return;
	    }
	    $("#menu").remove();
	    $("#menuContainer").append("<ul id=\"menu\"></ul>");
	    if ($(this).hasClass("selected")) {
		$(this).toggleClass("selected");
		//hide menu?
	    } else {
		var selected = $(".selected");
		$(".selected").toggleClass("selected");
		$(this).toggleClass("selected");
		//$("#menu").append("<li><a href=\"#\">Remove constraint</a><ul>");
		var menuHtml = "<li><a >Remove constraint</a>";
		var table = event.target.offsetParent.id;
		var field = event.target.innerHTML;
		if (table in constraints && field in constraints[table] && constraints[table][field].length > 0) {
		    menuHtml += "<ul><li> ";
		    var tmpConst = constraints[table][field];
		    for (key in tmpConst) {
			var constEntry = tmpConst[key];
			menuHtml += "<a onclick=\"rmConstraint(event,\'" + table + "\',\'" + field + "\',\'" + constEntry.table + "\',\'" + constEntry.field + "\',\'" + constEntry.constraint + "\');\">" + constEntry.table + ":" + constEntry.field + "</a>";
		    }
		    ;
		    menuHtml += "</li> </ul>";
		}
		menuHtml += "</li><li><a onclick=\"adConstraint(\'" + table + "\',\'" + field + "\')\">Add constraint</a><li>";


		$("#menu").append(menuHtml);
		$("#menu").menu();
		var tmp = event;
		$("#menu").position({
		    my: "left top",
		    at: "right top",
		    of: event.target,
		    collision: "fit"
		});

		//show and move menu?
	    }
	});

	//constraints = constraints.concat(response.data);
    }
    );



}

function adConstraint(table2, field2) {
    if (addConstraint) {
	var table1 = $(".selected")[0].offsetParent.id;
	var field1 = $(".selected")[0].innerHTML;
	var constraint = table1 + "_" + field1 + "_" + table2 + "_" + field2;
	var sendThis = {
	    'table1': table1,
	    'field1': field1,
	    'table2': table2,
	    'field2': field2,
	    'db': db,
	    'constraint': constraint
	};
	var posting = $.post("addConstraint.php", sendThis, function(data) {
	    var response = jQuery.parseJSON(data);
	    if (typeof (response.success) != "undefined") {
		$("#"+table1+" td,#"+table2+" td").each(function(index){
		    var hellp = $(this).html();
		    if(($(this).html().localeCompare(field1)==0 || $(this).html().localeCompare(field2) == 0) && !$(this).hasClass("primaryKey")){
			$(this).addClass("foreignKey");
		    }
		});
		
		enforceConstraint(table1, field1, table2, field2, constraint);


		$("#status").html("success");
	    }
	});
    } else {
	$("#menu").remove();
    }
    addConstraint = !addConstraint;
}

function rmConstraint(event, table1, field1, table2, field2, constraint) {

    $("#status").append(table1 + field1 + constraint);

    //var rmConstraint = constraints[table][field][0]['constraint'];
    var sendThis = {'table': table1, 'constraint': constraint, 'db': db};
    var posting = $.post("removeConstraint.php", sendThis,
	    function(data) {
		var response = jQuery.parseJSON(data);
		if (typeof (response.success) != "undefined") {

		    $(event.target).remove();
		    var tmpConst = constraints[table1][field1];
		    var index = -1;
		    for (key in tmpConst) {
			if (tmpConst[key].constraint == constraint) {
			    $(tmpConst[key].line).remove();
			    index = key;
			}
		    }
		    if (index != -1) {
			constraints[table1][field1].splice(index, 1);
		    }
		    tmpConst = constraints[table2][field2];
		    index = -1;
		    for (key in tmpConst) {
			if (tmpConst[key].constraint == constraint) {
			    index = key;
			}
		    }
		    if (index != -1) {
			constraints[table2][field2].splice(index, 1);
		    }
		    $("#status").html("yeay");
		} else {
		    sendThis['table'] = table2;
		    $.post("removeConstraint.php", sendThis,
			    function(data) {
				var response = jQuery.parseJSON(data);
				if (typeof (response.success) != "undefined") {
				    $(event.target).remove();
				    var tmpConst = constraints[table1][field1];
				    var index = -1;
				    for (key in tmpConst) {
					if (tmpConst[key].constraint == constraint) {
					    $(tmpConst[key].line).remove();
					    index = key;
					}
				    }
				    if (index != -1) {
					constraints[table1][field1].splice(index, 1);
				    }
				    tmpConst = constraints[table2][field2];
				    index = -1;
				    for (key in tmpConst) {
					if (tmpConst[key].constraint == constraint) {
					    index = key;
					}
				    }
				    if (index != -1) {
					constraints[table2][field2].splice(index, 1);
				    }

				    $("#status").html("yeay");
				}
			    });
		}
	    });

}
function testPost() {
    $("#status").append("yeay");


    //$( "#menu" ).append("<li>test <ul><li>test1</li> </ul> </li>");
    //$( "#menu" ).menu();

    /*
     var parentPos = $("#houses").position();
     var elementPos = $("#houses .foreignKey").position();
     $("#status").html("top " + (parentPos.top + elementPos.top) + " left " +
     (parentPos.left + elementPos.left));
     */
    /*
     var sendThis = {'choices[]':["jon","susan"]};
     var posting = $.post("phpinfo.php", sendThis);
     posting.done(function(data){
     var content =  $( data ).find("#c");
     var cont = $( "div" ).find("#status");
     $( "#status" ).append( content );
     });*/
}
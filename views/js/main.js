// jquery's way of doing window.onload
$( main );

var prevTime = 0;
var deltaTime = 0;
var winWidth = $(window).width();
var totalParticle = 10;//winWidth / 100 * 2;
var activeParticle = 0;

var ParticlePool = [];
var ParticleWind = 0; //the wind class

var KOI_DRINKS = {
	"Mini Yam Milk Tea"                 : "res/miniyam.jpg",
	"Mini Yam Grass Milk Tea"           : "res/miniyam.jpg",
	"Mini Yam Green Milk Tea"           : "res/miniyam.jpg",
	"Mini Yam Grass Green Milk Tea"     : "res/miniyam.jpg",
	"Oolong Milk Tea"                   : "res/oolong.JPG",
	"Oolong Macchiato"                  : "res/oolong.JPG",
	"Oolong Tea"                        : "res/oolong.JPG",
	"Ice Cream Hazelnut Milk Tea"       : "http://www.koicafe.com/upload/teaen/s_1306101458141.jpg",	
	"Peach Macchiato"                   : "http://www.koicafe.com/upload/teaen/s_1306101352421.jpg",
	"Passion Fruit Macchiato"           : "http://www.koicafe.com/upload/teaen/s_1306101119521.jpg",
	"Mango Macchiato"                   : "http://www.koicafe.com/upload/teaen/s_1306101118231.jpg",
	"Grass Jelly Milk Tea"              : "http://www.koicafe.com/upload/teaen/s_1207230411261.jpg",
	"IceCream Milk tea"                 : "http://www.koicafe.com/upload/teaen/s_1306110915371.jpg",
	"Honey Milk Tea"                    : "http://www.koicafe.com/upload/teaen/s_1306110915371.jpg",
	"Green Tea Machiato"                : "http://www.koicafe.com/upload/teaen/s_1306110916091.jpg",
	"Black Tea Machiato"                : "http://www.koicafe.com/upload/teaen/s_1306110915371.jpg",
	"Honey Juice"                       : "http://www.koicafe.com/upload/teaen/s_1212140110101.jpg",
	"Honey Lemon Juice"                 : "http://www.koicafe.com/upload/teaen/s_1212160837051.jpg",
	"Green Milk Tea"                    : "http://www.koicafe.com/upload/teaen/s_1207230419581.jpg",
	"Milk Tea"                          : "http://www.koicafe.com/upload/teaen/s_1207230419581.jpg",
	"Hazelnut Milk Tea"                 : "http://www.koicafe.com/upload/teaen/s_1306101458141.jpg",
	"Chocolate Milk Tea"                : "http://www.koicafe.com/upload/teaen/s_1207230417341.jpg",
	"Passion Ai Yu"                     : "http://www.koicafe.com/upload/teaen/s_1306110915371.jpg",
	"Honey Green Tea"                   : "http://www.koicafe.com/upload/teaen/s_1207230406231.jpg",
	"Green Tea With Grass Jelly"        : "http://www.koicafe.com/upload/teaen/s_1212100034541.jpg",
	"Café Macchiato(Medium)"            : "http://www.koicafe.com/upload/teaen/s_1306110915371.jpg",
	"Ice Cream Café Latte"              : "http://www.koicafe.com/upload/teaen/s_1212092251191.jpg",
	"KOI Café Hot"                      : "http://www.koicafe.com/upload/teaen/s_1207230421161.jpg",
	"Caramel Macchiato HOT!"            : "http://www.koicafe.com/upload/teaen/s_1207230420241.jpg",
	"Cappuccino HOT!"                   : "http://www.koicafe.com/upload/teaen/s_1207230420491.jpg",
	"Ice Cream Cappuccino"              : "http://www.koicafe.com/upload/teaen/s_1212092346051.jpg",
	"Yakult Green Tea"                  : "http://www.koicafe.com/upload/teaen/s_1207230409151.jpg",
	"Yakult Green Tea With Grass Jelly" : "http://www.koicafe.com/upload/teaen/s_1207230409151.jpg"
};

// specify dom ids here and use dom.get to get them using jquery so they can be manipulated
var dom = {
    currentOrdersTable: "current_orders",
    drinkMenuTable: "drink_menu",
    totalText: "total",
    orderDrink: "order_drink",
	rankMenu: "rank_menu",
	rankSugarMenu: "rank_sugar_menu",
	orderForm: "order_form",
	orderAlertBox: "order_alert",
    navBarTabContent: [ "home_content",
						"menu_content",
                        "ranking_content",
                        "ranking_sugar_content",
						"ranking_drink_content",
                        "about_content" ],
    get: function( szID ){
        return $('#'+szID);
    }
};

function randomizeTopDrink()
{
		var index = Math.floor((Math.random()*$("#order_drink option").length));
		$("#order_drink").val(String(index));
		$("#order_drink").trigger('change');
		var szSelected = $("#order_drink option:selected").attr( "name" );
		var selIndex = $("#order_drink option:selected").val();
		console.log("Selected: " + szSelected);
		console.log("SelectedIndex: " + selIndex);
}

// main function, called when window is loaded
function main(){
    console.log( "Koi Cafe initialize");

	
    asyncGetDrinkMenu( updateDrinkMenu, updateOrderForm );
    /*
    asyncGetCurrentOrders( updateCurrentOrders );	
    
	asyncGetRankMenu( updateRankMenu );
	asyncGetRankSugarMenu( updateRankSugarMenu );
	asyncGetRankDrinkMenu( updateRankDrinkMenu );
	
	var orderDrink = dom.get( dom.orderDrink );
	orderDrink.change( function (envObj) {
		var szSelected = $("#order_drink option:selected").attr( "name" )
		var selIndex = $("#order_drink option:selected").val();
		$("#curr-drink-img").attr("src", KOI_DRINKS[szSelected]);
		console.log(szSelected);
		console.log(selIndex);
		//console.log(envObj);
	});

	$(document).ready( function() {
		
		$("#curr-drink-img").attr("src", KOI_DRINKS["Mini Yam Milk Tea"]);
		//$('#order_drink').val('2');
		//$("#order_drink option")[10].attr('selected', 'selected');
		//$('select#order_drink')[0].selectedIndex = 10;
		console.log( "Koi Cafe Ready");
	});
	
	function GetSelectedOptionText(idname) {
		return $('#'+idname+' option:selected').text();
	}

	function GetSelectedOption(idname) {
		return $('#'+idname+' option:selected');
	}
	
	$orderForm = dom.get( dom.orderForm );
	$orderAlertBox = dom.get( dom.orderAlertBox );
	$orderForm.find("input[type=submit]").click( function( e ){
		e.preventDefault();
		
		var szImgName = GetSelectedOption("order_drink").attr('name');
		
		var prompt = "Please Confirm your Order<br><br>";
		prompt += "<img width='180' height='180' src='" + KOI_DRINKS[szImgName]  + "'><br>";
		prompt += GetSelectedOption("order_drink").attr('name')   + "<br>";
		prompt += GetSelectedOptionText("order_size")    + "<br>";
		prompt += GetSelectedOptionText("order_sugar")   + "%<br>";
		prompt += GetSelectedOptionText("select_ice_level") + "<br>";
		prompt += GetSelectedOptionText("select_pearl_level") + "<br>";
	
		bootbox.confirm(prompt, function(result) {
			console.log("Confirm result: "+result);
			if (result) 
			{
				$.post( $orderForm.attr("action"), $orderForm.serialize() )
				.always( function() {
					$orderAlertBox.find("#order_alert_content").html( "<p>Sending your order! ^^V</p>" );
					$orderAlertBox.show();
				})
				.done( function( data ){
					//console.log( data.search(/rejected/i) );
					$orderAlertBox.removeClass("alert-danger");
					$orderAlertBox.removeClass("alert-success");
					if ( data.search(/rejected/i) > 0 ){
						$orderAlertBox.addClass("alert-danger");
					} else if ( data.search(/success/i) > 0 ){
						$orderAlertBox.addClass("alert-success");
					}
					$orderAlertBox.find("#order_alert_content").html( data );
					setTimeout( function(){ // seems like db not updated immediately?
						dom.get( dom.currentOrdersTable ).find("td").remove(); // clear the current orders
						asyncGetCurrentOrders( updateCurrentOrders );	
					}, 1000 );
				})
				.fail( function( jqXHR, textStatus ){
					$orderAlertBox.removeClass("alert-success");
					$orderAlertBox.addClass("alert-danger");
					$orderAlertBox.find("#order_alert_content").html( textStatus );
				});	
			}
		});
	});

	$('.navbar li a').click(function(e) {
        $('.navbar li.active').removeClass('active');
        var $this = $(this);
        var $li = $this.parent();
        if (!$li.hasClass('active')) {
            $li.addClass('active');
            changeNavTabContent( $li.index() );
        }
        e.preventDefault();
    });

    changeNavTabContent( 0 ); //home
	
	ParticleWind = GenerateWind();
	
	(function FrameLoop(timestamp) {
		deltaTime = timestamp - prevTime;
		prevTime = timestamp;
		
		//$('#debug').text('FPS: ' + deltaTime);
		ParticleWind.update(deltaTime);
		
		ParticlePool.forEach(function (element) {
			element.Update();
		});
		requestAnimationFrame(FrameLoop); 
	})();
	
	// spawn particles
	var id = setInterval(function() {
		if (activeParticle < totalParticle) {
			spawnParticle();
		}
		else {
			clearInterval(id);
		}
	}, 1000);	
    */
}


function changeNavTabContent( nTabIndex ){
    $( ".row.content" ).hide();
    dom.get( dom.navBarTabContent[ nTabIndex ] ).show();
}

//----- dom functions -----
function addRowToCurrentOrders( name, drink, size, price, sugar_level, pearl_level, ice_level, date){
    var table = dom.get( dom.currentOrdersTable );
    var tableRow = $('<tr>');
    tableRow.append( $('<td>').text( name ) );
    tableRow.append( $('<td>').text( drink ) );
    tableRow.append( $('<td>').text( size ) );
    tableRow.append( $('<td>').text( price ) );
    tableRow.append( $('<td>').text( sugar_level ) );
    tableRow.append( $('<td>').text( pearl_level ) );
    tableRow.append( $('<td>').text( ice_level ) );
    tableRow.append( $('<td>').text( date ) );
    if ( name == username ) {
        tableRow.addClass( "success" );
    }
    table.append( tableRow );
}

function updateCurrentOrders( data ){
    var sum = 0;
		var cups = 0;
    for ( var i = 0, len = data.length; i < len; ++i ) {
        var row = data[i];
        sum += parseFloat( row.price );
				cups++;
        addRowToCurrentOrders( row.fk_player_name, row.order_name, row.size, row.price, row.sugar_level, row.pearl_level, row.ice_level, row.date );
    }
    updateCurrentOrdersSum( cups , sum);
}

function updateCurrentOrdersSum( cups , sum){
    var total = 10;
    var totalString = "Total Cups: " + cups + " / " + total + " (minimum orders)";
		var sumString = "Total Sum: ${0}";
    sumString = sumString.format( sum.toFixed(2), sum.toFixed(2) );
    var totalText = dom.get( dom.totalText );
	
	if (cups < total) {
		totalText.css('color', 'red');
		totalString += "<br>(Need more Orders!)";
	} else {
		totalText.css('color', 'green');
		totalString += "<br>(Ready to Send Order! by 2pm)";
	}
	sumString += '<br>' + totalString;
	totalText.append( sumString );
}

function addRowToDrinkMenu( name, medium_price, large_price ){
    var table = dom.get( dom.drinkMenuTable );
    var tableRow = $('<tr>');
    tableRow.append( $('<td>').text( name ) );
    tableRow.append( $('<td>').text( medium_price ) );
    tableRow.append( $('<td>').text( large_price ) );
    table.append( tableRow );
}

function updateDrinkMenu( data ){
    for ( var i = 0, len = data.length; i < len; ++i ) {
        var row = data[i];
        addRowToDrinkMenu( row.name, row.medium_price, row.large_price );
    }
}

function updateOrderForm( data ){
    var drink_select = dom.get( dom.orderDrink );
    console.log(data);
    for ( var i = 0, len = data.length; i < len; ++i ) {
        var row = data[i];
        var option = $("<option value='" + i + "'>");
        option.text( row.name + " ( M: $" + row.medium_price.toFixed(2) + " / L: $" + row.large_price.toFixed(2) + " )" );
				option.attr('name', row.name);
        drink_select.append( option );
    }
		
		randomizeTopDrink();
}

//----- ajax functions -----
function asyncGetCurrentOrders(){
    var callbacks = arguments;
    $.ajax({
        type: "GET",
        url: "orders.php",
        data: {
            action: "current_orders"
        }
    })
    .done(
        function( json ){
            var data = $.parseJSON( json );
            for ( var i = 0, len = callbacks.length; i < len; ++i ) {
                callbacks[i]( data );
            }
        }
    );
}

function asyncGetDrinkMenu(callback1, callback2){
    $.ajax({
        type: "GET",
        url: "/koi/menu"
    })
    .done(
        function( json ){
            var data = $.parseJSON( json );
            callback1(data);
            callback2(data);
        }
        
    );
}

/**
 * Arg[0] string: dom name 
 * Arg[1-xxx] json fields to be inserted
 */
function addRowToTable()
{
	var szDomName = arguments[0];

	var table = $('#'+szDomName);
	var tableRow = $('<tr>');
	//console.log("Arguments: " + arguments[1]);
	for (var i = 1; i < arguments.length; i++) {
		tableRow.append( $('<td>').text( arguments[i] ) );
	}

	table.append( tableRow );
}

function updateRankMenu( data ){
	//console.log("Updating Table : " + data);

	for ( var i = 0, len = data.length; i < len; ++i ) {
		var row = data[i];
		addRowToTable( "rank_menu", row.num, row.name, row.total_spent );

		//console.log(data[i]);
	}
}

function updateRankDrinkMenu( data ){
	console.log("Updating Table : " + data);
	
	for ( var i = 0, len = data.length; i < len; ++i ) {
		var row = data[i];
		addRowToTable( "ranking_drink_menu", row.num, row.order_name, row.total );
		
		//console.log(data[i]);
	} 
}


function updateRankSugarMenu( data ){
	//console.log("Updating Table : " + data);

	var Sugar =  [];
	var Cups = [];
	var AvgSugar = [];


	for ( var i = 0, len = data.length; i < len; ++i ) {
		var row = data[i];

		var playername = data[i][1];
		var sugarlvls = parseInt( data[i][5] );

		if( undefined == Cups[ playername ] )
		{	Cups[ playername ] = 0;
		}
		if( undefined == Sugar[ playername ] )
		{	Sugar[ playername ] = 0;
		}

		Sugar[ playername ] += sugarlvls;
		Cups[ playername ] += 1;

	}

	//calculate average sugar levels
	for(var i in Sugar)
	{	AvgSugar.push( Array(i, (Sugar[i] / Cups[i]).toFixed(2)) );
	}
	AvgSugar.sort(function(a,b){return b[1]-a[1]});
	//console.log(AvgSugar);

	for(var i in AvgSugar)
	{	var rank = parseInt(i) + 1;
		var name = AvgSugar[i][0];
		var sugarrushToxicity = AvgSugar[i][1];
		var sugarfrenzy = Sugar[name];
		addRowToTable( "rank_sugar_menu", rank, name, sugarrushToxicity, sugarfrenzy);

		//console.log(rank + ' ' + name + ' ' + sugarrushToxicity + ' ' + sugarfrenzy);
	}

}


//----- ajax functions -----
function asyncGetRankMenu(){
	console.log("Getting rank");
	var callbacks = arguments;
	$.ajax({
		type: "GET",
		url: "get_rank.php",
		data: {
			action: "global"
		}
	})
	.done(
		function( json ){
			//console.log("json return" + json);
			var data = $.parseJSON( json );
			for ( var i = 0, len = callbacks.length; i < len; ++i ) {
				callbacks[i]( data );
			}
		}
	);
}

function asyncGetRankDrinkMenu(){
	console.log("Getting rank Drink");
	var callbacks = arguments;
	$.ajax({
		type: "GET",
		url: "get_rank.php",
		data: {
			action: "drink"
		}
	})
	.done(
		function( json ){
			console.log("json return" + json);
			var data = $.parseJSON( json );
			for ( var i = 0, len = callbacks.length; i < len; ++i ) {
				callbacks[i]( data );
			}
		}
	);
}

function asyncGetRankSugarMenu(){
	console.log("Getting rank Sugar");
	var callbacks = arguments;
	$.ajax({
		type: "GET",
		url: "get_rank_sugar.php",
		data: {
			action: "current_orders"
		}
	})
	.done(
		function( json ){
			//console.log("json return" + json);
			var data = $.parseJSON( json );
			for ( var i = 0, len = callbacks.length; i < len; ++i ) {
				callbacks[i]( data );
			}
		}
	);
}

function OpenChatWindow()
{
	var win = window.open(
	  'http://tks-ericlan/koitest/chat.php',
	  '_blank' 
	)
	win.focus();
}

//----- extra prototype -----
String.prototype.format = function () {
  var args = arguments;
  return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
    if (m == "{{") { return "{"; }
    if (m == "}}") { return "}"; }
    return args[n];
  });
};



var Particle = function(pos, vel, img) {
	
	// public
	this.Position = pos;
	this.Velocity = vel;
	this.Image = img;
	this.Accel = 0;

	// local var
	var $div = $('<div>');
	var $img = $('<img>');

	this.SetPosition = function(pos) {
		this.Position = pos;
		$div.css('left', pos.x);
		$div.css('top', pos.y);
	}
	
	this.SetVelocity = function(vel) {
		this.Velocity = vel;
		
		//get additional velocity from acceleration due to wind
		this.Accel += ParticleWind.modifyVelDueToWind(this.Position.x);
	
	}

	this.Update = function() {
		this.Position.x += this.Velocity.x;
		this.Position.y += this.Velocity.y;
		$div.css('left', this.Position.x);
		$div.css('top', this.Position.y);
		if ( this.Position.y < 0 ){
			var r = "rotate({0}deg)".format( parseInt( randRange(0, 360) ) );
			$img.css({
				"transform": r,
				"-ms-transform": r,
				"-webkit-transform": r
			})
		}
		
		var winWidth  = $(window).width();
		var winHeight = $(window).height();
		//if (this.Position.x < 0 || this.Position.x > winWidth) {
		//	this.Velocity.x = -this.Velocity.x;
		//}						
		//
		//if (this.Position.y < 0 || this.Position.y > winHeight) {
		//	this.Velocity.y = -this.Velocity.y;
		//}
		
		if (this.Position.y > winHeight) {
			this.Position.x = Math.random() * winWidth;
			this.Position.y = -5;
		}
	}

	$div.attr({
		"z-index": -10,
		"left": this.Position.x,
		"top": this.Position.y,
		"width": img.width,
		"height": img.height
	});
	
	$div.click( function(){ console.log("hey"); } );
	$div.off( "click" ); // remove click event listener
	$div.off( "drag" );
	
	$div.addClass( "sakura" );
	
	$img.attr('src', img.url);
	$div.append($img);
	//$div.append("<h1>hello</h1>");
	$('body').append($div);
};
		
function spawnParticle() 
{
	var spawn = Math.floor(Math.random() * 4) + 1;
	activeParticle += spawn;
	console.log("spawn: " + spawn);
	for (var i = 0; i < spawn; ++i) {
		var posx = Math.random() * winWidth;
		var posy = - ( Math.random() * 10 );
		
		//var vx = Math.random() * 2 - 1;
		var vx = 0;
		var vy = Math.random() * 1 + 0.5;
		var path ="res/flower.png";
		var newParticle = new Particle(
			{ x: posx, y: posy}, { x: vx, y: vy }, {url: path, width:24,height:24});
	
		ParticlePool.push(newParticle);
		//$('#debug').text('Total Objects: ' + ParticlePool.length);
		
		//console.log("addeding");
	}
}
	
function randRange(min, max) {
    return Math.random() * (max - min) + min;
}

function GenerateWind()
{	
	this.windMax = 100;
	this.windMid = 50;
	this.TimeBeforeDraftChange = 1000;
	this.TotalTimeBeforeDraftChange = 1000;
	this.WindMagnitude = 2.5;
	this.windDir = 1;

	this.update = function( deltaTime )
	{	if(this.TimeBeforeDraftChange <= 0)
		{	this.rerollWind();
		}else
		{	this.TimeBeforeDraftChange -= deltaTime; 
			
			if(Math.random() < 0.05)
			{
				//console.log('wind updating ' + TimeBeforeDraftChange);
			}
		}
	}

	this.rerollWind = function()
	{
		var winWidth  = $(window).width();
		var winHeight = $(window).height();
		this.windMax = Math.random() * winHeight ;
		this.windMin = windMax - Math.random()-winHeight;
		this.TimeBeforeDraftChange = (Math.random() * 10 )* 1000;
		this.TotalTimeBeforeDraftChange = this.TotalTimeBeforeDraftChange;
		this.windMagnitude = 2.0 + Math.random();
		this.windDir = (Math.random() > 0.5) ? 1 : -1;
		
		console.log('wind Rerolled with max '+this.windMax+' min '+this.windMid+' time left '+this.TimeBeforeDraftChange+ ' magnitude '+this.windMagnitude+' dir '+this.windDir); 
	}
	this.rerollWind();

	this.modifyVelDueToWind = function( oldX , oldY)
	{	if( oldY < this.windMax && oldY > this.windMin)
		{	var newX = (this.windDir * windMagnitude + Math.random());
			return newX;
		}else
		{ 	return 0;
		}
	}

	return this;
}
		
		

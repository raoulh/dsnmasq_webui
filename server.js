/*************************************
//
// dnsmasq-webui app
//
**************************************/

// express magic
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var device = require('express-device');
var fs = require("fs");

var runningPortNumber = process.env.PORT;

app.configure(function(){
	// I need to access everything in '/public' directly
	app.use(express.static(__dirname + '/public'));

	//set the view engine
	app.set('view engine', 'ejs');
	app.set('views', __dirname +'/views');

	app.use(device.capture());
});


// logs every request
app.use(function(req, res, next){
	// output every request in the array
	console.log({method:req.method, url: req.url, device: req.device});

	// goes onto the next function in line
	next();
});

app.get("/", function(req, res){
	res.render('index', {});
});

app.machines = [];

function loadDnsmasqLeases() {
	
	fs.readFile('/var/lib/misc/dnsmasq.leases', function (err, data) {
    	var lines = data.toString().split('\n');
		var m = [];
    	lines.forEach(function (line){
			console.log(line.toString());
			
			var linesplit = line.toString().split(/\s+/);
			
			if (linesplit.length == 5) {
				var machine = {
					expireTime: linesplit[0],
					mac_address: linesplit[1],
					ip_address: linesplit[2],
					name: linesplit[3],
					client_id: linesplit[4]
				};
				m.push(machine);
			}
		});
		
		app.machines = m;
		io.sockets.emit('leases', app.machines);
		console.log("app.machines: " + app.machines.length)
  	});
}

fs.watch('.', function (ev, filename) {
	console.log('fs.watch event: ' + ev);
	
	if (filename == 'dnsmasq.leases') {
		loadDnsmasqLeases();
	}
});

io.sockets.on('connection', function (socket) {
	io.sockets.emit('leases', app.machines);
	console.log("app.machines: " + app.machines.length)
});

loadDnsmasqLeases();
server.listen(runningPortNumber);

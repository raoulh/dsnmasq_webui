/*************************************
//
// dnsmasq-webui app
//
**************************************/

$(function(){

	// connect to our socket server

	var h = window.location.protocol + '//' + window.location.host;
	console.log("connecting to " + h);
	var socket = io.connect(h);

	socket.on("connect", function() {
		console.log("connected to server");
	});

	socket.on("leases", function(data) {
	console.log("new socket data:" + data);	
		data.sort(function(a, b) {
			
			var aa = a.ip_address.split(".");
			var bb = b.ip_address.split(".");
			
        	return ( aa[0]*0x1000000 + aa[1]*0x10000 + aa[2]*0x100 + aa[3]*1 )
             	 - ( bb[0]*0x1000000 + bb[1]*0x10000 + bb[2]*0x100 + bb[3]*1 );
		});
console.log("data sorted: " + data.length);
		
		$('#tableMachines tr').not(':first').remove();
		var html = '';
		for (var i = 0; i < data.length; i++) {
            html += '<tr><td>' + data[i].name + '</td>';
			html += '<td>' + data[i].ip_address + '</td>';
			html += '<td>' + data[i].mac_address + '</td>';
			
			var t = new Date(data[i].expireTime * 1000);
			
			html += '<td>' + t.toLocaleString() + '</td></tr>';
		}
		console.log("add html: " + html);
		$('#tableMachines tr').first().after(html);
	});
	
});

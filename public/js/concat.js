// connect to our socket server
var socket = io.connect('http://127.0.0.1:6006/');

var app = app || {};

$(function(){

	socket.on("leases", function(data) {
		
		data.sort(function(a, b) {
			
			var aa = a.ip_address.split(".");
			var bb = b.ip_address.split(".");
			
        	return ( aa[0]*0x1000000 + aa[1]*0x10000 + aa[2]*0x100 + aa[3]*1 )
             	 - ( bb[0]*0x1000000 + bb[1]*0x10000 + bb[2]*0x100 + bb[3]*1 );
		});
		
		$('#tableMachines tr').not(':first').remove();
		var html = '';
		for (var i = 0; i < data.length; i++) {
            html += '<tr><td>' + data[i].name + '</td>';
			html += '<td>' + data[i].ip_address + '</td>';
			html += '<td>' + data[i].mac_address + '</td>';
			
			var t = new Date(data[i].expireTime * 1000);
			
			html += '<td>' + t.toLocaleString() + '</td></tr>';
		}
		$('#tableMachines tr').first().after(html);
	});
	
});

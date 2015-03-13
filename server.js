/*	TP client connecté M2C 
**	Groupe : Lehmann, Guez
*/

var fs = require('fs');
var net = require('net');
var clients = [];

var server = net.createServer(function(socket) {
	
	socket.name = socket.remoteAddress+":"+socket.remotePort;
	console.log("Connection : \t"+socket.name);
	var rs_stream;
	
	//******************** Debut pipe ********************
	
	var data_recevied = 0;
	var size =0;
	var dataPercent = 0;
	var tmpName = "";
	
	rs_stream = fs.createWriteStream("TEMP_SAVE");
	//socket.pipe(rs_stream);
	
	socket.on("data", function(chunk) {
		if ((""+chunk).indexOf("info#s") >= 0) {
			size = +((""+chunk).replace("info#s", ""));
		} else if ( (""+chunk).indexOf("info#f") >=0) {
			tmpName = "save/"+(""+chunk).replace("info#f", "");
			socket.pipe(rs_stream);
			socket.write("go");
		} else {
			data_recevied += chunk.length;
			dataPercent = (data_recevied / size) * 100;
			console.log("    Download in progress "+ dataPercent.toFixed(1)+" %");
		}
	});

	clients.push(socket);
	
	//******************** Deco du client ********************
	socket.on("end",  function(){
		console.log("Initial data "+ size +" | Recevied :"+data_recevied);
		fs.rename("TEMP_SAVE", tmpName, function (err) {
			if (err) console.log(err);
			fs.stat(tmpName, function (err, stats) {
				if (err) console.log(err);
			});
		});
		console.log("Disconected : \t"+socket.name);
	});
});

server.listen(8124, function() { //'listening' listener
  	console.log('server bound');
});

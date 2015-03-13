/*	TP client connecté M2C 
**	Groupe : Lehmann, Guez
*/

var fs = require('fs');
var util = require('util');
var net = require('net');

var fichier_to_send = "bobby.pdf";


fs.exists(fichier_to_send, function(exist){
	if(exist){
	// pour communiquer sur un réseau ajouter le paramètre [host], exemple : host: '172.19.16.203'
	var client = net.connect({port: 8124}, function() { //'connect' listener
		
		console.log('client connected');
		var dataLength = fs.statSync(fichier_to_send).size;
		client.write("info#s" + dataLength);
		client.write("info#f" + fichier_to_send);

		client.on("data", function (d) {
			if (d == "go") {
				var rs = fs.createReadStream(fichier_to_send);
				
				var dataLengthSent = 0;
				var dataPercent = 0;
				
				rs.on("open", function () {
					rs.pipe(client);
					console.log("    "+ fichier_to_send +" : Upload started");
				});
				
				rs.on("data", function(chunk) {
					dataLengthSent += chunk.length;
					dataPercent = (dataLengthSent / dataLength) * 100;
					console.log("    "+ fichier_to_send +" : Upload in progress "+ dataPercent.toFixed(1)+"%");
				});
				
				rs.on("end", function () {
					//envoi terminé
					console.log("    "+ fichier_to_send +" : Upload finished.");
				});
			}
		});
	});
	}else{
		console.log("***** Error *****\n"+fichier_to_send+" : File not found");
	}	
});


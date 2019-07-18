/* NodeJS FIle Server with echoAR for AR.js apps */
var http = require("http"),
	https = require('follow-redirects').https,
	url = require("url"),
	path = require("path"),
	fs = require("fs")
	port = process.argv[2] || 8887;

/* Constants */
var apiKey = 'cool-union-7552';
var echoARserver = 'https://console.echoar.xyz/query?'
	
/* Create Server */
http.createServer(function(request, response) {
	
 	/* Parse URL */
	var uri = url.parse(request.url).pathname
		, filename = path.join(process.cwd(), uri);
	
  	var contentTypesByExtension = {
		'.html': "text/html",
		'.css':  "text/css",
		'.js':   "text/javascript"
  	};
  
	/* Download and Parse Database */
	var json = "";
	var request = https.get(echoARserver + 'key=' + apiKey , function(responseJSON) {
		responseJSON.on('data', function(d)  {
		  json += d;
	  	});
		responseJSON.on('end', function()  {
			var obj = JSON.parse(json);
            var i = 0;
			for (var entry in obj.db) {
    				// console.log(entry + " , " + obj.db[entry] + "\n");
				var storageID = obj.db[entry].hologram.storageID;
				var materialStorageID = obj.db[entry].hologram.materialStorageID;
				var pattStorageID = obj.db[entry].additionalData.arjsTargetStorageID;
				/* Download Assets */
				var fileModel = fs.createWriteStream("./model_" + i + ".obj");
				var fileMaterial = fs.createWriteStream("./model_" + i + ".mtl");
				var filePatt = fs.createWriteStream("./pattern-marker_" + i + ".patt");
				var request = https.get(echoARserver + 'key=' + apiKey + '&file=' + storageID, function(responseDownloadObj) {
					responseDownloadObj.pipe(fileModel);
					responseDownloadObj.on('end', function() {
						var request = https.get(echoARserver + 'key=' + apiKey + '&file=' + materialStorageID, function(responseDownloadMat) {
							responseDownloadMat.pipe(fileMaterial);
							responseDownloadMat.on('end', function() {
							var request = https.get(echoARserver + 'key=' + apiKey + '&file=' + pattStorageID, function(responseDownloadPatt) {
								responseDownloadPatt.pipe(filePatt);
								responseDownloadPatt.on('end', function() {
								fs.exists(filename, function(exists) {
									if (!exists) {
										response.writeHead(404, {"Content-Type": "text/plain"});
										response.write("404 Not Found\n");
										response.end();
										return;
							        }

									if (fs.statSync(filename).isDirectory())
										filename += '/index.html';
										fs.readFile(filename, "binary", function(err, file) {
											if (err) {        
												response.writeHead(500, {"Content-Type": "text/plain"});
												response.write(err + "\n");
												response.end();
												return;
											}

											var headers = {};
											var contentType = contentTypesByExtension[path.extname(filename)];
											if (contentType) headers["Content-Type"] = contentType;
												response.writeHead(200, headers);
												response.write(file, "binary");
												response.end();
											});
										});
			  						});
								});
							});
						});
					});
				});
				i++;
  			}
		});
   });
	
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
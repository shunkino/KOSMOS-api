var bookInfo = [];
var bookTitle;
try {
	var Spooky = require('spooky');
} catch (e) {
	var Spooky = require('../lib/spooky');
}


exports.makeSpooky = function(requestData, callback) {	
	spooky = new Spooky({
		child: {
			transport: 'http'
		},
		casper: {
			logLevel: 'debug',
			verbose: true
		}
	}, function (err) {
		spookyFunction(err, requestData);
	});

	var spookyFunction = function(err, reqData) {
		if (err) {
			e = new Error('Failed to initialize SpookyJS');
			e.details = err;
			throw e;
		}
		spooky.start('http://kosmos.lib.keio.ac.jp/primo_library/libweb/action/search.do?vl(freeText0)=' + reqData + '&fn=search');
		spooky.waitFor(function check() {
			return this.exists('h2.EXLResultTitle');
		}, function then() {
			this.emit('console', this.evaluate(function() {
				return "load completed";
			}));
		}, function timeout() {
			bookTitle = 0;
			this.emit('sendBack',"failed to load h2.EXResultTitle", 0);
			this.emit('console', this.evaluate(function() {
				return "failed to load";
			}));
		});
		spooky.then(function() {
				bookTitle = this.evaluate(function() {
					return document.querySelector("h2.EXLResultTitle").innerText;
				});
				var locationLink = this.evaluate(function() {
					return document.querySelector('li.EXLResultTab > a').getAttribute('href');
				});
				this.thenOpen(locationLink);
		});
		spooky.waitFor(function ch() {
			return this.exists('td.td1');
		}, function th() {
			bookInfo = this.evaluate(function() {
				var bookArray = document.querySelectorAll("td.td1");
				return Array.prototype.map.call(bookArray, function(elem) {
					if(elem.querySelector('a') != null) {	
					return elem.querySelector('a').href;
					}else{return elem.innerText;}
				});
			});
		}, function ti() {
			this.emit('sendBack', "failed to load td.td1", 0);		
		});
		spooky.then(function() {
			this.emit('sendBack',bookInfo, bookTitle);
		});
		spooky.run();
		spooky.on('console', function(message) {
			console.log(message);
		});
		spooky.on('sendBack', function(data, booktitle) {
			callback(data, booktitle);
			this.removeAllListeners();
		});
		spooky.on('errConsole', function(errMessage) {
			console.log(errMessage);
			return 0;
		});
	}
}

try {
	var Spooky = require('spooky');
} catch (e) {
	var Spooky = require('../lib/spooky');
}


exports.makeSpooky = function(requestData, callback) {
	var s = new Date();	
	var n;
	var i = 0;
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
		spooky.start('http://keio-opac.lib.keio.ac.jp/F?func=find-b-0');
		spooky.waitFor(function check() {
			return this.exists('form[name="form1"]');
		}, function then() {
			this.emit('console', this.evaluate(function() {
				return "load completed name = form1";
			}));
			redirect = this.evaluate(function() {
				return document.querySelector('form[name="form1"]').getAttribute('action');
			});
		}, function timeout() {
			var bookTitle = 0;
			this.emit('sendBack',"failed to load form1", 0);
			this.emit('console', this.evaluate(function() {
				return "failed to load";
			}));
		});
		spooky.then([{reqData: reqData}, function() {
			this.thenOpen(redirect + '?func=find-b&request=' + reqData);
		}]);
		spooky.waitFor(function che() {
			return this.exists('td.td1[valign="top"][nowrap]>a');
		}, function the() {
			this.emit('console', this.evaluate(function() {
				return "load completed td.td1";
			}));
			redirect2 = this.evaluate(function() {
				return document.querySelector('td.td1[valign="top"][nowrap]>a').getAttribute('href');
			});
			this.thenOpen(redirect2);
		}, function tim() {
			var bookTitle = 0;
			this.emit('sendBack',"failed to load td.td1", 0);
			this.emit('console', this.evaluate(function() {
				return "failed to load";
			}));
		});

	//	spooky.then(function() {
	//		redirect2 = this.evaluate(function() {
	//			return document.querySelector('td.td1[valign="top"][nowrap]>a').getAttribute('href');
	//		});
	//		this.thenOpen(redirect2);
	//	});
//		spooky.then(function() {
//			bookTitle = this.evaluate(function() {
//				return document.querySelector("td.text3").innerText;
//			});
//			this.emit('console', bookTitle);
//		});
		spooky.waitFor(function ch() {
			return this.exists('td.td1');
		}, function th() {
			var bookTitle = this.evaluate(function() {
				return document.querySelector("td.text3").innerText;
			});
			this.emit('console', bookTitle);

			var bookInfo = this.evaluate(function() {
				var bookArray = document.querySelectorAll("td.td1");
				return Array.prototype.map.call(bookArray, function(elem) {
					if(elem.querySelector('a') != null) {	
						return elem.querySelector('a').href;
					}else{return elem.innerText;}
				});
			});
			this.emit('sendBack',bookInfo, bookTitle);
		}, function ti() {
			this.emit('sendBack', "failed to load td.td1", 0);		
		});
//		spooky.then(function() {
//			this.emit('sendBack',bookInfo, bookTitle);
//		});
		spooky.run();
		spooky.on('console', function(message) {
			n = new Date();
			console.log(n.getTime() - s.getTime() + " " + i);
			i++;
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

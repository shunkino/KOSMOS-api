var express = require('express');
var router = express.Router();
var spookyMain = require('../public/javascripts/spookyMain.js');
var response;


var kosmosFunc = function(spooky, req, res) {
	response = res;
	if(req.query.isbn) {
		console.log(req.query.isbn);
		spookyMain.makeSpooky(spooky, req.query.isbn, complete);	
	}else {
		res.json({
			"error" : "please input search word."
		});
	}
}

var complete = function(bookData, booktitle) {
	var bookReqUrl,bookKubun,bookStatus,bookKan,bookCampus,bookPlace,bookSymbol,bookID,bookRes,bookMemo;
	//ここで情報を配列でもらってきてjsonを構築したらいい。
	if(booktitle == 0) {
		response.json({
			"error" : bookData
		});
	}else {
		(bookData[0] == '\n')? bookReqUrl = null : bookReqUrl = bookData[0];
		(bookData[1] == '\n')? bookKubun = null : bookKubun	= bookData[1];
		(bookData[2] == '\n')? bookStatus = null : bookStatus = bookData[2];
		(bookData[3] == '\n')? bookKan = null : bookKan = bookData[3];
		(bookData[4] == '\n')? bookCampus = null : bookCampus = bookData[4];
		(bookData[5] == '\n')? bookPlace = null : bookPlace = bookData[5];
		(bookData[6] == '\n')? bookSymbol = null : bookSymbol = bookData[6];
		(bookData[7] == '\n')? bookID = null : bookID = bookData[7];
		(bookData[8] == '\n')? bookRes = null : bookRes = bookData[8];
		(bookData[9] == '\n')? bookMemo = null : bookMemo = bookData[9];
		response.json({
			"Title": booktitle,
			"RequestURL": bookReqUrl,
			"Division": bookKubun,
			"Status": bookStatus,
			"Volume": bookKan,
			"Campus": bookCampus,
			"Place": bookPlace,
			"Symbol": bookSymbol,
			"BookID": bookID,
			"Reservation": bookRes,
			"Memo": bookMemo
		});
	}
}

module.exports = {	
	kosmos : kosmosFunc,
};



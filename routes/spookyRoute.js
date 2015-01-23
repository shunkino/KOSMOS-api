var express = require('express');
var router = express.Router();
var extest = require('../public/javascripts/spookyMain.js');
var response;
var kosmosFunc = function(req, res) {
	response = res;
	if(req.query.isbn) {
	console.log(req.query.isbn);
	extest.makeSpooky(req.query.isbn, complete);	
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
		bookReqUrl = bookData[0];
		bookKubun = bookData[1];
		bookStatus = bookData[2];
		bookKan = bookData[3];
		bookCampus = bookData[4];
		bookPlace = bookData[5];
		bookSymbol = bookData[6];
		bookID = bookData[7];
		bookRes = bookData[8];
		bookMemo = bookData[9];
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



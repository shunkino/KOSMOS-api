var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

//module.exports = router;

module.exports = {
	index : function (req, res) {
		var users = {test : "data"};
		res.json(users);
		console.log(req.body + "from users");
	},
	show : function (req, res) {
		console.log(req.query);
		var user = {};
		res.send(user);
	},
	create : function(req, res) {
		var user = {};
		res.send(user);
	},
};

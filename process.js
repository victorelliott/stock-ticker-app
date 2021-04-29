var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	var qobj = url.parse(req.url, true).query;
	var input = qobj.input;
	var type = qobj.type;
	
	var MongoClient = require('mongodb').MongoClient;
	var dbUrl = "mongodb+srv://dbUser1:Sirpunchwood101@cluster0.cy13x.mongodb.net/stock_ticker?retryWrites=true&w=majority";
	
	MongoClient.connect(dbUrl, { useUnifiedTopology: true }, function(err, db) 
	{
		if (err)
		{
			console.log(err);
			return;
		}
		
		var query;
		if (type == "ticker")
		{
			query = {ticker: input};
		}
		if (type == "name")
		{
			query = {name: input};
		}
		
		var dbo = db.db("stock_ticker");
		var coll = dbo.collection('companies');
		
		coll.find(query).toArray(function(err, items)
		{
			if (err)
			{
				console.log(err);
				return;
			}
			else
			{
				var str = "";
				for (item of items)
				{
					str += item.ticker + " - " + item.name + "<br />";
				}
				res.write(str);
				res.end();
			}
		});
	});
}).listen(8080);

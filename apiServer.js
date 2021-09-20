const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;
app.use(express.json())    // <==== parse request body as JSON ( Inbuilt to Express )
app.use(cors());
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://hirvi:hirvi@cluster0.cdjn6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Global for general use
let currCollection;

client.connect(err => {
   currCollection = client.db("qrcode").collection("album");

  console.log ('Database up!')
});
app.get('/', (req, res) => {
  res.send(JSON.stringify('Hello World!'));
  console.log("Working!!");
});

app.post('/postData', (req, res) => {
    	console.log("Data: " + JSON.stringify(req.body));
	
	    currCollection.insertMany( req.body , function(err, result) {
	       if (err) {
				console.log("Improper data format :"+ req.body);
			}else {
			    console.log({"msg" : result.insertedCount + " Records Inserted Count:"}); 
				res.send({"msg" : result.insertedCount + " Records Inserted:"});
		 	}// end
	});
  });
  
app.get('/getData', (req, res) => {
	currCollection.find().toArray( function(err,docs) {
		if(err) {
		  console.log("Some error.. " + err);
		} else {
		   console.log( JSON.stringify(docs) + " have been sent to the client.");
		   res.send( JSON.stringify(docs));
		}
	});
});


app.get('/clearData', (req, res) => {
	currCollection.remove({});
	res.status(200);
	res.send( "The Database album has been cleared");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
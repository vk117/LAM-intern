var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var axios = require('axios');

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log(req);
})

app.get('/getgraph', async (req, res, next) => {
    
    try{
        const data = await axios.get('http://api.worldbank.org/countries/USA/indicators/NY.GDP.MKTP.CD?per_page=5000&format=json')
        res.send(data.data[1]);
    } catch(error){
        next(error);
    }
   
       
})

app.listen(8080, 'localhost',() => {
    console.log("Server running on: " + 8080);
});
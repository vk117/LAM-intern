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

app.get('/api/graph', async (req, res, next) => {
    
    try{
        const data = await axios.get('http://api.worldbank.org/countries/USA/indicators/NY.GDP.MKTP.CD?per_page=5000&format=json')
        const toSend = data.data[1];

        toSend.map((val) => {
            delete val.indicator;
            delete val.country;
            delete val.decimal;
        });

        var clone = JSON.parse(JSON.stringify(toSend));
        clone.shift();

        const movingAverage = (data, points) => {
            return data.map((row, index, total) => {
                const start = Math.max(0, index - points);
                const end = index;
                const subset = total.slice(start, end + 1);
                console.log(subset);
                const sum = subset.reduce((a, b) => {

                    return parseInt(a) + (parseInt(b.value) || 0);
                }, 0);

                return {
                    date: row.date,
                    average: Math.floor(sum/subset.length).toFixed().toString()
                };
            });
        };

        const tenAverage = movingAverage(clone, 15);
        res.send({normal: toSend.reverse(), average: tenAverage.reverse()});
    } catch(error){
        next(error);
    }
   
       
})

app.listen(8080, 'localhost',() => {
    console.log("Server running on: " + 8080);
});
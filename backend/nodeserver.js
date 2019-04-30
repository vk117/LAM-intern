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

        //deleting unnecessary fields
        toSend.map((val) => {
            delete val.indicator;
            delete val.country;
            delete val.decimal;
        });

        //deep cloning the data
        var clone = JSON.parse(JSON.stringify(toSend));
        clone.shift();

        //calculate simple moving average curve data
        const movingAverage = (data, points) => {
            return data.map((row, index, total) => {
                const start = Math.max(0, index - points);
                const end = index;
                const subset = total.slice(start, end + 1);
                const sum = subset.reduce((a, b) => {
                    if('value' in b){
                        return parseInt(a) + (parseInt(b.value) || 0);
                    }
                    else{
                        return parseFloat(a) + (parseFloat(b.change) || 0);
                    }
                }, 0);

                return {
                    date: row.date,
                    average: (sum/subset.length).toFixed(2).toString()
                };
            });
        };

        //calculates change in GDP every year
        const annualGrowth = (data) => {
            return data.map((val, index, total) => {
                if(index !== 0){
                    return{
                        date: val.date, 
                        change: (((val.value - total[index - 1].value)/total[index - 1].value) * 100).toFixed(2).toString()
                    };
                }
            })
        }

        //SMA for GDP distribution
        const tenAverage = movingAverage(clone, 15);
        //Change in GDP for every year
        const rate = annualGrowth(clone.reverse());
        rate.shift();
        const rateAvg = movingAverage(rate, 3);
        //sending all data
        res.send({normal: toSend.reverse(), average: tenAverage.reverse(), rate: rate, rateAvg: rateAvg});

    } catch(error){
        res.status(400).end();
        next(error);
    }
   
       
})

app.listen(8080, 'localhost',() => {
    console.log("Server running on: " + 8080);
});
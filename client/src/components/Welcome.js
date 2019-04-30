import React, {useState, useEffect} from 'react';
import axios from 'axios';
import map from '../map-1.png';

const Welcome = (props) =>{

    //application state
    const [graph, setGraph] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    //api call
    useEffect(() => {
       
        const func = async () => {
            try{
                var res = await axios.get('http://localhost:8080/api/graph');
                setLoading(false);
                setGraph({normal: res.data.normal, average: res.data.average, rate: res.data.rate, rateAvg: res.data.rateAvg});
               }
            catch(error){
                 setError(true);
                 console.log(error);
               }
        };

        func();

    }, []);

    //show simple GDP distribution
    const show_Line = () =>{
        props.history.push({
            pathname: '/graph',
            state: graph
        });
    }

    //show change in GDP every year
    const show_Growth = () => {
        props.history.push({
            pathname: '/growth',
            state: {rate: graph.rate, rateAvg: graph.rateAvg}
        })
    }

    //display message if error occured
    if(error === true){
        return <h1 align="center">Something went wrong</h1>
    }
        return(!loading &&
            <div>
                <img src={map} height={500} width={800} className="center"/>
                <p align="center">GDP visualization of USA</p>
                <button onClick={show_Growth} className="btn">Growth Graph</button><br/>
                <button onClick={show_Line} className="btn">Simple Distribution</button>
            </div>
        )

};

export default Welcome;
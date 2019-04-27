import React, {useState} from 'react';
import axios from 'axios';
import BarChart from './BarChart';

const Welcome = () =>{

    const [graph, setGraph] = useState([]);
    const [display, setDisplay] = useState(false);

   const send_Req = async () => {
        try{
            var data = await axios.get('http://localhost:8080/getgraph');
            data = data.data.reverse();

            setGraph(data);
            setDisplay(true);
           
           }
        catch(error){
             console.log(error);
           }
    };

        return(
            <div>
                <button onClick={send_Req}>Line Graph</button>
                {display && <BarChart data={graph}/>}
            </div>
        )

};

export default Welcome;
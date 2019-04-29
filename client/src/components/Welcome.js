import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Welcome = (props) =>{

    const [graph, setGraph] = useState({});

    useEffect(() => {
       
        const func = async () => {
            try{
                var res = await axios.get('http://localhost:8080/api/graph');
                setGraph({normal: res.data.normal, average: res.data.average});
               }
            catch(error){
                 console.log(error);
               }
        };

        func();

    }, []);


    const show_Line = () =>{
        props.history.push({
            pathname: '/graph',
            state: graph
        });
    }

        return(
            <div>
                <button onClick={show_Line}>Line Graph</button>
            </div>
        )

};

export default Welcome;
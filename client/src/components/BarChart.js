import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';

const BarChart = (props) =>{


    const chart = useRef(null);

    useEffect(() => {
        createChart(chart);
    })


    const createChart = (ref) =>{
        
        const data = props.data;
        console.log(data);

        var min_date = Math.min.apply(Math, data.map(v => {return v.date}));
        var max_date = Math.max.apply(Math, data.map(v => {return v.date}));
        var min_stock = Math.min.apply(Math, data.map(v => {return v.value}));
        var max_stock = Math.max.apply(Math, data.map(v => {return v.value}));

        var width =  1000;
        var height = 400;
        
        var chart = ref.current;

        var svg = d3.select(chart);
        var x_scale = d3.scaleLinear().domain([min_date, max_date]).range([0, width]);
        var y_scale = d3.scaleLinear().domain([min_stock, max_stock]).range([height, 0]);

        var line = d3.line().x((val) => {return x_scale(val.date)})
                            .y((val) => {return y_scale(val.value)})
                            .curve(d3.curveMonotoneX);
        
        svg = svg.append("g")
                 .attr("transform", "translate(" + 100 + "," + 50 + ")");

        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(d3.axisBottom(x_scale).tickFormat(d => {return d.toString()}))
           .append("text")
           .attr("x", 500)
           .attr("y", 40)
           .attr("text-anchor", "end")
           .attr("stroke", "black")
           .attr('font-size', '18px')
           .text("Year");

        svg.append("g").attr("class", "y axis")
           .call(d3.axisLeft(y_scale).tickFormat(d => {
               let val = d/Math.pow(10,12);
               val = parseFloat(val.toString()).toFixed(2);
               return '$' + val + " trillion";
            }))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .attr('font-size', '18px')
            .attr("x", -200)
            .attr("y", -75)
            .text("GDP");


        svg.append("path")
           .datum(data)
           .attr("class", "line")
           .attr("d", line);

        svg.selectAll(".point")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "point")
            .attr("cx", d => {return x_scale(d.date);})
            .attr("cy", d => {return y_scale(d.value);})
            .attr("r", 5);

        
    }

        return(
            <svg ref={chart}
                 width={1100}
                 height = {1100}></svg>
        )
};

export default BarChart;

import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';

const LineChart = (props) =>{


    const chart = useRef(null);

    useEffect(() => {
        createChart(chart);
    })


    /*Manipulates DOM to render the graph*/
    const createChart = (ref) =>{

        /*Data for SMA and GDP curves*/
        const data = props.location.state.normal;
        const average = props.location.state.average;

        var min_date = Math.min.apply(Math, data.map(v => {return v.date}));
        var max_date = Math.max.apply(Math, data.map(v => {return v.date}));  
        var max_stock = Math.max.apply(Math, data.map(v => {return v.value}));
        var max_avg = Math.max.apply(Math, average.map(v => {return v.average}));
        var min_avg = 0;
        var min_stock = 0;

        //Remove the null value for the year 2017
        data.pop();

        var width = window.innerWidth - 100;
        var height = window.innerHeight - 100;

        //Get svg element from the reference
        var chart = ref.current;

        var svg = d3.select(chart)
                    .attr("id", "chart");
        
        //Mapping domain to range for axes
        var x_scale = d3.scaleLinear().domain([min_date, max_date]).range([0, width]);
        var y_scale = d3.scaleLinear().domain([min_stock, max_stock]).range([height, 0]);
        var xScale_avg = d3.scaleLinear().domain([min_date, max_date]).range([0, width]);
        var yScale_Avg = d3.scaleLinear().domain([min_avg, max_avg]).range([height, 0]);

        var line = d3.line().x((val) => {return x_scale(val.date)})
                            .y((val) => {return y_scale(val.value)});

        var avgLine = d3.line().x((val) => {return xScale_avg(val.date)})
                               .y((val) => {return yScale_Avg(val.average)})
                               .curve(d3.curveBasis);

        //Data for legend
        var lines = [{name: 'GDP', color: '#3D55F0'}, {name: 'SMA Curve', color: '#33cc33'}];

        //Defining the legend
        var legend = svg.selectAll('g')
                        .data(lines)
                        .enter()
                        .append('g')
                        .attr("transform", "translate(" + 100 + "," + 50 + ")");
                   
        //Legend colours
        legend.append('rect')
              .attr('x', 10)
              .attr('y', (d, i) => {
                    console.log(d);
                     return i*20;
                })
              .attr('width', 10)
              .attr('height', 10)
              .style('fill', (d) => {
                  return d.color;
              });

        //Legend text
        legend.append('text')
              .attr('x', 25)
              .attr('y', (d, i) => {
                  return (i*20) + 9;
              })
              .attr("stroke", "#67809f")
              .text((d) => {
                  return d.name;
              })
        
        svg = svg.append("g")
                 .attr("transform", "translate(" + 50 + "," + 50 + ")");

        //Tooltip div
        var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

        //X-axes
        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(d3.axisBottom(x_scale).tickFormat(d => {return d.toString()}))
           .append("text")
           .attr("x", 1400)
           .attr("y", -5)
           .attr("text-anchor", "end")
           .attr("stroke", "#67809f")
           .attr('font-size', '18px')
           .text("Year");

        //Y-axes
        svg.append("g").attr("class", "y axis")
           .call(d3.axisLeft(y_scale).tickFormat(d => {
               let val = d/Math.pow(10,12);
               val = parseFloat(val.toString()).toFixed(2);
               return val;
            }))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .attr("stroke", "#67809f")
            .attr('font-size', '18px')
            .attr("x", -20)
            .attr("y", 20)
            .text("GDP (trillions)");

        //Moving lines animations
        const transition = (path) => {

            var totalLenght = path.node().getTotalLength();

            path.transition()
                .duration(2000)
                .attrTween("stroke-dasharray", () => {
                    var l = totalLenght,
                    i = d3.interpolateString("0," + l, l + "," + l);
                    return (t) => {return i(t);};
                });

        }

        //GDP Curve
        svg.append("path")
           .style("fill", "none")
           .style("stroke", "#3D55F0")
           .datum(data)
           .attr("class", "line")
           .attr("d", line)
           .call(transition);

        //Simple Moving average curve
         svg.append("path")
            .style("fill", "none")
            .style("stroke", "#33cc33")
            .datum(average)
            .attr("class", "average")
            .attr("d", avgLine)
            .call(transition);
        
        /*Plotting data points on GDP Curve
        and tooltip on mouse hover */
        svg.selectAll("point")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "point")
            .attr("cx", d => {return x_scale(d.date);})
            .attr("cy", d => {return y_scale(d.value);})
            .attr("r", 5)
            .on("mouseover" , (d) => {
                div.transition()
                    .duration(200)
                    .style("opacity", .9)
                    .attr("width", 50)
                    .attr("height", 20);

                div.html("Year: " + d.date + "<br/>" + "GDP: " + ((d.value)/Math.pow(10, 12)).toFixed(2))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", (d) => {
                div.transition()
                   .duration(500)
                   .style("opacity", 0);
            });

        
    }

        return(
            <svg ref={chart}
                 width={window.innerWidth}
                 height = {window.innerHeight}></svg>
        )
};

export default LineChart;

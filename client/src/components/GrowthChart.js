import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';

const GrowthChart = (props) => {

    //declaring reference to be used for svg element
    const chart = useRef(null);

    useEffect(() => {
        createChart(chart);
    })

    /*Manipulates DOM to render the graph*/
    const createChart = (ref) => {

        /*Data for SMA and GDP curves*/
        const growth = props.location.state.rate;
        const avg = props.location.state.rateAvg;

        var min_date = Math.min.apply(Math, growth.map(v => {return v.date}));
        var max_date = Math.max.apply(Math, growth.map(v => {return v.date}));
        var min_change = Math.min.apply(Math, growth.map(v => {return v.change}));
        var max_change = Math.max.apply(Math, growth.map(v => {return v.change}));
        var min_avg = Math.min.apply(Math, avg.map(v => {return v.average}));
        var max_avg = Math.max.apply(Math, avg.map(v => {return v.average}));

        var width = window.innerWidth - 100;
        var height = window.innerHeight - 100;

        //Get svg element from the reference
        var chart = ref.current;
        var svg = d3.select(chart)
                    .attr("id", "chart");

        //Mapping domain to range for axes
        var x_scale = d3.scaleLinear().domain([min_date, max_date]).range([0, width]);
        var y_scale = d3.scaleLinear().domain([min_change, max_change]).range([height, 0]);

        var x_avgScale = x_scale;
        var y_avgScale = d3.scaleLinear().domain([min_avg, max_avg]).range([height, 0]);

        var growthLine = d3.line().x((val) => {return x_scale(val.date)})
                                  .y((val) => {return y_scale(val.change)});
        var avgLine = d3.line().x((val) => {return x_avgScale(val.date)})
                               .y((val) => {return y_avgScale(val.average)})
                               .curve(d3.curveBasis);


        //Data for legend
        var lines = [{name: 'GDP change (%)', color: '#3D55F0'}, {name: 'SMA Curve', color: '#FF8900'}];

        //Defining the legend
        var legend = svg.selectAll('g')
                        .data(lines)
                        .enter()
                        .append('g')
                        .attr("transform", "translate(" + 1300 + "," + 50 + ")");
                   
        //Legend colours
        legend.append('rect')
              .attr('x', 10)
              .attr('y', (d, i) => {
                    //console.log(d);
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
        svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y_scale).tickFormat(d => {return d.toString()}))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .attr("stroke", "#67809f")
        .attr('font-size', '18px')
        .attr("x", -20)
        .attr("y", 20)
        .text("Growth (percent)");
        
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

        //Change curve
        svg.append("path")
           .style("fill", "none")
           .style("stroke", "#3D55F0")
           .datum(growth)
           .attr("class", "line")
           .attr("d", growthLine)
           .call(transition);

        //SMA for change
        svg.append("path")
           .style("fill", "none")
           .style("stroke", "#FF8900")
           .datum(avg)
           .attr("class", "average")
           .attr("d", avgLine)
           .call(transition);

        /*Scatterplot for change curve and
        tooltip on hover */
        svg.selectAll("point")
           .data(growth)
           .enter()
           .append("circle")
           .attr("class", "point")
           .attr("cx", d => {return x_scale(d.date);})
           .attr("cy", d => {return y_scale(d.change);})
           .attr("r", 5)
           .on("mouseover" , (d) => {
               div.transition()
                   .duration(200)
                   .style("opacity", .9)
                   .attr("width", 50)
                   .attr("height", 20);

               div.html("Year: " + d.date + "<br/>" + "Change (%): " + d.change)
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
}

export default GrowthChart;
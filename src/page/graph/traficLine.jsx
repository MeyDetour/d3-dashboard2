import * as d3 from 'd3';
import {useEffect, useRef} from "react";
import "../../assets/traficLine.css"

export default function TraficLine({
                                       data,

                                   }) {

    const svgRef = useRef(null);

    let visitOfWeek = data.trafic.totalVisitsOfWeek.map((d, i) => [i, d])


    useEffect(() => {
        function run() {


            let svg = d3.select(svgRef.current);

            let width = svgRef.current.getBoundingClientRect().width

            const height = svgRef.current.getBoundingClientRect().height
            const cs = window.getComputedStyle(svgRef.current)
            const padding = parseInt(cs.padding.replace("px", ""))
            const leftAxisWidth = 28
            const bottomAxisWidth = 28


            const x = d3.scaleLinear([0, visitOfWeek.length - 1], [leftAxisWidth, width - leftAxisWidth]);
            const y = d3.scaleLinear(d3.extent(visitOfWeek, d => d[1]), [height, bottomAxisWidth]);


            svg.selectAll("*").remove();

            // add axis
            const xAxis = d3.axisBottom(x)
            svg.append("g")
                .call(xAxis)
                .attr("transform", "translate(0," + (height - bottomAxisWidth / 1.5) + ")")

            const yAxis = d3.axisLeft(y)
                .ticks(6)
            svg.append("g")
                .call(yAxis)
                .attr("transform", "translate(" + (leftAxisWidth) + "," + -bottomAxisWidth / 2 + ")")


            //add path
            svg.append("path")
                .datum(visitOfWeek)
                .attr("class", "traficline")
                .attr("color", "red")
                .attr("transform", "translate(0," + -bottomAxisWidth / 1.5 + ")")
                .attr("d", d3.line()
                    .x(d => x(d[0]))
                    .y(d => y(d[1]))
                    .curve(d3.curveCatmullRom))


            svg.selectAll()
                .data(visitOfWeek)
                .join("circle")
                .attr("class", "point")
                .attr("transform", "translate(0," + -bottomAxisWidth / 1.5 + ")")
                .attr("r", 3)
                .attr("cx", (d) => x(d[0]))
                .attr("cy", (d) => y(d[1]))

            svg.append("text")
                .text("Trafic on website")
                .attr("x", 46)
                .attr("y", 30)

        }


        if (svgRef.current && visitOfWeek.length > 0) {
            window.addEventListener("resize", run);
            run();
        }

    }, [data, visitOfWeek,]);


    return (
        <>
            <svg ref={svgRef}>
            </svg>
        </>

    );
}

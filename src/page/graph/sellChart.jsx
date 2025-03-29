import {useEffect, useRef} from "react";
import * as d3 from "d3";

export default function SellChart({data}) {
    const svgRef = useRef(null);
    const colors = ["rgba(224,172,43,0.49)", "rgba(232,82,82,0.49)", "rgba(102,137,198,0.45)", "rgba(154,111,176,0.7)", "rgba(154,125,176,0.7)"]

    const groupsNames = data.products.quantityProductsSoldinTotal.map(d => d.name);

    function getMax() {

        let max = 0
        for (let object of data.products.quantityProductsSoldinTotal) {
            for (let value of object.valueForMonths) {
                if (value > max) {
                    max = value
                }
            }
        }
        return max;
    }

    useEffect(() => {
        function run() {
            if (!data || !svgRef.current) return;

            let svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();

            let width = svgRef.current.getBoundingClientRect().width - 100
            const height = svgRef.current.getBoundingClientRect().height
            let margin = {top: 20, right: 30, bottom: 20, left: 40};

// add title
            svg.append("text")
                .text("Total products sold this year")
                .attr("x", 46)
                .attr("y", 30)


            // add axis
            const xScale = d3.scaleLinear()
                .domain([1, 12])
                .range([margin.left, width - margin.right]);
            const yScale = d3.scaleLinear()
                .domain([0, getMax() * 1.1])
                .range([height - margin.bottom, margin.top]);
            const colorScale = d3.scaleOrdinal()
                .domain(groupsNames)
                .range(colors)
            //  add axis
            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(xScale).ticks(5));

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(yScale));

            // add area
            data.products.quantityProductsSoldinTotal.forEach((group, index) => {

                const areaGenerator = d3.area()
                    .x((d, i) => xScale(i + 1))
                    .y0(yScale(0))
                    .y1(d =>    yScale(d) )
                    .curve(d3.curveCatmullRom);

                svg.append("path")
                    .datum(group.valueForMonths)
                    .attr("fill", colors[index])
                    .attr("opacity", 0.7)
                    .attr("d", areaGenerator);
            });

            // add legend
            for (let i = 0; i < groupsNames.length; i++) {
                svg.append("text").attr("x", width + 20).attr("y", 60 + i * 30).text(groupsNames[i]).style("font-size", "15px").attr("alignment-baseline", "middle")
                svg.append("circle").attr("cx", width).attr("cy", 60 + i * 30).attr("r", 6).style("fill", colors[i])

            }
        }


        if (svgRef.current) {
            window.addEventListener("resize", run);
            run();
        }

    }, [data]);

    return (
        <svg ref={svgRef}></svg>

    );
}

import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import "../../assets/webChart.css"
export default function WebChart({data}) {
    const svgRef = useRef(null);

    let formatData = data.products
    const groupsNames = formatData.map((d) => d.name);
    const [selectGroupName, setSelectGroupName] = useState(groupsNames[0]);

    useEffect(() => {
        function run() {
            if (!svgRef.current) return;

            let svg = d3.select(svgRef.current);
            svg.selectAll("*").remove(); // Nettoyage avant redraw

            let width = svgRef.current.getBoundingClientRect().width;
            let height = svgRef.current.getBoundingClientRect().height;

            const outerRadius = Math.min(width, height) / 2;
            const INNER_RADIUS = 40;
            const centerX = width / 2;
            const centerY = height / 2;

            const teta = d3.scaleBand()
                .domain(groupsNames)
                .range([0, 2 * Math.PI]);

            let distance = {};
            formatData.forEach((axis) => {
                distance[axis.name] = d3.scaleRadial()
                    .domain([0, d3.max(formatData, d => d.number)]) // Prendre le max pour l'échelle
                    .range([INNER_RADIUS, outerRadius]);
            });

            const axisGroup = svg.append("g").attr("transform", `translate(${centerX}, ${centerY})`);

            // Dessiner les axes
            groupsNames.forEach(name => {
                const angle = teta(name);
                const x = Math.cos(angle) * outerRadius;
                const y = Math.sin(angle) * outerRadius;
                axisGroup.append("line")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", x)
                    .attr("y2", y)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);
            });

            // Dessiner les cercles concentriques
            const numCircles = 5;
            for (let i = 1; i <= numCircles; i++) {
                axisGroup.append("circle")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r", (outerRadius / numCircles) * i)
                    .attr("stroke", "gray")
                    .attr("fill", "none");
            }
        }
        if (svgRef.current) {
            run()
        }
    }, [svgRef])

    return (
        <svg ref={svgRef}>

        </svg>
    )
}

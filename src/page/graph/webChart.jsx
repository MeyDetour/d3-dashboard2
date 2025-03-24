import {createElement, useEffect, useRef, useState} from "react";
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
            svg.selectAll("*").remove();

            let padding = 25
            let width = svgRef.current.getBoundingClientRect().width - padding * 2;
            let height = svgRef.current.getBoundingClientRect().height - padding * 2;

            // get the width/2 or heihgt/2  for the width of circle
            const outerRadius = Math.min(width, height) / 2;
            const INNER_RADIUS = 40;

            // get the center of circle
            const centerX = padding + width / 2;
            const centerY = padding + height / 2;

            //create as much circle  as data
            const numCircles = groupsNames.length;


            console.log(groupsNames)
            console.log(formatData)

            // different step of angle of circle like different x of xAxis
            const teta = d3.scaleBand()
                .domain(groupsNames)
                .range([0, 2 * Math.PI]);

            // different distance of the point. for each name we create and axis wich go from 0 to distance max
            let distance = {};
            formatData.forEach((data) => {
                distance[data.name] = d3.scaleRadial()
                    .domain([padding, d3.max(formatData, d => d.max)]) // Prendre le max pour l'échelle
                    .range([INNER_RADIUS, outerRadius]);
            });


            const axisGroup = svg.append("g").attr("transform", `translate(${centerX}, ${centerY})`);

            // Dessiner les axes
            groupsNames.forEach(name => {

                const angle = teta(name);
                // cos wwith sin let a circle
                const x = Math.cos(angle) * outerRadius;
                const y = Math.sin(angle) * outerRadius;
                //create line from 00 to the label
                axisGroup.append("line")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", x)
                    .attr("y2", y)
                    .attr("class", "line")
                    .attr("stroke-width", 1);

                console.log(name)
                console.log(Math.cos(angle))
                console.log(Math.sin(angle))
                let coord = xyWithDecalage(angle, x, y,name)

                axisGroup.append("text")
                    .text(name)
                    .attr("x",coord.x)
                    .attr("y",coord.y)
            });
            for (let i = 1; i <= numCircles; i++) {
                axisGroup.append("circle")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r", (outerRadius / numCircles) * i)
                    .attr("class", "circle")
                    .attr("fill", "none");
            }


            let lineRadial = d3.lineRadial()
                .angle(d => teta(d.name) +1/2*Math.PI)
                .radius(d => distance[d.name](d.max))
                .curve(d3.curveLinearClosed)


            svg.append("path")
                .datum(formatData)
                .attr("d", lineRadial)
                .attr("class", "polygon")
                .attr("transform", `translate(${centerX}, ${centerY})`)
                .attr("class", "polygon")


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

function xyWithDecalage(angle, x, y,name) {
    console.log(Math.round(Math.cos(angle)))
    console.log(Math.round(Math.sin(angle)))
    let widthString = measureString(name) + 15
    let decalageX = -(widthString-15)/2
    if (Math.round(Math.cos(angle)) === -1) {
        decalageX = -widthString
    }
    if (Math.round(Math.cos(angle)) === 1) {decalageX = 10}

    let decalageY = 10
    if (Math.round(Math.sin(angle)) === 1) {decalageY = 20}

    console.log("widthString", widthString)
    console.log("  x : ",x)
    console.log("  y : ",y)
    console.log("decalage x : ",decalageX)
    console.log("decalage y : ",decalageY)
    x = x + decalageX
     y = y + (decalageY * Math.round(Math.sin(angle)))

    console.log("  x : ",x)
    console.log("  y : ",y)
    return {x, y}
}

function measureString(str) {
    let p = document.createElement("p");
    p.innerText = str;
    p.style.width = "fit-content";
    document.body.appendChild(p); // Nécessaire pour que la largeur soit calculée
    let width = p.getBoundingClientRect().width;
    document.body.removeChild(p); // Nettoyage après la mesure
    return width;
}

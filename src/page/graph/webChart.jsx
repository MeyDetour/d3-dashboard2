import {createElement, useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import "../../assets/webChart.css"

export default function WebChart({data}) {
    const svgRef = useRef(null);

    const [selectedData, setSelectedData] = useState("week");
    const [formatedData, setFormatedData] = useState( data.products.quantityProductsSoldThisWeek);

    useEffect(() => {
        function run() {
            if (!svgRef.current) return;

            let svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();

            let padding = 50
            let width = svgRef.current.getBoundingClientRect().width - padding * 2  -50;
            let height = svgRef.current.getBoundingClientRect().height - padding * 2;
            const groupsNames = formatedData.map((d) => d.name);
            // get the width/2 or heihgt/2  for the width of circle
            const outerRadius = Math.min(width, height) / 2;
            console.log(outerRadius);
            const INNER_RADIUS = 40;

            // get the center of circle
            const centerX = padding + width / 2;
            const centerY = padding + height / 2;

            //create as much circle  as data
            const numCircles = groupsNames.length;

            let maxValueInData = getMaxValueOfData(formatedData)

            let spaceBetweenCirlce = outerRadius / numCircles

            // different step of angle of circle like different x of xAxis
            const teta = d3.scaleBand()
                .domain(groupsNames)
                .range([0, 2 * Math.PI]);

            // different distance of the point. for each name we create and axis wich go from 0 to distance max
            let distance = {};
            formatedData.forEach((data) => {
                distance[data.name] = d3.scaleRadial()
                    .domain([padding, d3.max(formatedData, d => d.max)]) // Prendre le max pour l'échelle
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
                    .attr("class", "webChartLine")
                    .attr("stroke-width", 1);


                let coord = xyWithDecalage(angle, x, y, name)

                axisGroup.append("text")
                    .text(name)
                    .attr("x", coord.x)
                    .attr("y", coord.y)

            });
            for (let i = 1; i <= numCircles; i++) {
                axisGroup.append("circle")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r", (outerRadius / numCircles) * i)
                    .attr("class", "webChartCircle")
                    .attr("fill", "none");
            }


            let lineRadial = d3.lineRadial()
                .angle(d => teta(d.name) + 1 / 2 * Math.PI)
                .radius(d => Math.round(d.max * outerRadius / maxValueInData))
                .curve(d3.curveLinearClosed)


            svg.append("path")
                .datum(formatedData)
                .attr("d", lineRadial)
                .attr("class", "polygon")
                .attr("transform", `translate(${centerX}, ${centerY})`)
                .attr("class", "polygon")
                .transition()
                    .duration(500)
                    .attr("opacity", 1) // Apparition douce
                .transition()
                    .duration(2500)

            formatedData.forEach((d, i) => {
                console.log("spaceBetweenCirlce : ", spaceBetweenCirlce);
                let x = Math.round((i + 1) * spaceBetweenCirlce)

                console.log("x : ", x);
                let value = Math.round(x / outerRadius * maxValueInData)

                console.log("value : ", value);
                console.log(value)
                // cos wwith sin let a circle
                axisGroup.append("text")
                    .text(value)
                    .attr("x", x)
                    .attr("y", 0)
                    .attr("transform", "translate(-20,-5)")
                    .attr("class", "labelValue")


                svg.append("text").attr("x", width+20).attr("y", 60+i*30).text(d.name+" : "+d.max).style("font-size", "15px").attr("alignment-baseline","middle")



            })


        }

        if (svgRef.current && formatedData) {
            window.addEventListener("resize", run);
            run()
        }
    }, [svgRef,formatedData])

    useEffect(() => {
        switch (selectedData) {
            case "week":
                setFormatedData( data.products.quantityProductsSoldThisWeek)
                break;
            case "month":
                setFormatedData( data.products.quantityProductsSoldThisMonth)
                break;
             case "day":
                setFormatedData( data.products.quantityProductsSoldThisDay)
                break;

        }

    }, [selectedData])
    return (
        <>
            <div className={"webChartChoice"}>
                <span onClick={() => setSelectedData("day")}
                      className={selectedData === "day" && "focus"}>This day</span>
                <span onClick={() => setSelectedData("week")}
                      className={selectedData === "week" && "focus"}>This week</span>
                <span onClick={() => setSelectedData("month")} className={selectedData === "month" && "focus"}>This Month</span>
            </div>
            <svg ref={svgRef}>

            </svg>
        </>

    )
}

function xyWithDecalage(angle, x, y, name) {
    let widthString = measureString(name) + 15
    let decalageX = -(widthString - 15) / 2
    if (Math.round(Math.cos(angle)) === -1) {
        decalageX = -widthString
    }
    if (Math.round(Math.cos(angle)) === 1) {
        decalageX = 10
    }

    let decalageY = 10
    if (Math.round(Math.sin(angle)) === 1) {
        decalageY = 20
    }

    x = x + decalageX
    y = y + (decalageY * Math.round(Math.sin(angle)))

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

function getMaxValueOfData(formatedData) {
    let max = 0
    for (let key of Object.keys(formatedData)) {
        if (formatedData[key].max > max) {
            max = formatedData[key].max
        }
    }
    return max;
}

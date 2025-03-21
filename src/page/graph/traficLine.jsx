import * as d3 from 'd3';
import {useEffect, useRef} from "react";

export default function TraficLine({
                                       data,
                                       width = 1200, height = 500,
                                       marginTop = 20,
                                       marginRight = 20,
                                       marginBottom = 20,
                                       marginLeft = 20
                                   }) {

let visitOfWeek = data.trafic.totalVisitsOfWeek.map((d,i)=>[i,d])
    let maxValue = d3.extent(visitOfWeek,d=>d[1])[1]
    let minValue = d3.extent(visitOfWeek,d=>d[1])[0] -3
    console.log(maxValue, minValue, visitOfWeek);


    const gx = useRef();
    const gy = useRef();
    const x = d3.scaleLinear([0, visitOfWeek.length -1], [marginLeft, width - marginRight]);
    console.log([0, visitOfWeek.length -1])  // 0,6
    console.log(maxValue) //290
    console.log(minValue) //227
    console.log([height - marginBottom, marginTop])
    const y = d3.scaleLinear([minValue,maxValue] , [height - marginBottom, marginTop]);


    const line = d3.line()
        .x(d=>x(d[0]))
        .y(d=>y(d[1]))
    useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
    useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);
    return (
        <svg width={width} height={height}>
            <g ref={gx} transform={`translate(0,${height - marginBottom})`}/>
            <g ref={gy} transform={`translate(${marginLeft},0)`}/>
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(visitOfWeek)}/>
            <g fill="white" stroke="currentColor" strokeWidth="1.5">
                {visitOfWeek.map((d, i) => (<circle key={i} cx={x(d[0])} cy={y(d[1])} r="2.5"/>))}
            </g>
        </svg>
    );
}

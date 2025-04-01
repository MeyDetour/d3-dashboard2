import {useEffect, useState} from "react";
import TraficLine from "./graph/traficLine.jsx";
import "../assets/dashboard.css"
import WebChart from "./graph/webChart.jsx";
import SellChart from "./graph/sellChart.jsx";

export default function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function getData() {
            let res = await fetch("data.json")
            res = await res.json()
            console.log(res)
            setData(res)
        }

        getData()
    }, [])

    if (!data) return null;

    return (

        <div className="dashboard">
            <div className="left">
                <WebChart data={data}></WebChart>
            </div>
            <div className="right">
                <div>
                    <TraficLine data={data}></TraficLine>
                </div>
                <div>
                    <SellChart data={data}></SellChart>
                </div>

            </div>
        </div>

    )
}

import {useEffect, useState} from "react";
import TraficLine from "./graph/traficLine.jsx";
import "../assets/dashboard.css"
export default function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function getData() {
            let res = await fetch("/src/page/data.json")
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

                </div>
                <div className="right">
                    <TraficLine data={data}></TraficLine>
                    <hr/>
                    <TraficLine data={data}></TraficLine>
                    <hr/>
                    <TraficLine data={data}></TraficLine>
                </div>
            </div>

    )
}

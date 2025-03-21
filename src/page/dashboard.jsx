import {useEffect, useState} from "react";
import TraficLine from "./graph/traficLine.jsx";

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
        <TraficLine data={data}></TraficLine>
    )
}

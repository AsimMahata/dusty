import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react"
function App() {
    const [msg, setMsg] = useState<string>("");
    const [show, setShow] = useState<any>([]);
    useEffect(() => {
        async function test() {
            let res: string = await invoke('my_custom_command');
            let show = await invoke('scan_shows', { path: "C:\\" });
            console.log(res);
            console.log(show);
            setMsg(res);
            setShow(show);
        }
        test();
    }, [])
    return (
        <div>
            Hello , Asim

            <br />

            {msg}
            <br />
            {show.map((item, index) => (
                <pre key={index}>
                    {JSON.stringify(item, null, 2)}
                </pre>
            ))}
        </div>
    )
}

export default App

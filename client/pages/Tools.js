import React from "react";
import { useStore } from "Store";

const Tools = () => {
    const [state, setState] = useStore();

    return (
        <div className="page-content dashboard">
            <h1>Hello world</h1>
        </div>
    )
}

export default Tools;
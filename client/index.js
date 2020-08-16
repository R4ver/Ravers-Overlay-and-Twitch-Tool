import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./styles/master.scss";

import { StoreProvider } from "Store";

import App from "./app";

const Index = () => {
    return (
        <Router>
            <StoreProvider>
                <App />
            </StoreProvider>
        </Router>
    );
}

render(
    <Index />,
    document.getElementById("root")
);

if ( module.hot ) {
    module.hot.accept();
}
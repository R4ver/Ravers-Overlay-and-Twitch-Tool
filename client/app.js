import React, { useState } from "react";
import { Route, useLocation, Switch } from "react-router-dom";

import { useStore } from "Store";
import Home from "Pages/Home";
import Tools from "Pages/Tools";


import { AppHeader, AppNav } from "Components";

const App = () => {
    const location = useLocation();
    const [state] = useStore();

    console.log(location);

    return (
        <>
            <AppHeader title="r4vers' overlay & twitch tool" />
            <AppNav />
            {state.isLoggedIn 
            ? (
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>

                    <Route exact path="/tools">
                        <Tools />
                    </Route>
                </Switch>
            ) : (
                <Route exact path="/login">
                    <>
                        {console.log("Test")}
                        <h1>Welcome to my app: Login</h1>
                        <a className="button" href={`http://localhost:${process.env.PORT}/auth/twitch`}>
                            Sign In
                        </a>
                    </>
                </Route>
            )}

        </>
    );
}

export default App;
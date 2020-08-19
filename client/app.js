import React, { useState } from "react";
import { Route, useLocation, Switch } from "react-router-dom";

import { useStore } from "Store";
import Home from "Pages/Home";
import Tools from "Pages/Tools";


import { AppHeader, AppNav, Icon } from "Components";

const App = () => {
    const location = useLocation();
    const [state] = useStore();

    console.log(location);

    return (
        <>
            <AppHeader title="ROTT" />
            {state.isLoggedIn 
            ? (
                <>
                    <AppNav />
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>

                        <Route exact path="/tools">
                            <Tools />
                        </Route>
                    </Switch>
                </>
            ) : (
                <Route exact path="/login">
                    <>
                        <a className="button" href={`http://localhost:${process.env.PORT}/auth/twitch`}>
                            <Icon type="fab" icon="twitch" />
                            Sign in
                        </a>
                    </>
                </Route>
            )}

        </>
    );
}

export default App;
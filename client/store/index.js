import React, { createContext, useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";

const InitialState = {
    user: {},
    isLoggedIn: false
}

export const store = createContext(InitialState);
const Provider = store.Provider;

export const StoreProvider = ({children}) => {
    const [state, _setState] = useState(InitialState);
    const [doAuth, setDoAuth] = useState(false);

    const setState = (toUpdate) => {
        _setState((prev) => ({
            ...prev,
            ...toUpdate,
        }));
    };

    useEffect( () => {
        (async () => {
            try {
                const { status: userStatus, user } = await (await fetch(`/api/user/currentUser`) ).json();
                console.log(userStatus);
                if ( userStatus === 401 ) {
                    setDoAuth(true);
                }
                const { status: channelStatus, channel } = await ( await fetch(`/api/channel`) ).json();
                
                
                if (userStatus === 200 && channelStatus === 200) {
                    setState({
                        user,
                        channel,
                        isLoggedIn: true,
                    });
                }
            } catch (error) {
                console.log("failed to login: ", error);
            }
        })();
    }, [])

    console.log(state, doAuth);
    if ( doAuth ) {
        console.log("Doing auth");
        return <Redirect to="/login" />
    }

    return <Provider value={[state, setState]}>{children}</Provider>;
}

export const useStore = () => {
    const [state, setState] = useContext(store);

    return [state, setState];
}
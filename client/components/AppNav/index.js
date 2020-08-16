import React from "react";
import { NavLink } from "react-router-dom";

export const AppNav = () => (
    <nav className="app-nav">
        <NavLink to="/" className="nav-item" exact={true} activeClassName="is-active">Stream</NavLink>
        <NavLink to="/tools" className="nav-item" exact={true} activeClassName="is-active">Tools</NavLink>
    </nav>
)
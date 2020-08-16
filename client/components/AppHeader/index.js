import React from "react";

export const AppHeader = ({ title, subtitle }) => (
    <header className="app-header">
        <h1>{title}</h1>
        {subtitle && 
            <h2>{subtitle}</h2>
        }
    </header>
)
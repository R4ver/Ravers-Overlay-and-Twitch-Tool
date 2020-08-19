import React from "react";

export const Icon = ({type, icon, isRight}) => (
    <i className={`${type} fa-${icon} icon ${isRight ? "is-right" : "is-left"}`}></i>
)
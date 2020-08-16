import React from "react";
import { DebounceInput } from "react-debounce-input";

export const Input = ({label, value, type = "text", onChange, name, className = "", debounce = false, ...rest}) => (
    <div className="input-wrapper">
        { label &&
            <label className="input-label">{label}</label>
        }
        {debounce ? (
            <DebounceInput
                className={`input ${className ? className : ""}`} 
                type={type} 
                name={name} 
                onChange={onChange} 
                value={value} 
                {...rest}
            />
        ) : (
            <input 
                className={`input ${className ? className : ""}`} 
                type={type} 
                name={name} 
                onChange={onChange} 
                value={value} 
                {...rest}
            />
        )}
    </div>
)
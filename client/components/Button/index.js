import React from "react";

export const Button = ({value, type = "default", onClick, className = "", ...rest}) => (
    <button className={`button is-${type} ${className}`} onClick={onClick} {...rest}>
        {value}
    </button>
)

export const UploadButton = ({image = null, accept = "image/png", onChange, className = "", ...rest}) => (
    <div className={`button is-upload ${className}`} style={{
        backgroundImage: `url(${image})`
    }}>
        <input className="input" type="file" accept={accept} onChange={onChange} />
    </div>
)
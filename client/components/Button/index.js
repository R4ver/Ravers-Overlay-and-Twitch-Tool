import React from "react";

import { Icon } from "Components";

export const Button = ({value = null, type = "default", onClick, iconType, icon, className = "", ...rest}) => (
    <button className={`button is-${type} ${className}`} onClick={onClick} {...rest}>
        {icon && <span className="icon-wrapper"><Icon type={iconType} icon={icon} /></span>}
        {value ? (
            <span>{value}</span>
        ) : (
            <>
                {rest.children}
            </>
        )}
    </button>
)

export const UploadButton = ({image = null, accept = "image/png", onChange, className = "", ...rest}) => (
    <div className={`button is-upload ${className}`} style={{
        backgroundImage: `url(${image})`
    }} {...rest}>
        <input className="input" type="file" accept={accept} onChange={onChange} />
    </div>
)
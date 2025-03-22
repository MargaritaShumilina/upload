import React from "react";
import './Heading.css';

export const Heading = ({children}) => {
    return (
        <h1 className={'heading'}>{children}</h1>
    )
}

import {Heading} from "../Heading/Heading.jsx";
import {STATUS_ERROR, STATUS_SUCCESS, TEXT_ERROR, TEXT_SUCCESS} from "../../utils/constants.js";
import React from "react";

export const Popup = ({children, style, status}) => {
    return (
        <div className={`popup ${style}`}>
            <Heading>
                {status === STATUS_SUCCESS && {TEXT_SUCCESS}}
                {status === STATUS_ERROR && {TEXT_ERROR}}
                </Heading>
            {children}
        </div>
    )
}

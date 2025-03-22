import {Heading} from "../Heading/Heading.jsx";
import {
    STATUS_ERROR,
    STATUS_IDLE,
    STATUS_SUCCESS,
    TEXT_ERROR,
    TEXT_OF_HEADING,
    TEXT_SUCCESS
} from "../../utils/constants.js";
import React from "react";
import {ButtonCross} from "../ButtonCross/ButtonCross.jsx";
import closeIcon from "../../image/cross-button.png";
import './Popup.css';

export const Popup = ({children, style, status, handleDeleteFile}) => {
    return (
        <div className={`popup ${style}`}>
            <ButtonCross onClick={handleDeleteFile} styleButtonCross="abortBtn"><img src={closeIcon} alt="close"/></ButtonCross>
            <Heading>
                {status === STATUS_IDLE && TEXT_OF_HEADING}
                {status === STATUS_SUCCESS && TEXT_SUCCESS}
                {status === STATUS_ERROR && TEXT_ERROR}
            </Heading>
            {children}
        </div>
    )
}

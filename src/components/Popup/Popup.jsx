import {Heading} from "../Heading/Heading.jsx";
import {
    STATUS_ERROR,
    STATUS_IDLE,
    STATUS_SUCCESS, STATUS_UPLOADING,
    TEXT_ERROR,
    TEXT_OF_HEADING,
    TEXT_SUCCESS
} from "../../utils/constants.js";
import React from "react";
import {ButtonCross} from "../ButtonCross/ButtonCross.jsx";
import closeIcon from "../../image/crossbutton.png";
import './Popup.css';

export const Popup = ({children, status, handleSetStatus}) => {
    return (
        <div
            className={`
    popup
    ${(status === STATUS_IDLE || status === STATUS_UPLOADING) ? 'defaultState' : ''}
    ${status === STATUS_SUCCESS ? 'successState' : ''}
    ${status === STATUS_ERROR ? 'errorState' : ''}
  `}
        >
            <ButtonCross handleOnClick={handleSetStatus} styleButtonCross="abortBtn"><img src={closeIcon} alt="close"/></ButtonCross>
            <Heading>
                {(status === STATUS_IDLE || status === STATUS_UPLOADING) && TEXT_OF_HEADING}
                {status === STATUS_SUCCESS && TEXT_SUCCESS}
                {status === STATUS_ERROR && TEXT_ERROR}
            </Heading>
            {children}
        </div>
    )
}

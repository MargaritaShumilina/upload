import React from "react";
import './ProgressBar.css';
import {ButtonCross} from "../ButtonCross/ButtonCross.jsx";
import deleteIcon from "../../image/delete-button.png";

export const ProgressBar = ({progress, handleAbort, fileName}) => {
    return (
        <div className="uploadingState">
            <div className="progressBarHeader">
                <span className="fileName">{fileName}</span>
                <span className="progressPercent">{progress}%</span>
                <ButtonCross styleButtonCross="abortButton" handleOnClick={handleAbort}>
                    <img src={deleteIcon} alt="delete" />
                </ButtonCross>
            </div>
            <div className="progressBarTrack">
                <div
                    className="progressBarFill"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}

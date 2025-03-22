import React from "react";
import './ProgressBar.css';

export const ProgressBar = ({progress, handleAbort, fileName}) => {
    return (
        <div className="uploadingState">
            <div className="progressBarHeader">
                <span className="fileName">{fileName}</span>
                <span className="progressPercent">{progress}%</span>
                <button className="abortButton" onClick={handleAbort}>
                    X
                </button>
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

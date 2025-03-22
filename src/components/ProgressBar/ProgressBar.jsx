import React from "react";
import './ProgressBar.css';

export const ProgressBar = ({progress, handleAbort}) => {
    return (
        <div className="uploadingState">
            <p>{progress}%</p>
            <div className="progressBar">
                <div
                    className="progressFill"
                    style={{ width: progress + '%' }}
                />
            </div>
            <button onClick={handleAbort} className="abortBtn">
                Отмена
            </button>
        </div>
    )
}

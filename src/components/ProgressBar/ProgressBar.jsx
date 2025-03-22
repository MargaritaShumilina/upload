import React from "react";
import './ProgressBar.css';

export const ProgressBar = ({progress, handleAbort, fileName}) => {
    return (
        <div className="uploadingState">
            <div className="progressBarHeader">
                {/* Слева — введённое название файла */}
                <span className="fileName">{fileName || "Безымянный"}</span>

                {/* Справа — процент загрузки */}
                <span className="progressPercent">{progress}%</span>

                {/* Кнопка прерывания загрузки */}
                <button className="abortButton" onClick={handleAbort}>
                    X
                </button>
            </div>

            {/* Сама «полоска» прогресса */}
            <div className="progressBarTrack">
                <div
                    className="progressBarFill"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}

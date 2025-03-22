import React from "react";
import {STATUS_UPLOADING, TEXT_UNDER_INPUT, TEXT_ZONE_DRAG_DROP} from "../../utils/constants.js";
import {ButtonCross} from "../ButtonCross/ButtonCross.jsx";
import deleteIcon from "../../image/delete-button.png";
import folderIcon from "../../image/docs-pic.png";
import {ProgressBar} from "../ProgressBar/ProgressBar.jsx";
import {Button} from "../Button/Button.jsx";
import {handleDragOver} from "../../utils/helpers/handleDragOver.js";
import './StartScreen.css'

export const StartScreen = ({
                                nameValue,
                                handleSetNameValue,
                                status,
                                progress,
                                handleDrop,
                                handleDeleteFile,
                                handleFileChange,
                                file,
                                handleAbort,
                                handleUpload
                            }) => {

    return (
        <>
            <label className="label">
                <span>{TEXT_UNDER_INPUT}</span>
                <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => handleSetNameValue(e.target.value)}
                    placeholder="Название файла"
                />
                <ButtonCross onClick={handleDeleteFile} className="abortBtn">
                    <img src={deleteIcon} alt="delete"/>
                </ButtonCross>
            </label>
            <div
                className="dropZone"
                onDragOver={(e) => handleDragOver(e)}
                onDrop={handleDrop}
            >
                <img src={folderIcon} alt="folder icon" className="folderIcon" />
                <p className={'input'} onChange={handleFileChange}>{TEXT_ZONE_DRAG_DROP}</p>
                {!file && <input type="file" className={'fileInput'} onChange={handleFileChange} />}
            </div>
            {status === STATUS_UPLOADING && (
                <ProgressBar progress={progress} handleAbort={handleAbort} fileName={nameValue}/>
            )}
            <Button
                styleButton="uploadBtn"
                handleUpload={handleUpload}
                disabled={status === 'uploading' || !file}
            >
                Загрузка
            </Button>
        </>
    )
}
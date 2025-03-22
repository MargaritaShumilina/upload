import React, { useState, useRef } from 'react';
import { uploadFile } from './utils/api/upload.js';
import './App.css';
import {
    ERROR_MESSAGE_CHOOSE_FILE,
    ERROR_MESSAGE_NAME_OF_FILE,
    ERROR_MESSAGE_SIZE_OF_FILE,
    ERROR_MESSAGE_TYPE_OF_FILE,
    ERROR_MESSAGE_UPLOAD_IS_REJECTED,
    ERROR_OF_UPLOAD, STATUS_ERROR, STATUS_IDLE, STATUS_SUCCESS, STATUS_UPLOADING,
    TEXT_UNDER_INPUT,
    TEXT_ZONE_DRAG_DROP
} from "./utils/constants.js";
import {isValidFileType} from "./utils/helpers/isValidFileChange.js";
import {Popup} from "./components/Popup/Popup.jsx";
import {ProgressBar} from "./components/ProgressBar/ProgressBar.jsx";
import {Button} from "./components/Button/Button.jsx";
import {ButtonCross} from "./components/ButtonCross/ButtonCross.jsx";
import deleteIcon from "./image/delete-button.png";
import folderIcon from "./image/docs-pic.png";

export default function App() {
    const [nameValue, setNameValue] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(STATUS_IDLE);
    const [progress, setProgress] = useState(0);
    const [serverResponse, setServerResponse] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const currentUploadRef = useRef(null);

    // Обработчик выбора файла
    function handleFileChange(e) {
        const chosenFile = e.target.files?.[0];
        if (!chosenFile) {
            setFile(null);
            return;
        }
        setFile(chosenFile);
    }

    // Основная функция отправки
    async function handleUpload() {
        setStatus(STATUS_IDLE);
        setServerResponse(null);
        setErrorMsg('');
        setProgress(0);

        // Валидация
        if (!nameValue.trim()) {
            setErrorMsg(ERROR_MESSAGE_NAME_OF_FILE);
            setStatus(STATUS_ERROR);
            return;
        }
        if (!file) {
            setErrorMsg(ERROR_MESSAGE_CHOOSE_FILE);
            setStatus(STATUS_ERROR);
            return;
        }
        if (!isValidFileType(file.name)) {
            setErrorMsg(ERROR_MESSAGE_TYPE_OF_FILE);
            setStatus(STATUS_ERROR);
            return;
        }
        if (file.size > 1024) {
            setErrorMsg(ERROR_MESSAGE_SIZE_OF_FILE);
            setStatus(STATUS_ERROR);
            return;
        }

        setStatus(STATUS_UPLOADING);

        // Загрузка
        const uploadPromise = uploadFile(file, nameValue, {
            onProgress: (pct) => {
                setProgress(pct);
            },
        });
        currentUploadRef.current = uploadPromise;

        try {
            const result = await uploadPromise;
            setServerResponse(result);
            setStatus(STATUS_SUCCESS);
        } catch (err) {
            console.warn(ERROR_OF_UPLOAD, err);
            setErrorMsg(err?.error || 'Неизвестная ошибка');
            setStatus(STATUS_ERROR);
        } finally {
            currentUploadRef.current = null;
        }
    }

    // Прерыване загрузки
    function handleAbort() {
        if (currentUploadRef.current) {
            currentUploadRef.current.abort();
            currentUploadRef.current = null;
            setStatus(STATUS_IDLE);
            setProgress(0);
            setErrorMsg(ERROR_MESSAGE_UPLOAD_IS_REJECTED);
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
    }
    function handleDrop(e) {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    }

    function handleDeleteFile() {
        setFile(null);
    }

    return (
        <div className="container">
            <Popup handleDeleteFile={handleDeleteFile} status={status}>
                {(status === STATUS_IDLE || status === STATUS_UPLOADING) && (
                    <>
                        <label className="label">
                            <span>{TEXT_UNDER_INPUT}</span>
                            <input
                                type="text"
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value)}
                                placeholder="Название файла"
                            />
                            <ButtonCross onClick={handleDeleteFile} className="abortBtn">
                                <img src={deleteIcon} alt="delete"/>
                            </ButtonCross>
                        </label>
                        <div
                            className="dropZone"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <img src={folderIcon} alt="folder icon" className="folderIcon" />
                            <p>{TEXT_ZONE_DRAG_DROP}</p>
                            <input type="file" onChange={handleFileChange} />
                        </div>
                        {status === STATUS_UPLOADING && (
                            <ProgressBar progress={progress} handleAbort={handleAbort} />
                        )}
                        <Button
                            styleButton="uploadBtn"
                            handleUpload={handleUpload}
                            disabled={status === 'uploading' || !file}
                        >
                            Загрузка
                        </Button>
                    </>
                )}

                {status === STATUS_SUCCESS && (
                    <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
                )}

                {status === STATUS_ERROR && (
                    <p>{errorMsg}</p>
                )}
            </Popup>
        </div>
    );
}

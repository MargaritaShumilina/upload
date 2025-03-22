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
    TEXT_OF_HEADING,
    TEXT_UNDER_INPUT,
    TEXT_ZONE_DRAG_DROP
} from "./utils/constants.js";
import {isValidFileType} from "./utils/helpers/isValidFileChange.js";
import {Heading} from "./components/Heading/Heading.jsx";
import {Popup} from "./components/Popup/Popup.jsx";
import {ProgressBar} from "./components/ProgressBar/ProgressBar.jsx";

export default function App() {
    const [nameValue, setNameValue] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(STATUS_IDLE); // idle | uploading | success | error
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
<>
        {status === STATUS_IDLE &&

        <div className="container">
            <button onClick={handleDeleteFile} className="abortBtn">
            </button>
            <Heading>{TEXT_OF_HEADING}</Heading>

            <label className="label">
                <span>{TEXT_UNDER_INPUT}</span>
                <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    placeholder="Название файла"
                />
                <button onClick={handleDeleteFile} className="abortBtn">
                    Отмена
                </button>
            </label>

            <div
                className="dropZone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <p>{TEXT_ZONE_DRAG_DROP}</p>
                <input type="file" onChange={handleFileChange} />
                {file && <p className="fileName">Выбран файл: {file.name}</p>}
            </div>

            <button
                className="uploadBtn"
                onClick={handleUpload}
                disabled={status === 'uploading'}
            >
                Загрузка
            </button>

            {status === STATUS_UPLOADING && (
                <ProgressBar progress={progress} handleAbort={handleAbort}/>
            )}
        </div>

        }
            {status === STATUS_SUCCESS && (
                <Popup style="successState">
                    <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
                </Popup>
            )}

            {status === STATUS_ERROR && (
                <Popup style="errorState" stutus={status}>
                    <p>{errorMsg}</p>
                </Popup>
            )}
</>
    );
}

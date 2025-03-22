import React, { useState, useRef } from 'react';
import { uploadFile } from './utils/api/upload.js';
import './App.css';
import {
    ERROR_MESSAGE_CHOOSE_FILE,
    ERROR_MESSAGE_NAME_OF_FILE,
    ERROR_MESSAGE_SIZE_OF_FILE,
    ERROR_MESSAGE_TYPE_OF_FILE,
    ERROR_MESSAGE_UPLOAD_IS_REJECTED,
    ERROR_OF_UPLOAD, SIZE_OF_FILE, STATUS_ERROR, STATUS_IDLE, STATUS_SUCCESS, STATUS_UPLOADING, UNKNOWN_ERROR,
} from "./utils/constants.js";
import {isValidFileType} from "./utils/helpers/isValidFileChange.js";
import {Popup} from "./components/Popup/Popup.jsx";
import {StartScreen} from "./components/StartScreen/StartScreen.jsx";

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
        if (file.size > SIZE_OF_FILE) {
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
            setErrorMsg(err?.error || UNKNOWN_ERROR);
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

    function handleSetNameValue(value) {
        setNameValue(value);
    }

    return (
        <div className="container">
            <Popup handleDeleteFile={handleDeleteFile} status={status}>
                {(status === STATUS_IDLE || status === STATUS_UPLOADING) && (
                    <StartScreen
                        nameValue={nameValue}
                        handleSetNameValue={handleSetNameValue}
                        progress={progress}
                        handleAbort={handleAbort}
                        status={status}
                        handleDeleteFile={handleDeleteFile}
                        handleDrop={handleDrop}
                        handleFileChange={handleFileChange}
                        file={file}
                        handleUpload={handleUpload}
                        />)}

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

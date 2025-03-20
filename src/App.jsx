// App.jsx
import React, { useState, useRef } from 'react';
import { uploadFile } from './upload';
import './App.css';

export default function App() {
    const [nameValue, setNameValue] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | uploading | success | error
    const [progress, setProgress] = useState(0);
    const [serverResponse, setServerResponse] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    // ref, чтобы при желании можно было вызвать abort() на xhr
    const currentUploadRef = useRef(null);

    // Проверяем формат файла
    function isValidFileType(fileName = '') {
        return (/\.(txt|json|csv)$/i).test(fileName);
    }

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
        // Сброс состояний
        setStatus('idle');
        setServerResponse(null);
        setErrorMsg('');
        setProgress(0);

        // Валидация
        if (!nameValue.trim()) {
            setErrorMsg('Введите имя перед загрузкой');
            setStatus('error');
            return;
        }
        if (!file) {
            setErrorMsg('Выберите файл');
            setStatus('error');
            return;
        }
        if (!isValidFileType(file.name)) {
            setErrorMsg('Разрешены только .txt, .json, .csv');
            setStatus('error');
            return;
        }
        if (file.size > 1024) {
            setErrorMsg('Размер файла превышает 1024 байта');
            setStatus('error');
            return;
        }

        setStatus('uploading');

        // Запускаем загрузку
        const uploadPromise = uploadFile(file, nameValue, {
            onProgress: (pct) => {
                setProgress(pct);
            },
        });
        // Сохраняем, чтобы иметь возможность .abort()
        currentUploadRef.current = uploadPromise;

        try {
            const result = await uploadPromise; // ждём ответа
            setServerResponse(result);
            setStatus('success');
        } catch (err) {
            console.warn('Ошибка при загрузке', err);
            setErrorMsg(err?.error || 'Неизвестная ошибка');
            setStatus('error');
        } finally {
            // Зачистка
            currentUploadRef.current = null;
        }
    }

    // Возможность прервать загрузку
    function handleAbort() {
        if (currentUploadRef.current) {
            currentUploadRef.current.abort();
            currentUploadRef.current = null;
            setStatus('idle');
            setProgress(0);
            setErrorMsg('Загрузка отменена пользователем');
        }
    }

    // Дополнительно: drag&drop (необязательно, но в ТЗ упоминается перетаскивание)
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

    return (
        <div className="container">
            <h2>Загрузочное окно</h2>

            {/* Поле имени */}
            <label className="label">
                <span>Имя файла (или пользователя):</span>
                <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    placeholder="Введите имя"
                />
            </label>

            {/* Зона для drag & drop + обычный выбор файла */}
            <div
                className="dropZone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <p>Перетащите файл сюда или выберите:</p>
                <input type="file" onChange={handleFileChange} />
                {file && <p className="fileName">Выбран файл: {file.name}</p>}
            </div>

            {/* Кнопка Загрузить */}
            <button
                className="uploadBtn"
                onClick={handleUpload}
                disabled={status === 'uploading'}
            >
                Загрузить
            </button>

            {/* Отображение прогресса */}
            {status === 'uploading' && (
                <div className="uploadingState">
                    <p>Загружаю... {progress}%</p>
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
            )}

            {/* Сообщение об успехе */}
            {status === 'success' && (
                <div className="successState">
                    <h4>Файл успешно загружен!</h4>
                    <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
                </div>
            )}

            {/* Сообщение об ошибке */}
            {status === 'error' && (
                <div className="errorState">
                    <h4>Ошибка при загрузке файла</h4>
                    <p>{errorMsg}</p>
                </div>
            )}
        </div>
    );
}

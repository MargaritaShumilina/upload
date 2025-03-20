// upload.js

/**
 * Типизированное обещание, к которому мы добавим метод abort().
 * @typedef {Promise<any> & { abort: () => void }} UploadPromise
 */

/**
 * Загружает файл на указанный url с помощью XMLHttpRequest.
 * Возвращает промис, к которому прикреплён метод .abort().
 *
 * @param {File} file
 * @param {string} nameValue
 * @param {Object} options
 * @param {(progress: number) => void} [options.onProgress] - Колбэк для прогресса
 * @returns {UploadPromise}
 */
export function uploadFile(file, nameValue, { onProgress } = {}) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    const promise = new Promise((resolve, reject) => {
        // Открываем POST-запрос
        xhr.open('POST', 'https://file-upload-server-mc26.onrender.com/api/v1/upload');

        // Отслеживаем прогресс
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress(percent);
            }
        };

        // Когда ответ от сервера пришёл
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(xhr.response);
            }
        };

        // Обработка сетевых ошибок (например, нет сети)
        xhr.onerror = () => {
            reject({ error: 'Network error' });
        };

        // Формируем FormData: нужно передать и файл, и имя
        const formData = new FormData();
        formData.append('file', file);      // backend ждёт поле "file"
        formData.append('name', nameValue); // backend ждёт поле "name"

        // Отправляем
        xhr.send(formData);
    });

    // Добавляем в промис метод abort
    promise.abort = () => xhr.abort();

    return /** @type {UploadPromise} */ (promise);
}

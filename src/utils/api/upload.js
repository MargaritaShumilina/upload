/**

 * @typedef {Promise<any> & { abort: () => void }} UploadPromise
 */

/**
 * @param {File} file
 * @param {string} nameValue
 * @param {Object} options
 * @param {(progress: number) => void} [options.onProgress]
 * @returns {UploadPromise}
 */
export function uploadFile(file, nameValue, { onProgress } = {}) {
    //Решила сделать с помощью XMLHttpRequest для простоты, знаю, что можно также сделать через axios
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    const promise = new Promise((resolve, reject) => {
        xhr.open('POST', 'https://file-upload-server-mc26.onrender.com/api/v1/upload');

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(xhr.response);
            }
        };

        xhr.onerror = () => {
            reject({ error: 'Network error' });
        };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', nameValue);

        xhr.send(formData);
    });

    promise.abort = () => xhr.abort();

    return /** @type {UploadPromise} */ (promise);
}

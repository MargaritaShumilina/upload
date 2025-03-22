export function isValidFileType(fileName = '') {
    return (/\.(txt|json|csv)$/i).test(fileName);
}
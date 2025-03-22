import './Button.css';

export const Button = ({children, styleButton, handleUpload, status}) => {
    return (
        <button
            className={`button ${styleButton}`}
            onClick={handleUpload}
            disabled={status === 'uploading'}
        >
            {children}
        </button>
    )
}

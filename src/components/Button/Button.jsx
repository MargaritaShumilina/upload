import './Button.css';

export const Button = ({children, styleButton, handleUpload, ...props}) => {
    return (
        <button
            className={`button ${styleButton}`}
            onClick={handleUpload}
            {...props}
        >
            {children}
        </button>
    )
}

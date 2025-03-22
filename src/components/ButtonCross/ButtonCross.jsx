import './ButtonCross.css';

export const ButtonCross = ({children, styleButtonCross, handleDeleteFile}) => {
    return (
        <button
            className={`buttonCross ${styleButtonCross}`}
            onClick={handleDeleteFile}
        >
            {children}
        </button>
    )
}
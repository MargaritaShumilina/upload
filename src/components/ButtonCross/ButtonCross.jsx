import './ButtonCross.css';

export const ButtonCross = ({children, styleButtonCross, handleOnClick}) => {
    return (
        <button
            className={`buttonCross ${styleButtonCross}`}
            onClick={handleOnClick}
        >
            {children}
        </button>
    )
}
import React from 'react';
import './ButtonLogin.css';

const ButtonLogin = ({children, onClick}) => {
    return (
        <button className="ButtonLogin" onClick={onClick}>
            {children}
        </button>
    )
}

export default ButtonLogin;
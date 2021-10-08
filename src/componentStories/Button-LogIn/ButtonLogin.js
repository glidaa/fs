import React from 'react';
import './ButtonLogin.css';

const ButtonLogin = ({children}) => {
    return (
        <button className="ButtonLogin">
            {children}
        </button>
    )
}

export default ButtonLogin;
import React from 'react';
import './Login.css';
import InputName from '../InputName/InputName';
import Button from '../Button/Button';
import ButtonLogin from '../Button-LogIn/ButtonLogin';

const Login = ({children, email, password, resetPassword, createAccount, login, onClick}) => {
    return (
        <div className="loginAccount">
            <h1>{children}</h1>
            <InputName childrenInput={email} type="email"/>
            <InputName childrenInput={password} type="password"/>
            <ButtonLogin>{resetPassword}</ButtonLogin>
            <ButtonLogin onClick={onClick}>{createAccount}</ButtonLogin>
            <Button>{login}</Button>
        </div>
    )
}

export default Login;
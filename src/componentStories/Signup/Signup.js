import React from 'react';
import './Signup.css';
import InputName from '../InputName/InputName';
import Button from '../Button/Button';
import ButtonLogin from '../Button-LogIn/ButtonLogin';

const Signup = ({children, signup, login, email, password, passwordTwo}) => {
    return (
        <div className="signup">
            <h1>{children}</h1>
            <InputName childrenInput={email} type="email"/>
            <InputName childrenInput={password} type="password"/>
            <InputName childrenInput={passwordTwo} type="password"/>
            <ButtonLogin>{login}</ButtonLogin>
            <Button>{signup}</Button>
        </div>
    )
}

export default Signup;
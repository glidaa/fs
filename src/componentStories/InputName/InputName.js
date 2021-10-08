import React from 'react';
import './InputName.css';

const InputName = ({childrenInput, type}) => {
    return (
        <input className="inputName" placeholder={childrenInput} type={type}/>
    )
}

export default InputName;
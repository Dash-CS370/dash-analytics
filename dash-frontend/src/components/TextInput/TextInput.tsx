import React from 'react';
import styles from '@/components/buttons/TextInput/TextInput.module.css';

interface TextInputProps {
    width?: string;
    height?: string;
    inputPlaceHolder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
    width = '250px',
    height = '50px',
    inputPlaceHolder = '',
}) => {
    return (
        <input
            style={{ width: width, height: height }}
            type="text"
            placeholder={inputPlaceHolder}
        ></input>
    );
};

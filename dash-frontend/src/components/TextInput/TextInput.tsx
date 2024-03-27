import React from 'react';
import styles from '@/components/TextInput/TextInput.module.css';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    width?: string;
    height?: string;
    defText?: string;
    textIndentation?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
    width = '250px',
    height = '50px',
    defText = 'Enter Here',
    textIndentation = '10px',
    className,
    ...props
}) => {
    return (
        <input
            style={{
                width: width,
                height: height,
                paddingLeft: textIndentation,
            }}
            type="text"
            placeholder={defText}
            className={`${styles.inputField} ${className}`}
        ></input>
    );
};

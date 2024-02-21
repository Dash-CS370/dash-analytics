import React from 'react';
import styles from '@/components/button/Button.module.css';
import Link from 'next/link';

const STYLES = ['btn--primary', 'btn--outline'];
const SIZES = ['btn--medium', 'btn--large'];

interface ButtonProps {
    children?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    href?: string;
    className?: string;
    buttonStyle: string;
    buttonSize: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    type,
    onClick,
    href = '/#',
    className = '',
    buttonStyle,
    buttonSize,
}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle)
        ? buttonStyle
        : STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

    return (
        <Link href={href}>
            <button
                className={`btn ${checkButtonStyle} ${checkButtonSize} ${className}`}
                onClick={onClick}
                type={type}
            >
                {children}
            </button>
        </Link>
    );
};

import React from 'react';
import styles from '@/components/buttons/PrimaryButton/PrimaryButton.module.css';
import Link from 'next/link';

interface PrimaryButtonProps {
    children?: React.ReactNode;
    className?: string;
    href?: string;
    width?: string;
    height?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    className,
    href = '',
    width = '200px',
    height = '50px',
    onClick,
    ...props
}) => {
    if (href === '') {
        return (
            <button
                className={`${styles.btn} ${className}`}
                style={{ width: width, height: height }}
                onClick={onClick}
                {...props}
            >
                {children}
            </button>
        );
    }

    return (
        <Link href={href}>
            <button
                className={`${styles.btn} ${className}`}
                style={{ width: width, height: height }}
                onClick={onClick}
                {...props}
            >
                {children}
            </button>
        </Link>
    );
};

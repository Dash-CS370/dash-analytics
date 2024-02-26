import React from 'react';
import styles from '@/components/buttons/PrimaryButton/PrimaryButton.module.css';
import Link from 'next/link';

interface PrimaryButtonProps {
    children?: React.ReactNode;
    className?: string;
    href?: string;
    width?: string;
    height?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    className,
    href = '',
    width = '200px',
    height = '50px',
    ...props
}) => {
    if (href === '') {
        return (
            <button
                className={`${styles.btn} ${className}`}
                style={{ width: width, height: height }}
                {...props}
            >
                {children}
            </button>
        );
    }

    return (
        <Link href={href}>
            <button
                className={styles.btn}
                style={{ width: width, height: height }}
                {...props}
            >
                {children}
            </button>
        </Link>
    );
};

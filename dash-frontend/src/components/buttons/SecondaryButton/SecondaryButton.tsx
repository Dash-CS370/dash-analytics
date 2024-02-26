import React from 'react';
import styles from '@/components/buttons/SecondaryButton/SecondaryButton.module.css';
import Link from 'next/link';

interface SecondaryButtonProps {
    children?: React.ReactNode;
    className?: string;
    href?: string;
    width?: string;
    height?: string;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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
                className={styles.btn}
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

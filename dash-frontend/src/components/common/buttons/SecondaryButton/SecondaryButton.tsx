import React from 'react';
import styles from '@/components/common/buttons/SecondaryButton/SecondaryButton.module.css';
import Link from 'next/link';

interface SecondaryButtonProps {
    children?: React.ReactNode;
    className?: string;
    href?: string;
    width?: string;
    height?: string;
    prefetch?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    children,
    className,
    href = '',
    width = '200px',
    height = '50px',
    prefetch = true,
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
        <button
            className={`${styles.btn} ${className}`}
            style={{ width: width, height: height }}
            {...props}
        >
            <Link className={styles.link} href={href} prefetch={prefetch}>
                {children}
            </Link>
        </button>
    );

};

import React from 'react';
import styles from '@/components/common/BaseForm/BaseForm.module.css';
import Image from 'next/image';

interface BaseFormProps {
    width?: string;
    height?: string;
    title?: string;
    children?: React.ReactNode;
}

export const BaseForm: React.FC<BaseFormProps> = ({
    width = '300px',
    height = '450px',
    title = '',
    children,
}) => {
    if (title == '') {
        return (
            <div
                className={styles.baseForm}
                style={{ width: width, height: height }}
            >
                <Image
                    src="/assets/DashLogo.svg"
                    alt="Dash Logo"
                    width="70"
                    height="70"
                />

                {children}
            </div>
        );
    }
    return (
        <div
            className={styles.baseForm}
            style={{ width: width, height: height }}
        >
            <Image
                src="/assets/DashLogo.svg"
                alt="Dash Logo"
                width="70"
                height="70"
            />
            <h1 className={styles.title}>{title}</h1>
            {children}
        </div>
    );
};

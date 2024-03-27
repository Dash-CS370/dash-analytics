'use client';

import React, { useState, useEffect, FC } from 'react';
import styles from '@/components/pages/landingPage/DynamicDescription.module.css';

export const DynamicDescription: FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const texts = [
        'to generate beautiful visualizations',
        'to precisely and swiftly analyze data',
        'to enhance team collaboration',
    ];

    useEffect(() => {
        const changeText = () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        };

        const timeoutId = setTimeout(changeText, 3000);
        const intervalId = setInterval(() => {
            clearTimeout(timeoutId);
            changeText();
        }, 3000 + 1000);
        return () => {
            clearInterval(intervalId); // Clean up the interval on component unmount
            clearTimeout(timeoutId); // Also clean up the initial timeout
        };
    }, [texts.length]);

    return (
        <div className={styles.description}>
            <span className={styles.constantDescription}>
                Harness the power of Artificial Intelligence...
            </span>
            <span className={styles.dynamicText}>{texts[currentIndex]}</span>{' '}
            {/* Applying dynamic text */}
        </div>
    );
};

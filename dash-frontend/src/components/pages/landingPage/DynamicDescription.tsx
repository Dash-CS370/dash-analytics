'use client';

import React, { useState, useEffect, useRef, FC } from 'react';
import styles from './DynamicDescription.module.css';

export const DynamicDescription: FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const textRef = useRef<HTMLSpanElement | null>(null);
    const [textWidth, setTextWidth] = useState(0);

    const texts = [
        'to generate beautiful visualizations',
        'to precisely and swiftly analyze data',
        'to enhance team collaboration',
    ];

    useEffect(() => {
        const updateTextWidth = () => {
            if (textRef.current) {
                setTextWidth(textRef.current.offsetWidth);
            }
        };

        updateTextWidth();
        window.addEventListener('resize', updateTextWidth);

        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 5000);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', updateTextWidth);
        };
    }, [texts]);

    return (
        <div className={styles.description}>
            <span className={styles.constantDescription}>
                Harness the power of Artificial Intelligence...
            </span>
            <div className={styles.dynamicContainer}>
                <span ref={textRef} className={styles.dynamicText}>
                    {texts[currentIndex]}
                    <span className={styles.dynamicCover} style={{ width: `${textWidth}px` }}></span>
                </span>
            </div>
        </div>
    );
};

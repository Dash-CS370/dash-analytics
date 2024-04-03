'use client';

import React, { useState, useEffect, FC, useRef } from 'react';
import styles from '@/components/pages/landingPage/DynamicDescription.module.css';
import Lottie from 'lottie-web';
import animationData from '@/components/pages/landingPage/running.json';

export const DynamicDescription: FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const texts = [
        'to generate beautiful visualizations',
        'to precisely and swiftly analyze data',
        'to enhance team collaboration',
    ];

    useEffect(() => {
        let animationContainer = document.getElementById(
            'animationContainer',
        ) as HTMLDivElement;
        if (animationContainer.childElementCount == 0) {
            Lottie.loadAnimation({
                container: animationContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: animationData,
            });
        }
    }, []);

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
            <div className={styles.dynamicContainer}>
                <span className={styles.dynamicText}>
                    {texts[currentIndex]}
                </span>{' '}
                <div className={styles.animationExpandingContainer}>
                    <div
                        id="animationContainer"
                        className={styles.animationContainer}
                    ></div>
                </div>
            </div>
            {/* Applying dynamic text */}
        </div>
    );
};

'use client';

import React, { useState, useEffect, FC } from 'react';
import { Button } from '@/components/button/Button';
import '@/components/landingPageHero/HeroSection.module.css';

export const HeroSection: FC = () => {
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
        <div className="hero-container">
            <video
                className="video"
                src="/videos/dash-2.mp4"
                autoPlay
                loop
                muted
            />
            <div className="black-rectangle"></div>

            <div id="slogans-container">
                <div id="slogan-1">
                    <span className="basic_text">Dash</span>
                </div>
                <div id="slogan-2">
                    <span className="basic_text">Analytics</span>
                </div>
            </div>

            <div id="description">
                <span id="basic_text">
                    Harness the power of Artificial Intelligence...
                </span>
                <span className="dynamic-text">{texts[currentIndex]}</span>{' '}
                {/* Applying dynamic text */}
            </div>

            <div className="hero-btns">
                <Button
                    className="btns"
                    buttonStyle="btn--outline"
                    buttonSize="btn--large"
                    href="/signup"
                >
                    Get Started
                </Button>

                <Button
                    className="btns"
                    buttonStyle="btn--primary"
                    buttonSize="btn--large"
                >
                    Learn More <i className="far fa-play-circle"></i>
                </Button>
            </div>
        </div>
    );
};

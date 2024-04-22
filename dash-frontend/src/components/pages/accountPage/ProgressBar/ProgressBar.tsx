'use client';
import React from 'react';
import Styles from './ProgressBar.module.css';

const ProgressBar = (props: { bgcolor: any; completed: any }) => {
    const { bgcolor, completed } = props;

    return (
        <div className={Styles.progressBarContainer}>
            <div
                className={Styles.progressBarFiller}
                style={{ width: `${completed}%`, backgroundColor: bgcolor }}
            >
                <span className={Styles.progressBarLabel}>
                    {`${completed}%`}
                </span>
            </div>
        </div>
    );
};

export default ProgressBar;

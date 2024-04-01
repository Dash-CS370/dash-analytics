'use client';

import React from 'react';
import styles from '@/components/widgets/widgetPipeline/WidgetCard/WidgetCard.module.css';
import { TiPin, TiPinOutline } from 'react-icons/ti';
import { BsArrowsAngleContract, BsArrowsAngleExpand } from 'react-icons/bs';

interface WidgetCardProps {
    title: string;
    pinned?: boolean;
    expanded?: boolean;
    onExpand: () => void;
    onTogglePin: () => void;
    children: React.ReactNode;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
    title,
    pinned = true,
    expanded = false,
    onExpand,
    onTogglePin,
    children,
}) => {
    const [isExpanded, setIsExpanded] = React.useState(expanded);
    const toggleExpand = () => {
        // setIsExpanded(!isExpanded);
        onExpand();
    };

    const [isPinned, setIsPinned] = React.useState(pinned);
    const togglePinned = () => {
        setIsPinned(!isPinned);
        onTogglePin();
    };

    const cardClassName = `${styles.widgetCard} ${
        isExpanded ? styles.expanded : styles.default
    }`;

    return (
        <div className={cardClassName}>
            <div className={styles.widgetCardHeader}>
                <h1>{title}</h1>
                <div className={styles.widgetHeaderButtons}>
                    {isPinned ? (
                        <TiPin onClick={togglePinned} />
                    ) : (
                        <TiPinOutline onClick={togglePinned} />
                    )}
                    {isExpanded ? (
                        <BsArrowsAngleContract onClick={toggleExpand} />
                    ) : (
                        <BsArrowsAngleExpand onClick={toggleExpand} />
                    )}
                </div>
            </div>
            <div className={styles.widgetCardContent}>{children}</div>
        </div>
    );
};

'use client';

import React from 'react';
import styles from '@/components/widgets/widgetPipeline/WidgetCard/WidgetCard.module.css';
import { TiPin, TiPinOutline } from 'react-icons/ti';
import { BsArrowsAngleContract, BsArrowsAngleExpand } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';
import { FiCheck } from 'react-icons/fi';
import { IoMdInformationCircleOutline } from 'react-icons/io';

interface WidgetCardProps {
    title: string;
    description: string;
    id: string;
    pinned?: boolean;
    expanded?: boolean;
    onExpand: () => void;
    onTogglePin: () => void;
    children: React.ReactNode;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
    title,
    description,
    id,
    pinned = true,
    expanded = false,
    onExpand,
    onTogglePin,
    children,
}) => {
    // handle showing information about the widget
    const [info, setInfo] = React.useState(false);
    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setInfo(!info);
    };

    // handle pinning the widget
    const [isPinned, setIsPinned] = React.useState(pinned);
    const togglePinned = () => {
        setIsPinned(!isPinned);
        onTogglePin();
    };

    const cardClassName = `${styles.widgetCard} ${
        expanded ? styles.expanded : styles.default
    }`;

    return (
        <div className={cardClassName}>
            <div className={styles.widgetCardHeader}>
                <div
                    className={`${styles.widgetTitle} ${
                        expanded ? styles.expandedTitle : ''
                    }`}
                >
                    <h1>{title}</h1>
                </div>
                <div className={styles.widgetHeaderButtons}>
                    <IoMdInformationCircleOutline
                        className={styles.icon}
                        onClick={handleInfoClick}
                    />
                    {isPinned && !expanded && (
                        <TiPin onClick={togglePinned} className={styles.icon} />
                    )}
                    {expanded ? (
                        <BsArrowsAngleContract
                            onClick={onExpand}
                            className={styles.icon}
                        />
                    ) : (
                        <BsArrowsAngleExpand
                            onClick={onExpand}
                            className={styles.icon}
                        />
                    )}
                </div>
            </div>

            {info ? (
                <div className={styles.widgetCardContent}>
                    <p>{description}</p>
                </div>
            ) : (
                <div className={styles.widgetCardContent}>{children}</div>
            )}
        </div>
    );
};

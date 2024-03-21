import React from 'react';
import styles from '@/components/widgets/widgetPipeline/WidgetCard/WidgetCard.module.css';
import { TiPin, TiPinOutline } from 'react-icons/ti';
import { BsArrowsAngleContract, BsArrowsAngleExpand } from 'react-icons/bs';

interface WidgetCardProps {
    title: string;
    type?: string; // TODO: Change to enum (default, thumbnail, expanded)
    pinned?: boolean;
    children: React.ReactNode;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
    title,
    type = 'default',
    pinned = true,
    children,
}) => {
    if (type === 'thumbnail') {
        // TODO: handle thumbnail type
    }
    let w = '';
    let h = '';
    let expanded = false;
    if (type === 'default') {
        w = '450px';
        h = '300px';
    } else if (type === 'expanded') {
        w = '650px';
        h = '500px';
        expanded = true;
    }

    return (
        <div className={styles.widgetCard} style={{ width: w, height: h }}>
            <div className={styles.widgetCardHeader}>
                <h1>{title}</h1>
                <div className={styles.widgetHeaderButtons}>
                    {pinned ? <TiPin /> : <TiPinOutline />}
                    {expanded ? (
                        <BsArrowsAngleContract />
                    ) : (
                        <BsArrowsAngleExpand />
                    )}
                </div>
            </div>
            <div className={styles.widgetCardContent}>{children}</div>
        </div>
    );
};

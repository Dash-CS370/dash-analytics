'use client';

import React from 'react';
import styles from '@/components/widgets/graphWidgets/StatisticsWidget/StatisticsWidget.module.css';
import { WidgetCard } from '../../widgetPipeline/WidgetCard/WidgetCard';
import { BaseGraphProps } from '../../WidgetTypes';

export const StatisticsWidget: React.FC<BaseGraphProps> = ({
    config,
    isExpanded = false,
    onExpand = () => {},
    onTogglePin = () => {},
    onEditTitle = () => {},
}) => {
    const tempStats = {
        mean: 0,
        median: 0,
        high: 0,
        low: 0,
    };

    return (
        <WidgetCard
            title={config.title}
            description={config.description}
            id={config.id}
            pinned={true}
            expanded={isExpanded}
            onExpand={onExpand}
            onTogglePin={onTogglePin}
            onEditTitle={onEditTitle}
        >
            <div
                className={`${styles.statsGrid} ${
                    isExpanded ? styles.expanded : ''
                }`}
            >
                <div
                    className={`${styles.stat} ${
                        isExpanded ? styles.expanded : ''
                    }`}
                >
                    <h3>Mean</h3>
                    <p>{tempStats.mean}</p>
                </div>
                <div
                    className={`${styles.stat} ${
                        isExpanded ? styles.expanded : ''
                    }`}
                >
                    <h3>Median</h3>
                    <p>{tempStats.median}</p>
                </div>
                <div
                    className={`${styles.stat} ${
                        isExpanded ? styles.expanded : ''
                    }`}
                >
                    <h3>High</h3>
                    <p>{tempStats.high}</p>
                </div>
                <div
                    className={`${styles.stat} ${
                        isExpanded ? styles.expanded : ''
                    }`}
                >
                    <h3>Low</h3>
                    <p>{tempStats.low}</p>
                </div>
            </div>
        </WidgetCard>
    );
};

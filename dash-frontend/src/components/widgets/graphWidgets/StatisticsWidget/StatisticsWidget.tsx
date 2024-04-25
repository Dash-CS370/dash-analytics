'use client';

import React, { use, useEffect } from 'react';
import styles from '@/components/widgets/graphWidgets/StatisticsWidget/StatisticsWidget.module.css';
import { WidgetCard } from '../../widgetPipeline/WidgetCard/WidgetCard';
import { BaseGraphProps } from '../../WidgetTypes';
import { DataFrame, Series } from 'danfojs';
import { generateStatsCard } from '@/components/dataPipeline/dataOperations/statsCardPipeline';

export const StatisticsWidget: React.FC<BaseGraphProps> = ({
    config,
    isExpanded = false,
    onExpand = () => {},
    onTogglePin = () => {},
}) => {
    const [isNumerical, setIsNumerical] = React.useState<boolean>(true);

    const tempNumericalStats = [
        ['mean', '-'],
        ['median', '-'],
        ['high', '-'],
        ['low', '-'],
    ];
    const [stats, setStats] =
        React.useState<(string | number)[][]>(tempNumericalStats);

    useEffect(() => {
        // assuming config.data is json with a single col in each row
        let df = new DataFrame(config.data);
        let series = df.column(config.columns[0]);
        let stats = generateStatsCard(series);
        setStats(stats);

        if (stats.length == 4) {
            setIsNumerical(true);
        } else {
            setIsNumerical(false);
        }
    }, [config.data, config.columns]);

    if (isNumerical) {
        return (
            <WidgetCard
                title={config.title}
                description={config.description}
                id={config.id}
                pinned={true}
                expanded={isExpanded}
                onExpand={onExpand}
                onTogglePin={onTogglePin}
            >
                <div className={styles.gridContainer}>
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
                            <p>{stats[0][1]}</p>
                        </div>
                        <div
                            className={`${styles.stat} ${
                                isExpanded ? styles.expanded : ''
                            }`}
                        >
                            <h3>Median</h3>
                            <p>{stats[1][1]}</p>
                        </div>
                        <div
                            className={`${styles.stat} ${
                                isExpanded ? styles.expanded : ''
                            }`}
                        >
                            <h3>High</h3>
                            <p>{stats[3][1]}</p>
                        </div>
                        <div
                            className={`${styles.stat} ${
                                isExpanded ? styles.expanded : ''
                            }`}
                        >
                            <h3>Low</h3>
                            <p>{stats[2][1]}</p>
                        </div>
                    </div>
                </div>
            </WidgetCard>
        );
    } else {
        return (
            <WidgetCard
                title={config.title}
                description={config.description}
                id={config.id}
                pinned={true}
                expanded={isExpanded}
                onExpand={onExpand}
                onTogglePin={onTogglePin}
            >
                <div className={styles.gridContainer}>
                    <div className={styles.categoricalGrid}>
                        {stats.map((stat, index) => (
                            <div key={index} className={styles.categoricalStat}>
                                <h3>{stat[0]}</h3>
                                <div
                                    className={styles.categoricalStatDivider}
                                />
                                <p>{stat[1]}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </WidgetCard>
        );
    }
};

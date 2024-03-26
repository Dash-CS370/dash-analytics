'use client';

import styles from '@/components/widgets/widgetPipeline/WidgetLayout/WidgetLayout.module.css';
import React, { useState } from 'react';
import { WidgetRenderer } from '../WidgetRenderer/WidgetRenderer';
import { WidgetConfig } from '../../WidgetTypes';

interface WidgetLayoutProps {
    initialConfigs: WidgetConfig[];
}

export const WidgetLayout: React.FC<WidgetLayoutProps> = ({
    initialConfigs,
}) => {
    const [configs, setConfigs] = useState(initialConfigs);
    const togglePinned = (id: string) => {
        const newConfigs = configs.map((config) => {
            if (config.id === id) {
                return { ...config, pinned: !config.pinned };
            }
            return config;
        });
        setConfigs(newConfigs);
    };

    const [expandedWidgetId, setExpandedWidgetId] = useState('');
    const handleExpand = (id: string) => {
        setExpandedWidgetId(expandedWidgetId === id ? '' : id);
    };

    const pinnedConfigs = configs.filter((config) => config.pinned);

    return (
        <div className={styles.content}>
            <div
                className={`${styles.focusBlur} ${
                    expandedWidgetId === '' ? '' : styles.active
                }`}
            ></div>
            <h1 className={styles.dashboardTitle}>Dashboard</h1>
            <div className={styles.widgetGrid}>
                {pinnedConfigs.map((config: WidgetConfig) => (
                    <WidgetRenderer
                        key={config.id}
                        config={config}
                        isExpanded={expandedWidgetId === config.id}
                        onExpand={() => handleExpand(config.id)}
                        onTogglePin={() => togglePinned(config.id)}
                    />
                ))}
            </div>
        </div>
    );
};

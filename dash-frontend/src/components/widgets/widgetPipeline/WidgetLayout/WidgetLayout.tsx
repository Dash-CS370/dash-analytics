'use client';

import styles from '@/components/widgets/widgetPipeline/WidgetLayout/WidgetLayout.module.css';
import React from 'react';
import { WidgetRenderer } from '../WidgetRenderer/WidgetRenderer';
import { WidgetConfig } from '../../WidgetTypes';

interface WidgetLayoutProps {
    configs: WidgetConfig[];
}

export const WidgetLayout: React.FC<WidgetLayoutProps> = ({ configs }) => {
    const pinnedConfigs = configs.filter((config) => config.pinned);

    return (
        <div className={styles.content}>
            <h1 className={styles.dashboardTitle}>Dashboard</h1>
            <div className={styles.widgetGrid}>
                {pinnedConfigs.map((config: WidgetConfig) => (
                    <WidgetRenderer
                        key={config.id}
                        graphType={config.graphType}
                        graphInfo={{
                            title: config.title,
                            data: config.data,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

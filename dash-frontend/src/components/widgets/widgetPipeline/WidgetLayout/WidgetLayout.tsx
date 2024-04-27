'use client';

import styles from '@/components/widgets/widgetPipeline/WidgetLayout/WidgetLayout.module.css';
import React, { useState } from 'react';
import { WidgetRenderer } from '../WidgetRenderer/WidgetRenderer';
import { ProjectConfig, WidgetConfig } from '../../WidgetTypes';
import { UnpinnedWidgets } from '../UnpinnedWidgets/UnpinnedWidgets';

interface WidgetLayoutProps {
    projectConfig: ProjectConfig;
    togglePinned: (id: string) => void;
    editWidgetTitle: (id: string, newTitle: string) => void;
    fetchMoreWidgets: () => void;
}

export const WidgetLayout: React.FC<WidgetLayoutProps> = ({
    projectConfig,
    togglePinned,
    editWidgetTitle,
    fetchMoreWidgets,
}) => {
    // track state of expanded widget
    const [expandedWidgetId, setExpandedWidgetId] = useState('');
    const handleExpand = (id: string) => {
        setExpandedWidgetId(expandedWidgetId === id ? '' : id);
    };

    // separate pinned and unpinned widgets lists to render from
    const pinnedConfigs = projectConfig.widgets.filter(
        (config) => config.pinned,
    );
    const unpinnedConfigs = projectConfig.widgets.filter(
        (config) => !config.pinned,
    );

    return (
        <div className={styles.content}>
            <div
                className={`${styles.focusBlur} ${
                    expandedWidgetId === '' ? '' : styles.active
                }`}
            ></div>
            <h1 className={styles.dashboardTitle}>
                {projectConfig.project_name}
            </h1>
            <div className={styles.widgetGrid}>
                {pinnedConfigs.map((config: WidgetConfig) => {
                    if (config.title === 'DO_NOT_RENDER') return null;

                    return (
                        <>
                            <WidgetRenderer
                                key={config.id}
                                config={config}
                                isExpanded={false}
                                onExpand={() => handleExpand(config.id)}
                                onTogglePin={() => togglePinned(config.id)}
                                onEditTitle={editWidgetTitle}
                            />
                            {expandedWidgetId === config.id && (
                                <WidgetRenderer
                                    key={`${config.id}-expanded`}
                                    config={config}
                                    isExpanded={true}
                                    onExpand={() => handleExpand(config.id)}
                                    onTogglePin={() => togglePinned(config.id)}
                                    onEditTitle={editWidgetTitle}
                                />
                            )}
                        </>
                    );
                })}
            </div>
            <UnpinnedWidgets
                unpinnedConfigs={unpinnedConfigs}
                handleClick={togglePinned}
                fetchMoreWidgets={fetchMoreWidgets}
            />
        </div>
    );
};

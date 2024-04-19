'use client';

import React, { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    ScatterChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Scatter,
} from 'recharts';
import { WidgetCard } from '../../widgetPipeline/WidgetCard/WidgetCard';
import { BaseGraphProps } from '../../WidgetTypes';

export const ScatterPlotWidget: React.FC<BaseGraphProps> = ({
    config,
    isExpanded = false,
    onExpand = () => {},
    onTogglePin = () => {},
    onEditTitle = () => {},
}) => {
    const keys = config.data.length > 0 ? Object.keys(config.data[0]) : [];
    const xDataKey = keys.length > 0 ? keys[0] : '';

    console.log();

    const [colors, setColors] = useState<string[]>([]);

    useEffect(() => {
        const rootStyle = getComputedStyle(document.documentElement);
        setColors([
            rootStyle.getPropertyValue('--primary'),
            rootStyle.getPropertyValue('--secondary'),
            rootStyle.getPropertyValue('--alternative'),
        ]);
    }, []);

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
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: -20,
                        left: -5,
                    }}
                >
                    <CartesianGrid />
                    <XAxis type="number" dataKey={xDataKey} />
                    <YAxis type="number" dataKey={keys[1]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter data={config.data} fill={colors[0]} />
                </ScatterChart>
            </ResponsiveContainer>
        </WidgetCard>
    );
};

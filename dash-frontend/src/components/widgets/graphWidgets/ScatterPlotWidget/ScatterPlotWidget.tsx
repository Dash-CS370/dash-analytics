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
    ZAxis,
} from 'recharts';
import { WidgetCard } from '../../widgetPipeline/WidgetCard/WidgetCard';
import { BaseGraphProps } from '../../WidgetTypes';
import { processAndSliceDF } from '@/components/dataPipeline/dataOperations/smoothData';

export const ScatterPlotWidget: React.FC<BaseGraphProps> = ({
    config,
    isExpanded = false,
    onExpand = () => {},
    onTogglePin = () => {},
    onEditTitle = () => {},
}) => {
    const keys = config.data.length > 0 ? Object.keys(config.data[0]) : [];

    const [colors, setColors] = useState<string[]>([]);

    useEffect(() => {
        const rootStyle = getComputedStyle(document.documentElement);
        setColors([
            rootStyle.getPropertyValue('--primary'),
            rootStyle.getPropertyValue('--secondary'),
            rootStyle.getPropertyValue('--alternative'),
            'red',
            'blue',
            'orange',
        ]);
    }, []);

    const data = processAndSliceDF(config.data, 1000, 1);

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
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 0,
                        left: -5,
                    }}
                >
                    <CartesianGrid />
                    <XAxis type="number" dataKey={keys[0]} />
                    <YAxis type="number" dataKey={keys[1]} />
                    <ZAxis range={[30, 31]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter data={data} fill={colors[0]} />
                </ScatterChart>
            </ResponsiveContainer>
        </WidgetCard>
    );
};

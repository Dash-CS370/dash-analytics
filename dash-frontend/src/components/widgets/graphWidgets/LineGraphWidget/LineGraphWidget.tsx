'use client';

import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    Line,
    XAxis,
    YAxis,
} from 'recharts';
import { WidgetCard } from '../../widgetPipeline/WidgetCard/WidgetCard';
import { BaseGraphProps } from '../../WidgetTypes';
import { processAndSliceDF } from '@/components/dataPipeline/dataOperations/smoothData';

export const LineGraphWidget: React.FC<BaseGraphProps> = ({
    config,
    isExpanded = false,
    onExpand = () => {},
    onTogglePin = () => {},
}) => {
    const keys = config.data.length > 0 ? Object.keys(config.data[0]) : [];
    const xDataKey = keys.length > 0 ? keys[0] : '';

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

    const data = processAndSliceDF(config.data, 1500, 1);

    const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

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
                <LineChart data={data} width={500} height={300}>
                    <XAxis dataKey={xDataKey} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {keys.slice(1).map((key, i) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={randomColor()}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </WidgetCard>
    );
};

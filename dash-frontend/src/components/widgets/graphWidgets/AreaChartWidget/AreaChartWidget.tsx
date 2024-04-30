'use client';

import React, { useEffect, useState } from 'react';
import {
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    AreaChart,
    Area,
} from 'recharts';
import { WidgetCard } from '../../widgetPipeline/WidgetCard/WidgetCard';
import { BaseGraphProps } from '../../WidgetTypes';
import { processAndSliceDF } from '@/components/dataPipeline/dataOperations/smoothData';

export const AreaChartWidget: React.FC<BaseGraphProps> = ({
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
                <AreaChart data={data} width={500} height={300}>
                    <XAxis dataKey={xDataKey} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {keys.slice(1).map((key, i) => (
                        <Area
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={colors[i % colors.length]}
                            fill={colors[i % colors.length]}
                            dot={false}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </WidgetCard>
    );
};

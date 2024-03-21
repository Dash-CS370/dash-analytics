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

export const LineGraphWidget: React.FC<BaseGraphProps> = ({ title, data }) => {
    const keys = data.length > 0 ? Object.keys(data[0]) : [];
    const xDataKey = keys.length > 0 ? keys[0] : '';

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
        <WidgetCard title={title} type="default" pinned={true}>
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
                            stroke={colors[i % colors.length]}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </WidgetCard>
    );
};

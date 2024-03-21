'use client';

import React, { useEffect, useState } from 'react';
import { BaseGraphProps } from '../../WidgetTypes';
import {
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
} from 'recharts';
import { WidgetCard } from '../../widgetPipeline/WidgetCard/WidgetCard';

export const BarChartWidget: React.FC<BaseGraphProps> = ({ title, data }) => {
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
                <BarChart data={data} width={500} height={300}>
                    <XAxis dataKey={xDataKey} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {keys.slice(1).map((key, i) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={colors[i % colors.length]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </WidgetCard>
    );
};

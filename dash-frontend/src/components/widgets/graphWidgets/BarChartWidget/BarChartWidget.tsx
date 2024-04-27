'use client';

import React, { useEffect, useState } from 'react';
import { BaseGraphProps, DataItem } from '../../WidgetTypes';
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
import { DataFrame, toJSON } from 'danfojs';
import { convertDataItems, generateBarChart } from '@/components/dataPipeline/dataOperations/BarChartRenderer';

export const BarChartWidget: React.FC<BaseGraphProps> = ({
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

    // group data by xDataKey
    let groupedData;
    try {
        let df = new DataFrame(convertDataItems(config.data));
        const groupedDataDF = generateBarChart(df);
        groupedData = toJSON(groupedDataDF) as DataItem[];
    } catch (error) {
        config.title = "DO_NOT_RENDER";
    }

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
                <BarChart data={groupedData} width={500} height={300}>
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

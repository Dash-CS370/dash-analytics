'use client';

import React, { useEffect, useState } from 'react';
import { BaseThumbnailProps, DataItem } from '../../WidgetTypes';
import { GraphThumbnail } from '../../widgetPipeline/GraphThumbnail/GraphThumbnail';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { generateBarChart} from '@/components/dataPipeline/dataOperations/BarChartRenderer';
import { DataFrame, toJSON } from 'danfojs';
import {exampleConfigs, exampleProjects} from "@/components/widgets/TestData";

export const BarChartThumbnail: React.FC<BaseThumbnailProps> = ({
    title,
    description,
    data,
    handleClick,
}) => {
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
    let df = new DataFrame(exampleConfigs[0].data);
    const groupedDataDF = generateBarChart(df);
    const groupedData = toJSON(groupedDataDF) as DataItem[];

    const keys = groupedData.length > 0 ? Object.keys(groupedData[0]) : [];
    const xDataKey = keys.length > 0 ? keys[0] : '';

    return (
        <GraphThumbnail
            title={title}
            description={description}
            handleClick={handleClick}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={groupedData}
                    width={500}
                    height={300}
                    margin={{ left: -45, bottom: -15, top: 15, right: 15 }}
                >
                    <XAxis dataKey={xDataKey} tick={false} />
                    <YAxis tick={false} />
                    {keys.slice(1).map((key, i) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={colors[i % colors.length]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </GraphThumbnail>
    );
};

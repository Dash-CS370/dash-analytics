'use client';

import React, { useEffect, useState } from 'react';
import { BaseThumbnailProps } from '../../WidgetTypes';
import { GraphThumbnail } from '../../widgetPipeline/GraphThumbnail/GraphThumbnail';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {processAndSliceDF} from "@/components/dataPipeline/dataOperations/smoothData";

export const LineGraphThumbnail: React.FC<BaseThumbnailProps> = ({
    title,
    description,
    data,
    handleClick,
}) => {
    const keys = data.length > 0 ? Object.keys(data[0]) : [];
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
            'orange'
        ]);
    }, []);

    const slicedData = processAndSliceDF(data, 100, 1);

    return (
        <GraphThumbnail
            title={title}
            description={description}
            handleClick={handleClick}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={slicedData}
                    width={500}
                    height={300}
                    margin={{ left: -45, bottom: -15, top: 15, right: 15 }}
                >
                    <XAxis dataKey={xDataKey} tick={false} />
                    <YAxis tick={false} />
                    {keys.slice(1).map((key, i) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            fill={colors[i % colors.length]}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </GraphThumbnail>
    );
};

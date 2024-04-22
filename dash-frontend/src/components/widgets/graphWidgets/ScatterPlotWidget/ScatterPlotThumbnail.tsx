'use client';

import React, { useEffect, useState } from 'react';
import { BaseThumbnailProps } from '../../WidgetTypes';
import { GraphThumbnail } from '../../widgetPipeline/GraphThumbnail/GraphThumbnail';
import {
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    XAxis,
    YAxis,
} from 'recharts';

export const ScatterPlotThumbnail: React.FC<BaseThumbnailProps> = ({
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
        ]);
    }, []);

    return (
        <GraphThumbnail
            title={title}
            description={description}
            handleClick={handleClick}
        >
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <XAxis type="number" dataKey={xDataKey} />
                    <YAxis type="number" dataKey={keys[1]} />
                    <Scatter data={data} fill={colors[0]} />
                </ScatterChart>
            </ResponsiveContainer>
        </GraphThumbnail>
    );
};

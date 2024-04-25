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
    ZAxis,
} from 'recharts';
import { processAndSliceDF } from '@/components/dataPipeline/dataOperations/smoothData';

export const ScatterPlotThumbnail: React.FC<BaseThumbnailProps> = ({
    title,
    description,
    data,
    handleClick,
}) => {
    const keys = data.length > 0 ? Object.keys(data[0]) : [];

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

    const slicedData = processAndSliceDF(data, 100, 1);

    return (
        <GraphThumbnail
            title={title}
            description={description}
            handleClick={handleClick}
        >
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{ top: 15, right: 15, bottom: -15, left: -45 }}
                >
                    <XAxis type="number" dataKey={keys[0]} tick={false} />
                    <YAxis type="number" dataKey={keys[1]} tick={false} />
                    <ZAxis range={[30, 31]} />
                    <Scatter
                        data={slicedData}
                        fill={colors[0]}
                        strokeWidth={1}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </GraphThumbnail>
    );
};

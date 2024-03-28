import React from 'react';
import { LineGraphWidget } from '../../graphWidgets/LineGraphWidget/LineGraphWidget';
import { BaseGraphProps, WidgetConfig } from '../../WidgetTypes';
import { BarChartWidget } from '../../graphWidgets/BarChartWidget/BarChartWidget';
import { BarChartThumbnail } from '../../graphWidgets/BarChartWidget/BarChartThumbnail';
import { LineGraphThumbnail } from '../../graphWidgets/LineGraphWidget/LineGraphThumbnail';

const renderThumbnail = (config: WidgetConfig, handleClick: () => void) => {
    switch (config.graphType) {
        case 'bar_chart':
            return (
                <BarChartThumbnail
                    title={config.title}
                    description={'config.description'} // TODO: add description to config
                    data={config.data}
                    handleClick={handleClick}
                />
            );
        case 'line_graph':
            return (
                <LineGraphThumbnail
                    title={config.title}
                    description={'config.description'} // TODO: add description to config
                    data={config.data}
                    handleClick={handleClick}
                />
            );
        default:
            throw new Error(`${config.graphType} is not a valid graph type`);
    }
};

interface ThumbnailRendererProps {
    config: WidgetConfig;
    handleClick: () => void;
}

export const ThumbnailRenderer: React.FC<ThumbnailRendererProps> = ({
    config,
    handleClick = () => {},
}) => {
    return renderThumbnail(config, handleClick);
};

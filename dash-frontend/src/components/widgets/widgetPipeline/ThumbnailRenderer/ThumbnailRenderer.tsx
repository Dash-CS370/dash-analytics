import React from 'react';
import { WidgetConfig } from '../../WidgetTypes';
import { BarChartThumbnail } from '../../graphWidgets/BarChartWidget/BarChartThumbnail';
import { LineGraphThumbnail } from '../../graphWidgets/LineGraphWidget/LineGraphThumbnail';
import { AreaChartThumbnail } from '../../graphWidgets/AreaChartWidget/AreaChartThumbnail';
import { ScatterPlotThumbnail } from '../../graphWidgets/ScatterPlotWidget/ScatterPlotThumbnail';
import { StatisticsThumbnail } from '../../graphWidgets/StatisticsWidget/StatisticsThumbnail';

// Renders the appropriate thumbnail based on the graph type
const renderThumbnail = (config: WidgetConfig, handleClick: () => void) => {
    switch (config.graphType) {
        case 'BAR_GRAPH':
            return (
                <BarChartThumbnail
                    title={config.title}
                    description={'config.description'} // TODO: add description to config
                    data={config.data}
                    handleClick={handleClick}
                />
            );
        case 'LINE_GRAPH':
            return (
                <LineGraphThumbnail
                    title={config.title}
                    description={'config.description'} // TODO: add description to config
                    data={config.data}
                    handleClick={handleClick}
                />
            );
        case 'AREA_CHART':
            return (
                <AreaChartThumbnail
                    title={config.title}
                    description={'config.description'} // TODO: add description to config
                    data={config.data}
                    handleClick={handleClick}
                />
            );
        case 'SCATTER_PLOT':
            return (
                <ScatterPlotThumbnail
                    title={config.title}
                    description={'config.description'} // TODO: add description to config
                    data={config.data}
                    handleClick={handleClick}
                />
            );
        case 'STATISTICS_CARD':
            return (
                <StatisticsThumbnail
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

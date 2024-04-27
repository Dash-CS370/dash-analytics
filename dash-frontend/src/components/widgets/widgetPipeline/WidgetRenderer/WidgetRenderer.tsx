import React from 'react';
import { LineGraphWidget } from '../../graphWidgets/LineGraphWidget/LineGraphWidget';
import { WidgetConfig } from '../../WidgetTypes';
import { BarChartWidget } from '../../graphWidgets/BarChartWidget/BarChartWidget';
import { AreaChartWidget } from '../../graphWidgets/AreaChartWidget/AreaChartWidget';
import { ScatterPlotWidget } from '../../graphWidgets/ScatterPlotWidget/ScatterPlotWidget';
import { StatisticsWidget } from '../../graphWidgets/StatisticsWidget/StatisticsWidget';

// Renders the appropriate widget based on the graph type
const renderWidget = (
    config: WidgetConfig,
    isExpanded: boolean,
    onExpand: () => void,
    onTogglePin: () => void,
    onEditTitle: (id: string, newTitle: string) => void,
) => {
    switch (config.graphType) {
        case 'BAR_GRAPH':
            return (
                <BarChartWidget
                    config={config}
                    isExpanded={isExpanded}
                    onExpand={onExpand}
                    onTogglePin={onTogglePin}
                    onEditTitle={() => {}}
                />
            );
        case 'LINE_GRAPH':
            return (
                <LineGraphWidget
                    config={config}
                    isExpanded={isExpanded}
                    onExpand={onExpand}
                    onTogglePin={onTogglePin}
                    onEditTitle={() => {}}
                />
            );
        case 'AREA_CHART':
            return (
                <AreaChartWidget
                    config={config}
                    isExpanded={isExpanded}
                    onExpand={onExpand}
                    onTogglePin={onTogglePin}
                    onEditTitle={() => {}}
                />
            );
        case 'SCATTER_PLOT':
            return (
                <ScatterPlotWidget
                    config={config}
                    isExpanded={isExpanded}
                    onExpand={onExpand}
                    onTogglePin={onTogglePin}
                    onEditTitle={() => {}}
                />
            );
        case 'STATISTICS_CARD':
            return (
                <StatisticsWidget
                    config={config}
                    isExpanded={isExpanded}
                    onExpand={onExpand}
                    onTogglePin={onTogglePin}
                    onEditTitle={() => {}}
                />
            );
        default:
            throw new Error(`${config.graphType} is not a valid graph type`);
    }
};

interface WidgetRendererProps {
    config: WidgetConfig;
    isExpanded: boolean;
    onExpand: () => void;
    onTogglePin: () => void;
    onEditTitle: (id: string, newTitle: string) => void;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
    config,
    isExpanded = false,
    onExpand = () => {},
    onTogglePin = () => {},
    onEditTitle = () => {},
}) => {
    return renderWidget(config, isExpanded, onExpand, onTogglePin, onEditTitle);
};

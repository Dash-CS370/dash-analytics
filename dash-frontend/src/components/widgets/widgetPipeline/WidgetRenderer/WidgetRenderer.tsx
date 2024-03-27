import React from 'react';
import { LineGraphWidget } from '../../graphWidgets/LineGraphWidget/LineGraphWidget';
import { BaseGraphProps, WidgetConfig } from '../../WidgetTypes';
import { BarChartWidget } from '../../graphWidgets/BarChartWidget/BarChartWidget';

const renderWidget = (
    config: WidgetConfig,
    isExpanded: boolean,
    onExpand: () => void,
    onTogglePin: () => void,
) => {
    switch (config.graphType) {
        case 'bar_chart':
            return (
                <BarChartWidget
                    config={config}
                    isExpanded={isExpanded}
                    onExpand={onExpand}
                    onTogglePin={onTogglePin}
                />
            );
        case 'line_graph':
            return (
                <LineGraphWidget
                    config={config}
                    isExpanded={isExpanded}
                    onExpand={onExpand}
                    onTogglePin={onTogglePin}
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
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
    config,
    isExpanded = false,
    onExpand = () => {},
    onTogglePin = () => {},
}) => {
    return renderWidget(config, isExpanded, onExpand, onTogglePin);
};

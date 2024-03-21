import React from 'react';
import { LineGraphWidget } from '../../graphWidgets/LineGraphWidget/LineGraphWidget';
import { BaseGraphProps } from '../../WidgetTypes';
import { BarChartWidget } from '../../graphWidgets/BarChartWidget/BarChartWidget';

const renderWidget = (graphType: string, graphInfo: BaseGraphProps) => {
    switch (graphType) {
        case 'bar_chart':
            return (
                <BarChartWidget title={graphInfo.title} data={graphInfo.data} />
            );
        case 'line_graph':
            return (
                <LineGraphWidget
                    title={graphInfo.title}
                    data={graphInfo.data}
                />
            );
        default:
            throw new Error(`${graphType} is not a valid graph type`);
    }
};

interface WidgetRendererProps {
    graphType: string;
    graphInfo: BaseGraphProps;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
    graphType,
    graphInfo,
}) => {
    return renderWidget(graphType, graphInfo);
};

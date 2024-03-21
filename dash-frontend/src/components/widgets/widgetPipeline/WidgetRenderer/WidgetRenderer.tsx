import React from 'react';

// TODO: add actual graph components
const renderWidget = (graphType: string) => {
    switch (graphType) {
        case 'pie_chart':
            return <div>pie chart</div>;
        case 'line_graph':
            return <div>line graph</div>;
        default:
            throw new Error(`${graphType} is not a valid graph type`);
    }
};

interface WidgetRendererProps {
    graphType: string;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
    graphType,
}) => {
    return renderWidget(graphType);
};

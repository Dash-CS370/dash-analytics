export interface DataItem {
    [key: string]: number | string;
}

export interface WidgetConfig {
    title: string;
    id: string;
    graphType: string;
    pinned: boolean;
    data: DataItem[];
}

export interface BaseGraphProps {
    config: WidgetConfig;
    isExpanded?: boolean;
    onExpand: () => void;
    onTogglePin: () => void;
}

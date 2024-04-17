export interface DataItem {
    [key: string]: number | string | number[];
}

export interface WidgetConfig {
    title: string;
    id: string;
    graphType: string;
    pinned: boolean;
    data: DataItem[];
}

export interface ProjectConfig {
    title: string;
    id: string;
    widgets: WidgetConfig[];
}

export interface BaseGraphProps {
    config: WidgetConfig;
    isExpanded?: boolean;
    onExpand: () => void;
    onTogglePin: () => void;
    onEditTitle: (id: string, newTitle: string) => void;
}

export interface BaseThumbnailProps {
    title: string;
    description: string;
    data: DataItem[];
    handleClick: () => void;
}

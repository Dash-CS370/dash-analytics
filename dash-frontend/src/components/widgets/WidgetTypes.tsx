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
    title: string;
    data: DataItem[];
}

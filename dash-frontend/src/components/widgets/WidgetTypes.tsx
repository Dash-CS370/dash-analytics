export interface DataItem {
    [key: string]: number | string;
}

export interface BaseGraphProps {
    title: string;
    data: DataItem[];
}

export interface DataItem {
    [key: string]: any;
}

export interface GPTProjConfig {
    project_id: string;
    project_name: string;
    project_config_link: string;
    project_csv_link: string;
    dataset_description: string;
    column_descriptions: string[];
    created_date: string;
    last_modified: string;
    widgets: GPTResponse[];
}

export interface GPTResponse {
    title: string;
    graph_type: string;
    description: string;
    columns: string[];
}

export interface WidgetConfig {
    title: string;
    id: string;
    graphType: string;
    pinned: boolean;
    columns: string[];
    data: DataItem[];
    description: string;
}

export interface ProjectConfig {
    project_id: string;
    project_name: string;
    project_config_link: string;
    project_csv_link: string;
    dataset_description: string;
    column_descriptions: string[];
    created_date: string;
    last_modified: string;
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

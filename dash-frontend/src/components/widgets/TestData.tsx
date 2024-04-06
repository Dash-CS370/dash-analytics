import { get } from 'http';
import { ProjectConfig, WidgetConfig } from './WidgetTypes';

const exampleLineData = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

const exampleConfigs: WidgetConfig[] = [
    {
        title: 'Example 1',
        id: '1',
        graphType: 'LINE_GRAPH',
        pinned: true,
        data: exampleLineData,
        description: 'This is a test description',
    },
    {
        title: 'Example 2',
        id: '2',
        graphType: 'BAR_GRAPH',
        pinned: true,
        data: exampleLineData,
        description: 'This is a test description',
    },
    {
        title: 'Example 3',
        id: '3',
        graphType: 'LINE_GRAPH',
        pinned: true,
        data: exampleLineData,
        description: 'This is a test description',
    },
    {
        title: 'Example 4',
        id: '4',
        graphType: 'BAR_GRAPH',
        pinned: true,
        data: exampleLineData,
        description: 'This is a test description',
    },
    {
        title: 'Example 5',
        id: '5',
        graphType: 'LINE_GRAPH',
        pinned: false,
        data: exampleLineData,
        description: 'This is a test description',
    },
    {
        title: 'Example 6',
        id: '6',
        graphType: 'BAR_GRAPH',
        pinned: false,
        data: exampleLineData,
        description: 'This is a test description',
    },
];

export const exampleProjects: ProjectConfig[] = [
    {
        project_name: 'Example Project',
        project_id: 'ex1',
        project_config_link: 'http://example.com',
        project_csv_link: 'http://example.com',
        dataset_description: 'This is a test description',
        column_descriptions: ['Column 1', 'Column 2', 'Column 3'],
        created_date: '2021-10-01',
        last_modified: '2021-10-01',
        widgets: exampleConfigs,
    },
];

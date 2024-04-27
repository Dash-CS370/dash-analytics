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
    {
        name: 'Page D',
        uv: 9000,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 8000,
        pv: 4800,
        amt: 9000,
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
        pv: 9000,
        amt: 2100,
    },
];

const exampleScatterData = [
    {
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

const exampleStatData = [
    {
        uv: 4000,
    },
    {
        uv: 3000,
    },
    {
        uv: 2000,
    },
    {
        uv: 2780,
    },
    {
        uv: 1890,
    },
    {
        uv: 2390,
    },
    {
        uv: 3490,
    },
];

export const exampleConfigs: WidgetConfig[] = [
    {
        title: 'Line Graph Example',
        id: '1',
        graphType: 'LINE_GRAPH',
        pinned: true,
        columns: ['name', 'uv', 'pv', 'amt'],
        data: exampleLineData,
        description: 'Line graph of example data.',
    },
    {
        title: 'Bar Graph Example',
        id: '2',
        graphType: 'BAR_GRAPH',
        pinned: true,
        columns: ['name', 'uv', 'pv', 'amt'],
        data: exampleLineData,
        description: 'Bar graph of example data.',
    },
    {
        title: 'Area Chart Example',
        id: '3',
        graphType: 'AREA_CHART',
        pinned: true,
        columns: ['name', 'uv', 'pv', 'amt'],
        data: exampleLineData,
        description: 'Area chart of example data.',
    },
    {
        title: 'Statistics Card for UV',
        id: '4',
        graphType: 'STATISTICS_CARD',
        pinned: true,
        columns: ['uv'],
        data: exampleStatData,
        description: 'Statistics card of example data.',
    },
    {
        title: 'Scatter Plot Example',
        id: '5',
        graphType: 'SCATTER_PLOT',
        pinned: false,
        columns: ['uv', 'pv'],
        data: exampleScatterData,
        description: 'Scatter plot of example data.',
    },
    {
        title: 'Bar Graph Example',
        id: '6',
        graphType: 'BAR_GRAPH',
        pinned: false,
        columns: ['name', 'uv', 'pv', 'amt'],
        data: exampleLineData,
        description: 'Bar graph of example data.',
    },
];

export const exampleProjects: ProjectConfig[] = [
    {
        project_name: 'Example Project',
        project_id: 'ex1',
        project_config_link: '',
        project_csv_link: '',
        dataset_description: 'Example dataset with dummy data.',
        column_descriptions: ['name', 'uv', 'pv', 'amt'],
        created_date: '2021-10-01',
        last_modified: '2021-10-01',
        widgets: exampleConfigs,
    },
];

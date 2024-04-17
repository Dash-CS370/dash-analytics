import { ProjectConfig, WidgetConfig } from './WidgetTypes';

export const exampleLineData = [
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


export const exampleBarData = [
    {
        car_brand: 'Chevy',
        price: [10, 12]
    },
    {
        car_brand: 'BMW',
        price: 20
    },
];

export const exampleConfigs: WidgetConfig[] = [
    {
        title: 'Test 1',
        id: '1',
        graphType: 'line_graph',
        pinned: true,
        data: exampleLineData,
    },
    {
        title: 'Test 2',
        id: '2',
        graphType: 'bar_chart',
        pinned: false,
        data: exampleBarData,
    },
    {
        title: 'Test 3',
        id: '3',
        graphType: 'line_graph',
        pinned: true,
        data: exampleLineData,
    },
    {
        title: 'Test 4',
        id: '4',
        graphType: 'bar_chart',
        pinned: true,
        data: exampleLineData,
    },
    {
        title: 'Test 5',
        id: '5',
        graphType: 'line_graph',
        pinned: false,
        data: exampleLineData,
    },
    {
        title: 'Test 6',
        id: '6',
        graphType: 'bar_chart',
        pinned: true,
        data: exampleLineData,
    },
    {
        title: 'Test 7',
        id: '7',
        graphType: 'line_graph',
        pinned: false,
        data: exampleLineData,
    },
    {
        title: 'Test 8',
        id: '8',
        graphType: 'bar_chart',
        pinned: false,
        data: exampleLineData,
    },
    {
        title: 'Test 9',
        id: '9',
        graphType: 'line_graph',
        pinned: false,
        data: exampleLineData,
    },
    {
        title: 'Test 10',
        id: '10',
        graphType: 'bar_chart',
        pinned: false,
        data: exampleLineData,
    },
    {
        title: 'Test 11',
        id: '11',
        graphType: 'line_graph',
        pinned: false,
        data: exampleLineData,
    },
    {
        title: 'Test 12',
        id: '12',
        graphType: 'bar_chart',
        pinned: false,
        data: exampleLineData,
    },
    {
        title: 'Test 13',
        id: '13',
        graphType: 'line_graph',
        pinned: false,
        data: exampleLineData,
    },
    {
        title: 'Test 14',
        id: '14',
        graphType: 'bar_chart',
        pinned: false,
        data: exampleLineData,
    },
];

export const exampleProjects: ProjectConfig[] = [
    {
        title: 'Test Project 1',
        id: '1',
        widgets: exampleConfigs,
    },
    {
        title: 'Test Project 2',
        id: '2',
        widgets: exampleConfigs,
    },
    {
        title: 'Test Project 3',
        id: '3',
        widgets: exampleConfigs,
    },
    {
        title: 'Test Project 4',
        id: '4',
        widgets: exampleConfigs,
    },
    {
        title: 'Test Project 5',
        id: '5',
        widgets: exampleConfigs,
    },
    {
        title: 'Test Project 6',
        id: '6',
        widgets: exampleConfigs,
    },
    {
        title: 'Test Project 7',
        id: '7',
        widgets: exampleConfigs,
    },
    {
        title: 'Test Project 8',
        id: '8',
        widgets: exampleConfigs,
    },
];

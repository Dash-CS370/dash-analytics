import styles from '@/app/dashboards/page.module.css';
import { NavBar } from '@/components/NavBar';
import { Sidebar } from '@/components/pages/dashboards/Sidebar/Sidebar';
import { WidgetLayout } from '@/components/widgets/widgetPipeline/WidgetLayout/WidgetLayout';
import { WidgetRenderer } from '@/components/widgets/widgetPipeline/WidgetRenderer/WidgetRenderer';

export default function Dashboards() {
    const lineData = [
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

    return (
        <main className={styles.main}>
            <Sidebar />
            <NavBar connected={true} />

            <WidgetLayout
                configs={[
                    {
                        title: 'Test',
                        id: '1',
                        graphType: 'line_graph',
                        pinned: true,
                        data: lineData,
                    },
                    {
                        title: 'Test',
                        id: '2',
                        graphType: 'bar_chart',
                        pinned: true,
                        data: lineData,
                    },
                    {
                        title: 'Test',
                        id: '3',
                        graphType: 'bar_chart',
                        pinned: true,
                        data: lineData,
                    },
                    {
                        title: 'Test',
                        id: '4',
                        graphType: 'bar_chart',
                        pinned: true,
                        data: lineData,
                    },
                ]}
            />
        </main>
    );
}

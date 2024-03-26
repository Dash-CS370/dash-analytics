'use client';

import styles from '@/app/dashboards/page.module.css';
import { NavBar } from '@/components/NavBar';
import { Sidebar } from '@/components/pages/dashboards/Sidebar/Sidebar';
import { ProjectConfig, WidgetConfig } from '@/components/widgets/WidgetTypes';
import { WidgetLayout } from '@/components/widgets/widgetPipeline/WidgetLayout/WidgetLayout';
import { useState } from 'react';

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
        title: 'Test',
        id: '1',
        graphType: 'line_graph',
        pinned: true,
        data: exampleLineData,
    },
    {
        title: 'Test',
        id: '2',
        graphType: 'bar_chart',
        pinned: true,
        data: exampleLineData,
    },
    {
        title: 'Test',
        id: '3',
        graphType: 'bar_chart',
        pinned: true,
        data: exampleLineData,
    },
    {
        title: 'Test',
        id: '4',
        graphType: 'bar_chart',
        pinned: true,
        data: exampleLineData,
    },
];

const exampleProjects: ProjectConfig[] = [
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

export default function Dashboards() {
    // TODO: load initial projects from backend API
    const initialProjects = exampleProjects;
    const [projects, setProjects] = useState<ProjectConfig[]>(initialProjects);
    const [activeProject, setActiveProject] = useState<ProjectConfig>(
        projects[0], // TODO: change to null and make it default to new project view
    );

    const togglePinned = (id: string) => {
        const newWidgets = activeProject.widgets.map((config) => {
            if (config.id === id) {
                return { ...config, pinned: !config.pinned };
            }
            return config;
        });

        setActiveProject({ ...activeProject, widgets: newWidgets });
    };

    // TODO: Add API interaction to update project name
    const editProjectName = (id: string, newTitle: string) => {
        // TODO: API request to change project name in database
        // TODO: don't update if API request fails

        const updatedProjects = projects.map((projectConfig) =>
            projectConfig.id === id
                ? { ...projectConfig, title: newTitle }
                : projectConfig,
        );
        setProjects(updatedProjects);

        if (activeProject.id === id) {
            setActiveProject({ ...activeProject, title: newTitle });
        }
    };

    // TODO: Add API interaction to delete project
    const deleteProject = (id: string) => {
        // TODO: API request to delete project from database
        // TODO: don't update if API request fails

        const updatedProjects = projects.filter(
            (projectConfig) => projectConfig.id !== id,
        );
        setProjects(updatedProjects);

        if (activeProject.id === id) {
            setActiveProject(updatedProjects[0]);
            // TODO: change so that if active project is deleted, it defaults to new project view
        }
    };

    const handleProjectSelection = (id: string) => {
        const selectedProject = projects.find(
            (projectConfig) => projectConfig.id === id,
        );
        if (!selectedProject) {
            return;
        }
        setActiveProject(selectedProject);
    };

    return (
        <main className={styles.main}>
            <Sidebar
                projects={projects}
                activeProject={activeProject}
                editProjectName={editProjectName}
                deleteProject={deleteProject}
                selectProject={handleProjectSelection}
            />
            <NavBar connected={true} />

            {/* TODO: useState that toggles between WidgetLayout and NewProject */}
            <WidgetLayout
                projectConfig={activeProject}
                togglePinned={togglePinned}
            />
        </main>
    );
}

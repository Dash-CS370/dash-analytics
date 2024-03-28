'use client';

import styles from '@/app/dashboards/page.module.css';
import { NavBar } from '@/components/NavBar';
import { NewProject } from '@/components/pages/dashboards/NewProject/NewProject';
import { Sidebar } from '@/components/pages/dashboards/Sidebar/Sidebar';
import { exampleProjects } from '@/components/widgets/TestData';
import { ProjectConfig, WidgetConfig } from '@/components/widgets/WidgetTypes';
import { WidgetLayout } from '@/components/widgets/widgetPipeline/WidgetLayout/WidgetLayout';
import { useState } from 'react';

export default function Dashboards() {
    const [newProject, setNewProject] = useState<boolean>(true);

    // TODO: load initial projects from backend API
    const [projects, setProjects] = useState<ProjectConfig[]>(exampleProjects);
    const [activeProject, setActiveProject] = useState<ProjectConfig>({
        title: '',
        id: '',
        widgets: [],
    });

    const togglePinned = (id: string) => {
        const newWidgets = activeProject.widgets.map((config) => {
            if (config.id === id) {
                return { ...config, pinned: !config.pinned };
            }
            return config;
        });
        const updatedActiveProject = { ...activeProject, widgets: newWidgets };
        const updatedProjects = projects.map((project) => {
            if (project.id === activeProject.id) {
                return updatedActiveProject;
            }
            return project;
        });
        setActiveProject(updatedActiveProject);
        setProjects(updatedProjects);
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
        setNewProject(false);
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
            {newProject ? (
                <NewProject />
            ) : (
                <WidgetLayout
                    projectConfig={activeProject}
                    togglePinned={togglePinned}
                    fetchMoreWidgets={() => {}} // TODO: handle fetching more widget configs
                />
            )}
        </main>
    );
}

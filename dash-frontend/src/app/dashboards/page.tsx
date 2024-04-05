'use client';

import styles from '@/app/dashboards/page.module.css';
import { NavBar } from '@/components/common/NavBar';
import { LoadingPage } from '@/components/pages/LoadingPage/LoadingPage';
import { NewProject } from '@/components/pages/dashboards/NewProject/NewProject';
import { RestrictedAccess } from '@/components/pages/dashboards/RestrictedAccess/RestrictedAccess';
import { Sidebar } from '@/components/pages/dashboards/Sidebar/Sidebar';
import { fetchProjects } from '@/components/pages/dashboards/backendInteractions';
import { exampleProjects } from '@/components/widgets/TestData';
import { ProjectConfig } from '@/components/widgets/WidgetTypes';
import { WidgetLayout } from '@/components/widgets/widgetPipeline/WidgetLayout/WidgetLayout';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboards() {
    const [pageLoaded, setPageLoaded] = useState<boolean>(false);
    const [newProject, setNewProject] = useState<boolean>(true);

    // TODO: load initial projects from backend API
    exampleProjects.forEach((project) => {
        project.widgets.forEach((widget) => {
            widget.id = `${project.id}-${widget.id}`;
        });
    });
    const [projects, setProjects] = useState<ProjectConfig[]>(exampleProjects);
    const [activeProject, setActiveProjectConfig] = useState<ProjectConfig>({
        title: '',
        id: '',
        widgets: [],
    });

    const searchParams = useSearchParams();
    const activeProjectId = searchParams.get('activeProjectId');
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();
    useEffect(() => {
        // listen for breakpoint for mobile devices
        const checkScreenSize = () => {
            if (window.innerWidth < 700 || window.innerHeight < 700) {
                setIsMobile(true);
            }
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        // pull projects from backend
        fetchProjects()
            .then((projects) => {
                console.log(projects);
            })
            .catch((error) => {
                router.push('/start');
            });

        // set active project from URL
        if (activeProjectId) {
            const project = projects.find(
                (projectConfig) => projectConfig.id === activeProjectId,
            );
            if (project) {
                setActiveProjectConfig(project);
                setNewProject(false);
            }
        }
        setPageLoaded(true);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, [activeProjectId, projects, router]);

    if (isMobile) {
        return <RestrictedAccess />;
    }

    const setActiveProject = (project: ProjectConfig) => {
        const searchParams = new URLSearchParams();
        if (!searchParams.has('activeProjectId')) {
            // if null, append to URL
            searchParams.append('activeProjectId', project.id);
            const newUrl = `${
                window.location.pathname
            }?${searchParams.toString()}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
            setActiveProjectConfig(project);
            return;
        }
        const activeProjectId = searchParams.get('activeProjectId');
        if (activeProjectId !== project.id) {
            // if different, update URL
            searchParams.set('activeProjectId', project.id);
            const newUrl = `${
                window.location.pathname
            }?${searchParams.toString()}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
        setActiveProjectConfig(project);
    };

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

    // TODO: Add API interaction to update widget title
    const editWidgetTitle = (id: string, newTitle: string) => {
        const newWidgets = activeProject.widgets.map((config) => {
            if (config.id === id) {
                return { ...config, title: newTitle };
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

    const handleNewProject = () => {
        setNewProject(true);
        setActiveProjectConfig({
            title: '',
            id: '',
            widgets: [],
        });
        const searchParams = new URLSearchParams();
        searchParams.delete('activeProjectId');
        const newUrl = `${window.location.pathname}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    };

    if (!pageLoaded) {
        return <LoadingPage />;
    }

    return (
        <main className={styles.main}>
            <Sidebar
                projects={projects}
                activeProject={activeProject}
                editProjectName={editProjectName}
                deleteProject={deleteProject}
                selectProject={handleProjectSelection}
                newProject={handleNewProject}
            />
            <NavBar connected={true} />

            {newProject ? (
                <NewProject
                    setActiveProject={setActiveProject}
                    projects={projects}
                    setProjects={setProjects}
                    setNewProject={setNewProject}
                />
            ) : (
                <WidgetLayout
                    projectConfig={activeProject}
                    togglePinned={togglePinned}
                    editWidgetTitle={editWidgetTitle}
                    fetchMoreWidgets={() => {}} // TODO: handle fetching more widget configs
                />
            )}
        </main>
    );
}

'use client';

import styles from '@/app/dashboards/page.module.css';
import { NavBar } from '@/components/common/NavBar';
import { LoadingPage } from '@/components/pages/LoadingPage/LoadingPage';
import { NewProject } from '@/components/pages/dashboards/NewProject/NewProject';
import { RestrictedAccess } from '@/components/pages/dashboards/RestrictedAccess/RestrictedAccess';
import { Sidebar } from '@/components/pages/dashboards/Sidebar/Sidebar';
import {
    fetchProjects,
    formatGraphData,
    updateRemoteProjects,
} from '@/components/pages/dashboards/backendInteractions';
import { exampleProjects } from '@/components/widgets/TestData';
import { DataItem, ProjectConfig } from '@/components/widgets/WidgetTypes';
import { WidgetLayout } from '@/components/widgets/widgetPipeline/WidgetLayout/WidgetLayout';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboards() {
    const [pageLoaded, setPageLoaded] = useState<boolean>(false);
    const [newProject, setNewProject] = useState<boolean>(true);

    // initialize state with placeholders
    const [projects, setProjects] = useState<ProjectConfig[]>([]);
    const [activeProject, setActiveProjectConfig] = useState<ProjectConfig>({
        project_name: '',
        project_id: '',
        project_config_link: '',
        project_csv_link: '',
        dataset_description: '',
        column_descriptions: [],
        created_date: '',
        last_modified: '',
        widgets: [],
    });

    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();
    useEffect(() => {
        // listen for breakpoint for mobile devices
        const checkScreenSize = () => {
            if (window.innerWidth < 700 || window.innerHeight < 700) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        // pull projects from backend
        fetchProjects()
            .then((projects) => {
                if (projects.length === 0) {
                    setProjects(exampleProjects);
                } else {
                    const localProjects = projects.map((project) => {
                        return {
                            ...project,
                            widgets: project.widgets.map((widget, index) => {
                                return {
                                    title: widget.title,
                                    id: `${
                                        project.project_id
                                    }-${index.toString()}`,
                                    graphType: widget.graph_type,
                                    pinned: index < 6, // pin first 6 widgets
                                    columns: widget.columns,
                                    data: [],
                                    description: widget.description,
                                };
                            }),
                        };
                    });
                    setProjects(localProjects);
                }
            })
            .catch((error) => {
                router.push('/start');
            });

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, [router]);

    // listen for page close to update remote projects
    useEffect(() => {
        const handleUnload = () => {
            updateRemoteProjects(projects)
                .then((response) => {})
                .catch((error) => {
                    console.error(error);
                });
        };

        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener('pagehide', handleUnload);
        window.addEventListener('pagehide', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            window.removeEventListener('pagehide', handleUnload);
            window.removeEventListener('pagehide', handleUnload);
        };
    });

    // set active project from URL on load
    const searchParams = useSearchParams();
    const activeProjectId = searchParams.get('activeProjectId');
    useEffect(() => {
        if (activeProjectId) {
            setNewProject(false);
            const project = projects.find(
                (projectConfig) => projectConfig.project_id === activeProjectId,
            );
            if (project) {
                setActiveProject(project);
            }
        }
        setPageLoaded(true);
    }, [projects, activeProjectId]);

    // redirect to restricted access page if on mobile (dashboard not supported on mobile yet)
    if (isMobile) {
        return <RestrictedAccess />;
    }

    // set active project and fetch its csv data
    const setActiveProject = (project: ProjectConfig) => {
        const searchParams = new URLSearchParams();
        if (!searchParams.has('activeProjectId')) {
            // if null, append to URL
            searchParams.append('activeProjectId', project.project_id);
            const newUrl = `${
                window.location.pathname
            }?${searchParams.toString()}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
        } else {
            const activeProjectId = searchParams.get('activeProjectId');
            if (activeProjectId !== project.project_id) {
                // if different, update URL
                searchParams.set('activeProjectId', project.project_id);
                const newUrl = `${
                    window.location.pathname
                }?${searchParams.toString()}`;
                window.history.pushState({ path: newUrl }, '', newUrl);
            }
        }

        if (project.project_id === 'ex1') {
            setActiveProjectConfig(project);
            return;
        }

        // format chart data
        fetch(`/api/fetch-csv?link=${project.project_csv_link}`, {
            method: 'GET',
        })
            .then((response) => {
                response
                    .json()
                    .then((data) => {
                        const activeProjectWithData = {
                            ...project,
                            widgets: project.widgets.map((widget) => {
                                // TODO: pass in data operations list
                                const rechartsData = formatGraphData(
                                    data,
                                    widget.columns,
                                );
                                return {
                                    ...widget,
                                    data: rechartsData,
                                };
                            }),
                        };
                        setActiveProjectConfig(activeProjectWithData);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // update pinned status of widget
    const togglePinned = (id: string) => {
        const newWidgets = activeProject.widgets.map((config) => {
            if (config.id === id) {
                return { ...config, pinned: !config.pinned };
            }
            return config;
        });
        const updatedActiveProject = { ...activeProject, widgets: newWidgets };
        const updatedProjects = projects.map((project) => {
            if (project.project_id === activeProject.project_id) {
                return updatedActiveProject;
            }
            return project;
        });
        setActiveProject(updatedActiveProject);
        setProjects(updatedProjects);
    };

    // update project name in state
    const editProjectName = (id: string, newTitle: string) => {
        const updatedProjects = projects.map((projectConfig) =>
            projectConfig.project_id === id
                ? { ...projectConfig, project_name: newTitle }
                : projectConfig,
        );
        setProjects(updatedProjects);
        if (activeProject.project_id === id) {
            setActiveProject({ ...activeProject, project_name: newTitle });
        }
    };

    // update widget title in state
    const editWidgetTitle = (id: string, newTitle: string) => {
        const newWidgets = activeProject.widgets.map((config) => {
            if (config.id === id) {
                return { ...config, title: newTitle };
            }
            return config;
        });
        const updatedActiveProject = { ...activeProject, widgets: newWidgets };
        const updatedProjects = projects.map((project) => {
            if (project.project_id === activeProject.project_id) {
                return updatedActiveProject;
            }
            return project;
        });
        setActiveProject(updatedActiveProject);
        setProjects(updatedProjects);
    };

    // delete project from state and backend
    const deleteProject = (id: string) => {
        fetch(
            `https://dash-analytics.solutions/api/v1/dashboards/project?project-id=${id}`,
            {
                method: 'DELETE',
                credentials: 'include',
            },
        )
            .then((response) => {
                if (response.status !== 200) {
                    console.error('Failed to delete project');
                }
            })
            .catch((error) => {
                console.error(error);
            });

        const updatedProjects = projects.filter(
            (projectConfig) => projectConfig.project_id !== id,
        );
        setProjects(updatedProjects);

        if (activeProject.project_id === id && updatedProjects.length > 0) {
            setActiveProject(updatedProjects[0]);
        } else if (
            updatedProjects.length === 0 ||
            activeProject.project_id === id
        ) {
            setActiveProject({
                project_name: '',
                project_id: '',
                project_config_link: '',
                project_csv_link: '',
                dataset_description: '',
                column_descriptions: [],
                created_date: '',
                last_modified: '',
                widgets: [],
            });
            setNewProject(true);
        }
    };

    // handle project selection from sidebar
    const handleProjectSelection = (id: string) => {
        const selectedProject = projects.find(
            (projectConfig) => projectConfig.project_id === id,
        );
        if (!selectedProject) {
            return;
        }
        setActiveProject(selectedProject);
        setNewProject(false);
    };

    // handle new project creation
    const handleNewProject = () => {
        setNewProject(true);
        setActiveProjectConfig({
            project_name: '',
            project_id: '',
            project_config_link: '',
            project_csv_link: '',
            dataset_description: '',
            column_descriptions: [],
            created_date: '',
            last_modified: '',
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

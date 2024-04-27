'use client';

import styles from '@/components/pages/dashboards/Sidebar/Sidebar.module.css';
import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { ProjectListItem } from '@/components/pages/dashboards/Sidebar/ProjectListItem';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { ProjectConfig } from '@/components/widgets/WidgetTypes';

interface SidebarProps {
    projects: ProjectConfig[];
    activeProject: ProjectConfig;
    editProjectName: (id: string, newName: string) => void;
    deleteProject: (id: string) => void;
    selectProject: (id: string) => void;
    newProject: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    projects,
    activeProject,
    editProjectName,
    deleteProject,
    selectProject,
    newProject,
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className={isOpen ? styles.sidebarOpen : styles.sidebarClosed}>
            {isOpen ? (
                <div className={styles.sidebarContent}>
                    <div className={styles.projectsContainer}>
                        <h1>Projects</h1>
                        <div className={styles.projectList}>
                            {projects.map((project) => (
                                <ProjectListItem
                                    key={project.project_id}
                                    id={project.project_id}
                                    name={project.project_name}
                                    isActive={
                                        project.project_id ===
                                        activeProject.project_id
                                    }
                                    onNameChange={editProjectName}
                                    deleteProject={deleteProject}
                                    selectProject={selectProject}
                                />
                            ))}
                        </div>
                        <PrimaryButton
                            width="215px"
                            height="60px"
                            className={styles.createProjectButton}
                            onClick={newProject}
                        >
                            Create Project
                        </PrimaryButton>
                    </div>
                    <IoIosArrowBack
                        className={styles.toggleIcon}
                        onClick={toggleSidebar}
                    />
                </div>
            ) : (
                <IoIosArrowForward
                    className={styles.toggleIcon}
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
};

'use client';

import styles from '@/components/pages/dashboards/Sidebar/Sidebar.module.css';
import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { ProjectListItem } from '@/components/pages/dashboards/Sidebar/ProjectListItem';
import { PrimaryButton } from '@/components/buttons/PrimaryButton/PrimaryButton';
import { ProjectConfig } from '@/components/widgets/WidgetTypes';

interface SidebarProps {
    projects: ProjectConfig[];
    editProjectName: (id: string, newName: string) => void;
    deleteProject: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    projects,
    editProjectName,
    deleteProject,
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
                                    key={project.id}
                                    id={project.id}
                                    name={project.title}
                                    onNameChange={editProjectName}
                                    deleteProject={deleteProject}
                                />
                            ))}
                        </div>
                        <PrimaryButton
                            width="215px"
                            height="60px"
                            href="/dashboard"
                            className={styles.createProjectButton}
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

'use client';

import styles from '@/components/pages/dashboard/Sidebar/Sidebar.module.css';
import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { ProjectListItem } from '@/components/pages/dashboard/Sidebar/ProjectListItem';
import { PrimaryButton } from '@/components/buttons/PrimaryButton/PrimaryButton';
import Link from 'next/link';

// Placeholder project data
const projData = [
    { id: 1, name: 'Project 1' },
    { id: 2, name: 'Project 2' },
    { id: 3, name: 'Project 3' },
    { id: 4, name: 'Project 4' },
    { id: 5, name: 'Project 5' },
    { id: 6, name: 'Project 6' },
    { id: 7, name: 'Project 7' },
    { id: 8, name: 'Project 8' },
    { id: 9, name: 'Project 9' },
    { id: 10, name: 'Project 10' },
    { id: 11, name: 'Project 11' },
    { id: 12, name: 'Project 12' },
    { id: 13, name: 'Project 13' },
    { id: 14, name: 'Project 14' },
    { id: 15, name: 'Project 15' },
    { id: 16, name: 'Project 16' },
    { id: 17, name: 'Project 17' },
    { id: 18, name: 'Project 18' },
    { id: 19, name: 'Project 19' },
    { id: 20, name: 'Project 20' },
];

export const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [projects, setProjects] = useState(projData);

    // TODO: Add API interaction to update project name
    const updateProjectName = (id: number, newName: string) => {
        // TODO: API request to change project name in database
        // TODO: don't update if API request fails

        const updatedProjects = projects.map((project) =>
            project.id === id ? { ...project, name: newName } : project,
        );
        setProjects(updatedProjects);
    };

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
                                    name={project.name}
                                    onNameChange={updateProjectName}
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

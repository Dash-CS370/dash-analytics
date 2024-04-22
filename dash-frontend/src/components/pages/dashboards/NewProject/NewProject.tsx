'use client';

import { useState } from 'react';
import { getColumnInfo } from '@/components/dataPipeline/dataOperations/getColumnInfo';
import { FileUpload } from './FileUpload';
import { ColumnForm } from './ColumnForm';
import { ProjectConfig } from '@/components/widgets/WidgetTypes';
import { fetchWidgetConfigs } from '../backendInteractions';
import { CgSpinner } from 'react-icons/cg';
import styles from '@/components/pages/dashboards/NewProject/NewProject.module.css';

export interface ColumnInfo {
    colName: string;
    dataType: string;
    description: string;
    userType: string;
}

export interface NewProjectProps {
    setActiveProject: (project: ProjectConfig) => void;
    projects: ProjectConfig[];
    setProjects: (projects: ProjectConfig[]) => void;
    setNewProject: (newProject: boolean) => void;
}

export const NewProject: React.FC<NewProjectProps> = ({
    setActiveProject,
    projects,
    setProjects,
    setNewProject,
}) => {
    const [descriptionLoaded, setDescriptionLoaded] = useState<boolean>(false); // handles transition from project description to column description
    const [errorMessage, setErrorMessage] = useState<string>(''); // handles form input errors
    const [file, setFile] = useState<File | null>(null); // csv file
    const [columns, setColumns] = useState<ColumnInfo[]>([]); // column info from csv
    const [description, setDescription] = useState<string>(''); // project description
    const [projectName, setProjectName] = useState<string>(''); // project name
    const [projectCreationStatus, setProjectCreationStatus] =
        useState<string>('');

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const f = event.target.files?.[0];
        if (!f) {
            return;
        }

        // check for file size
        const fileSizeLimit_MB = 4;
        const uploadFileSize_MB = f.size / (1024 * 1024);

        if (uploadFileSize_MB > fileSizeLimit_MB) {
            setErrorMessage('File size exceeds limit of 4 MB');
            event.target.value = ''; // removes user upload from cache
            return;
        }
        setErrorMessage(''); // removes error message

        setFile(f);
    };

    // handles transition from file upload to column description
    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        const form = document.getElementById(
            'nameAndDescription',
        ) as HTMLFormElement;
        const name = (
            form.elements.namedItem('projectName') as HTMLInputElement
        ).value;
        const description = (
            form.elements.namedItem('projectDescription') as HTMLInputElement
        ).value;

        if (!name || !description || !file) {
            let missingFields = [];
            if (!name) missingFields.push('Project Title');
            if (!description) missingFields.push('Project Description');
            if (!file) missingFields.push('.csv file');

            setErrorMessage(
                `The following fields are required: ${missingFields.join(
                    ', ',
                )}`,
            );

            // save fields to avoid lost inputs
            if (name) setProjectName(name);
            if (description) setDescription(description);
            return;
        }
        setErrorMessage(''); // clears previous messages

        // set column info
        getColumnInfo(file)
            .then((result) => {
                setColumns(result);
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage('Error reading file');
                return;
            });

        setProjectName(name);
        setDescription(description);
        setDescriptionLoaded(true);
    };

    const handleBackButton = () => {
        setErrorMessage('');
        setDescriptionLoaded(false);
    };

    const handleDescriptionChange = (index: number, value: string) => {
        columns[index].description = value;
    };

    const handleDropdownChange = (index: number, value: string) => {
        columns[index].userType = value;
    };

    // track list of columns to drop from df
    let colsToDelete: string[] = [];
    const handleDeleteCol = (colName: string) => {
        colsToDelete.push(colName);
        setColumns(columns.filter((item) => item.colName !== colName));
    };

    const handleCreateDashboard = (e: React.FormEvent) => {
        e.preventDefault();

        const form = document.getElementById(
            'nameAndDescription',
        ) as HTMLFormElement;
        setErrorMessage(''); // clears previous messages
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].description == '') {
                setErrorMessage(
                    `Description required for ${columns[i].colName}`,
                );
                return;
            }
            if (columns[i].userType == 'DATA TYPE...') {
                setErrorMessage(
                    `User defined datatype required for ${columns[i].colName}`,
                );
                return;
            }
        }

        setDescriptionLoaded(false); // clear status

        fetchWidgetConfigs(
            projectName,
            description,
            file as File,
            columns,
            setProjectCreationStatus,
            colsToDelete,
        )
            .then((projectConfig) => {
                console.log('response received');

                setActiveProject(projectConfig);
                setProjects([...projects, projectConfig]);
                setProjectCreationStatus(''); // clear status
                setNewProject(false); // return to dashboard
            })
            .catch((error) => {
                console.error(error);
                setProjectCreationStatus(''); // clear status
                setErrorMessage(error);
                setDescriptionLoaded(true); // go back to description form
            });
    };

    if (descriptionLoaded) {
        return (
            <ColumnForm
                columns={columns}
                errorMessage={errorMessage}
                handleDescriptionChange={handleDescriptionChange}
                handleCreateDashboard={handleCreateDashboard}
                handleBackButton={handleBackButton}
                handleDropdownChange={handleDropdownChange}
                handleDeleteCol={handleDeleteCol}
            />
        );
    }

    if (projectCreationStatus !== '') {
        return (
            <div className={styles.loadingContainer}>
                <CgSpinner className={styles.spinner} />
                <p>{projectCreationStatus}</p>
            </div>
        );
    }

    return (
        <FileUpload
            handleFileSelect={handleFileSelect}
            handleNext={handleNext}
            file={file}
            projectName={projectName}
            projectDescription={description}
            errorMessage={errorMessage}
        />
    );
};

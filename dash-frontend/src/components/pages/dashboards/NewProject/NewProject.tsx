import { useState } from 'react';
import { getColumnInfo } from '@/components/dataPipeline/dataOperations/getColumnInfo';
import { FileUpload } from './FileUpload';
import { ColumnForm } from './ColumnForm';
import { ProjectConfig } from '@/components/widgets/WidgetTypes';
import { resolve } from 'path';

export interface ColumnInfo {
    colName: string;
    dataType: string;
    description: string;
}

export interface NewProjectProps {
    setActiveProject: (project: ProjectConfig) => void;
    projects: ProjectConfig[];
    setProjects: (projects: ProjectConfig[]) => void;
    setNewProject: (newProject: boolean) => void;
    gptCall: (
        projectName: string,
        projectDescription: string,
        csvFile: File,
        columns: ColumnInfo[],
    ) => Promise<ProjectConfig>;
}

export const NewProject: React.FC<NewProjectProps> = ({
    gptCall,
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

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const f = event.target.files?.[0];
        if (!f) {
            return;
        }
        setFile(f);
    };

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

    const handleCreateDashboard = (e: React.FormEvent) => {
        e.preventDefault();
        const form = document.getElementById(
            'nameAndDescription',
        ) as HTMLFormElement;
        setErrorMessage(''); // clears previous messages
        for (let i = 0; i < columns.length; i++) {
            const description = (
                document.getElementById(
                    `projectDescription-${i}`,
                ) as HTMLInputElement
            ).value;
            if (!description) {
                setErrorMessage('All fields are required');
                return;
            }
            columns[i].description = description;
        }

        gptCall(projectName, description, file as File, columns)
            .then((projectConfig) => {
                console.log(projectConfig);
                setActiveProject(projectConfig);
                setProjects([...projects, projectConfig]);
                setNewProject(false);
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage(
                    'Error creating project. Check your inputs and try again.',
                );
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
            />
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

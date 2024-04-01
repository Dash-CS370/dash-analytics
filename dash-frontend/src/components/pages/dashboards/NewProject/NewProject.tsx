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

export const NewProject: React.FC = () => {
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
            .then(() => {
                console.log('Project created');
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

// TODO: move to next step, after columns have been described
async function gptCall(
    projectName: string,
    projectDescription: string,
    csvFile: File,
    columns: ColumnInfo[],
): Promise<ProjectConfig> {
    const columnDesctiptions = columns.map(
        (column) => `${column.colName}: ${column.description}`,
    );

    console.log(projectName);
    console.log(projectDescription);
    console.log(csvFile.name);
    console.log(columns);

    // const response = await fetch(
    //     `http://127.0.0.1/api/gpt/title=${projectName}&description=${projectDescription}&columns=${columns}`,
    // );
    // const result = await response.json();
    // console.log(result);

    // fetch(`http://127.0.0.1/api/gpt/title=${projectName}&description=${projectDescription}&columns=${columns}`).then((response) => {
    //  const result = await response.json();
    //  console.log(response);
    // })
    // .catch((error) => {
    //  console.error(error);
    // });

    return {
        title: projectName,
        id: '',
        widgets: [],
    };
}

import {
    DataItem,
    GPTProjConfig,
    GPTResponse,
    ProjectConfig,
    WidgetConfig,
} from '@/components/widgets/WidgetTypes';
import { ColumnInfo } from './NewProject/NewProject';
import * as dfd from 'danfojs';
import { cleanOnUpload } from '@/components/dataPipeline/dataOperations/cleanOnUpload';
import pp from 'papaparse';
import { dropColumns } from '@/components/dataPipeline/dataOperations/dropColumn';

export async function fetchWidgetConfigs(
    projectName: string,
    projectDescription: string,
    csvFile: File,
    columns: ColumnInfo[],
    setStatus: (status: string) => void,
    columnsToDrop: string[],
): Promise<ProjectConfig> {
    const columnDescriptions = columns.map(
        (column) =>
            `column-name: ${column.colName}, column-dtype: ${column.dataType}, column-description: ${column.description}, category: ${column.userType}`,
    );

    // clean and parse csv
    setStatus('Parsing CSV...');
    const df = await cleanOnUpload(csvFile);
    const droppedColsDF = dropColumns(df, columnsToDrop);

    const cleanedCSV = pp.unparse(dfd.toJSON(droppedColsDF) as DataItem[]);
    const blob = new Blob([cleanedCSV], { type: 'text/csv' });
    const cleanedFile = new File([blob], csvFile.name, { type: 'text/csv' });

    setStatus('Fetching graph configurations...');
    const gptResponse = await fetchGPTResponse(
        projectName,
        projectDescription,
        columnDescriptions,
        cleanedFile,
    );

    if (Array.isArray(gptResponse.widgets) && gptResponse.widgets.length != 0) {
        setStatus(`Preparing data for graphs...`);
        const widgets = gptResponse.widgets.map((response, index) => {
            const data_df = df.loc({ columns: response.columns });
            const data_json = dfd.toJSON(data_df);
            if (data_json === undefined) {
                throw new Error('Failed to convert DataFrame to JSON');
            }

            const rechartsData = data_json;

            return {
                title: response.title,
                id: `${gptResponse.project_id}-${index.toString()}`,
                graphType: response.graph_type,
                pinned: true,
                columns: response.columns,
                data: rechartsData as DataItem[],
                description: response.description,
            };
        });

        // sleep for 2.5 seconds to allow file to upload to s3
        await sleep(2500);

        setStatus(''); // clear status
        return {
            project_name: gptResponse.project_name,
            project_id: gptResponse.project_id,
            project_config_link: gptResponse.project_config_link,
            project_csv_link: gptResponse.project_csv_link,
            dataset_description: gptResponse.dataset_description,
            column_descriptions: gptResponse.column_descriptions,
            created_date: gptResponse.created_date,
            last_modified: gptResponse.last_modified,
            widgets: widgets,
        };
    } else {
        throw new Error('Failed to fetch GPT response. Try again.');
    }
}

function sleep(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const fetchGPTResponse = async (
    projectName: string,
    projectDescription: string,
    columnDescriptions: string[],
    csv: File,
): Promise<GPTProjConfig> => {
    const formData = new FormData();
    formData.append('project-name', projectName);
    formData.append('dataset-description', projectDescription);
    formData.append('column-descriptions', JSON.stringify(columnDescriptions));
    formData.append('csv-file', csv);

    const resp = await fetch(
        `https://dash-analytics.solutions/api/v1/dashboards/project`,
        {
            method: 'POST',
            body: formData,
            credentials: 'include',
        },
    );
    if (resp.status !== 201) {
        throw new Error(`Failed to fetch GPT response. ${resp.statusText}`);
    }

    const gptResponse: GPTProjConfig = await resp.json();
    return Promise.resolve(gptResponse);
};

export const fetchProjects = async (): Promise<GPTProjConfig[]> => {
    const resp = await fetch(
        'https://dash-analytics.solutions/api/v1/dashboards',
        {
            method: 'GET',
            credentials: 'include',
        },
    );
    if (resp.status !== 200) {
        throw new Error('Failed to fetch projects. Try again.');
    }
    const projects: GPTProjConfig[] = await resp.json();
    return Promise.resolve(projects);
};

export const formatGraphData = (
    data: DataItem[],
    columns: string[],
): DataItem[] => {
    if (!Array.isArray(data)) {
        throw new Error('Invalid data received');
    }
    const df = new dfd.DataFrame(data);

    const data_df = df.loc({ columns: columns });
    const data_json = dfd.toJSON(data_df);
    if (data_json === undefined) {
        throw new Error('Failed to convert graph format');
    }
    return data_json as DataItem[];
};

export const updateRemoteProjects = async (
    projects: ProjectConfig[],
): Promise<Response> => {
    let updatedProjects = projects.map((project) => {
        const widgets = project.widgets.map((widget) => {
            return {
                title: widget.title,
                graph_type: widget.graphType,
                description: widget.description,
                columns: widget.columns,
            };
        });
        return {
            project_id: project.project_id,
            project_name: project.project_name,
            project_config_link: project.project_config_link,
            project_csv_link: project.project_csv_link,
            dataset_description: project.dataset_description,
            column_descriptions: project.column_descriptions,
            created_date: project.created_date,
            last_modified: project.last_modified,
            widgets: widgets,
        };
    });

    const resp = await fetch(
        'https://dash-analytics.solutions/api/v1/dashboards/projects',
        {
            method: 'PUT',
            body: JSON.stringify(updatedProjects),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return resp;
};

import {
    DataItem,
    GPTProjConfig,
    GPTResponse,
    ProjectConfig,
    WidgetConfig,
} from '@/components/widgets/WidgetTypes';
import { ColumnInfo } from './NewProject/NewProject';
import * as dfd from 'danfojs';

export async function fetchWidgetConfigs(
    projectName: string,
    projectDescription: string,
    csvFile: File,
    columns: ColumnInfo[],
    setStatus: (status: string) => void,
): Promise<ProjectConfig> {
    const columnDescriptions = columns.map(
        (column) =>
            `column-name: ${column.colName}, column-dtype: ${column.dataType}, column-description: ${column.description}, category: ${column.dataType}`,
    );

    setStatus('Parsing CSV...');
    const df = await dfd.readCSV(csvFile);

    setStatus('Fetching graph congigurations...');
    const gptResponse = await fetchGPTResponse(
        projectName,
        projectDescription,
        columnDescriptions,
        csvFile,
    );

    console.log(gptResponse);

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
                description: response.widget_description,
            };
        });

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
        `http://127.0.0.1:8080/api/v1/dashboards/project`,
        {
            method: 'POST',
            body: formData,
            credentials: 'include',
        },
    );
    if (resp.status !== 200) {
        throw new Error('Failed to fetch GPT response. Try again.');
    }

    const gptResponse: GPTProjConfig = await resp.json();
    return Promise.resolve(gptResponse);
};

export const fetchProjects = async (): Promise<GPTProjConfig[]> => {
    const resp = await fetch('http://127.0.0.1:8080/api/v1/dashboards', {
        method: 'GET',
        credentials: 'include',
    });
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

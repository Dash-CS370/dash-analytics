import {
    DataItem,
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
): Promise<ProjectConfig> {
    const columnDescriptions = columns.map(
        (column) =>
            `column-name: ${column.colName}, column-dtype: ${column.dataType}, column-description: ${column.description}, category: ${column.dataType}`,
    );

    const df = await dfd.readCSV(csvFile);

    const gptResponse = await fetchGPTResponse(
        columnDescriptions,
        projectDescription,
        df,
    );
    console.log(gptResponse);

    if (Array.isArray(gptResponse) && gptResponse.length != 0) {
        const widgets = gptResponse.map((response, index) => {
            console.log(
                `graph: ${response.graph_type}, title: ${response.title}, description: ${response.widget_description}`,
            );

            const data_df = df.loc({ columns: response.columns });
            const data_json = dfd.toJSON(data_df);
            if (data_json === undefined) {
                throw new Error('Failed to convert DataFrame to JSON');
            }

            const rechartsData = data_json;

            return {
                title: response.title,
                id: index.toString(),
                graphType: response.graph_type,
                pinned: true,
                data: rechartsData as DataItem[],
                description: response.widget_description,
            };
        });
        console.log(widgets);

        return {
            title: projectName,
            id: projectName,
            widgets: widgets,
        };
    } else {
        throw new Error('Failed to fetch GPT response');
    }
}

const fetchGPTResponse = async (
    columnDescriptions: string[],
    projectDescription: string,
    data: dfd.DataFrame,
): Promise<GPTResponse[]> => {
    const resp = await fetch(`http://127.0.0.1:8081/api/gpt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dataset_description: projectDescription,
            column_data: columnDescriptions,
        }),
    });
    if (resp.status !== 200) {
        throw new Error('Failed to fetch GPT response');
    }

    const gptResponse: GPTResponse[] = await resp.json();

    return Promise.resolve(gptResponse);
};

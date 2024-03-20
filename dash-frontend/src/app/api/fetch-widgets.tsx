import { NextApiRequest } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI();

interface DatasetDescription {
    generalDescription: string;
    columnDescriptions: ColumnDescription[];
}

interface ColumnDescription {
    name: string;
    description: string;
    datatype: string;
}

interface DataOperations {
    name: string;
    description: string;
}

interface GraphOpts {
    name: string;
    description: string;
    requiredColumns: string[];
}

interface WidgetConfig {
    title: string;
    graphType: string;
    dataOperations: string[]; // list of operations to perform on the data - should return a new df with all columns needed for graph
    columns: string[]; // list of columns to use in the graph - each graph will have a different number of columns
}

function generatePrompt(
    datasetDescription: DatasetDescription,
    graphOptions: GraphOpts[],
    dataOptions: DataOperations[],
): string {
    let prompt = `Using the generateConfig function, generate 10 to 20 configuration options for graph widgets based on the following dataset description: ${datasetDescription.generalDescription}\n\n`;
    prompt += 'the following is information on each column:\n\n';

    datasetDescription.columnDescriptions.forEach((column) => {
        prompt += `Column: ${column.name}, Datatype: ${column.datatype}, Description: ${column.description}\n\n`;
    });

    prompt +=
        'Each configuration option should include a title, graph type, data operations, and columns. The title should be a string that is consice and accurately describes the graph.';
    prompt +=
        'The graph type should be a string chosen from the following options. Note that each option has a name, followed by a description and the required columns to create the graph (the graphType string must match spelling and case):\n';
    graphOptions.forEach((option) => {
        prompt += `${option.name}\n- ${
            option.description
        }\n- Required Columns: ${option.requiredColumns.join(', ')}\n\n`;
    });

    prompt +=
        'The data operations should be a list of strings that represent operations to perform on the data. These operations will manipulate the data to calculate more useful metrics to be graphed. The operations should be chosen from the following options (the string must match spelling and case):\n';
    dataOptions.forEach((option) => {
        prompt += `- ${option.name}: ${option.description}\n`;
    });

    return prompt;
}

function generateConfig(
    title: string,
    graphType: string,
    dataOperations: string[],
    columns: string[],
): WidgetConfig {
    return {
        title,
        graphType,
        dataOperations,
        columns,
    };
}

// TODO: validate then unpack arguments from string into config object
async function callFunction(
    tool_call: OpenAI.ChatCompletionMessageToolCall,
): Promise<WidgetConfig> {
    const args = tool_call.function.arguments;
    switch (tool_call.function.name) {
        case 'generateConfig':
        // TODO: validate then unpack arguments from string into config object

        default:
            throw new Error(`Function ${tool_call.function.name} not found`);
    }
}

async function fetchWidgets(
    datasetDescription: DatasetDescription,
    graphOptions: GraphOpts[],
    dataOptions: DataOperations[],
): Promise<WidgetConfig[]> {
    const prompt = generatePrompt(
        datasetDescription,
        graphOptions,
        dataOptions,
    );
    console.log(prompt);

    const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: 'user', content: prompt },
    ];

    const tools: OpenAI.ChatCompletionTool[] = [
        {
            type: 'function',
            function: {
                name: 'generateConfig',
                description:
                    'generates a configuration object for a graph widget based on the given parameters',
                parameters: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description:
                                'The title of the widget (should be relevant to what the graph is showing)',
                        },
                        graphType: {
                            type: 'string',
                            description:
                                'The type of graph being displayed in the widget (should match spelling and case from the provided list of graph types)',
                        },
                        dataOperations: {
                            type: 'string[]',
                            description:
                                'list of data operatoins to perform on the dataset to prepare it for graphing',
                        },
                        columns: {
                            type: 'string[]',
                            description:
                                'list of columns to use in the graph (matching spelling and case from the provided column names)',
                        },
                    },
                },
            },
        },
    ];

    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        tools,
    });
    const message = completion.choices[0].message;
    if (!message.tool_calls) {
        throw new Error('No function call found in completion');
    }

    const widgetConfigs: WidgetConfig[] = [];
    for (const toolCall of message.tool_calls) {
        if (toolCall.function) {
            const config = await callFunction(toolCall);
            widgetConfigs.push(config);
        }
    }

    return widgetConfigs;
}

// Test fetchWidgets with a mock dataset description, graph options, and data options
function testFetchWidgets() {
    const datasetDescription: DatasetDescription = {
        generalDescription:
            'This dataset contains information on the number of people who visited a website each day for a year.',
        columnDescriptions: [
            {
                name: 'Date',
                description: 'The date of the data entry',
                datatype: 'date',
            },
            {
                name: 'Visits',
                description:
                    'The number of people who visited the website on the given date',
                datatype: 'int',
            },
        ],
    };

    const graphOptions: GraphOpts[] = [
        {
            name: 'Line Chart',
            description:
                'A line chart that displays a line generated from two columns of data',
            requiredColumns: ['x', 'y'],
        },
        {
            name: 'Bar Chart',
            description:
                'A bar chart that shows the number of visits on each date',
            requiredColumns: ['Date', 'Visits'],
        },
    ];

    const dataOptions: DataOperations[] = [
        {
            name: 'Average',
            description:
                'Calculate the average number of visits for each month',
        },
        {
            name: 'Sum',
            description: 'Calculate the total number of visits for each month',
        },
    ];

    const widgetConfigs = fetchWidgets(
        datasetDescription,
        graphOptions,
        dataOptions,
    );

    console.log(widgetConfigs);
}

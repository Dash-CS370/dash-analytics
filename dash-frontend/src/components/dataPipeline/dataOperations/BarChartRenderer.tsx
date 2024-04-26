import * as dfd from 'danfojs';
import {DataFrame, Series} from "danfojs";

// When a Bar Graph widget is to be generated, this is called to prepare the data
export function generateBarChart(dataframe: dfd.DataFrame): dfd.DataFrame {
    // Find index of the one (only) categorical column
    // Make a list of the other cols (should all be numerical)

    let categorical_column = '';
    let numerical_columns: string[] = [];

    // Check the data types of the columns to determine if they're categorical or numerical
    dataframe.columns.forEach((col) => {
        const column_type = dataframe.column(col).dtype; // Get data type of the column

        if (['string', 'object'].includes(column_type)) {
            if (categorical_column === '') {
                categorical_column = col; // Assign first categorical column
            } else {
                throw new Error(
                    'DataFrame should contain only one categorical column',
                );
            }
        } else if (
            ['float32', 'float64', 'int32', 'int64'].includes(column_type)
        ) {
            numerical_columns.push(col); // Collect numerical columns
        }
    });

    if (
        numerical_columns.length === 0 &&
        numerical_columns.length !== dataframe.columns.length - 1
    ) {
        throw new Error(
            'Numerical columns found in the DataFrame does not match correct quantity',
        );
    }

    if (categorical_column === null)
        throw new Error('No categorical column found in the DataFrame');

    return preparedBarGraphDf(dataframe, categorical_column, numerical_columns); // 1 numerical column with 1 or more categorical column
}

// Choose operation to be performed (mean)
function preparedBarGraphDf(
    dataframe: DataFrame,
    categorical_column: string,
    numerical_columns: string[],
) {

    // Group by the categorical column and calculate the mean for the specified numerical columns
    let cleaned_df = dataframe.copy();

    for (const numerical_column of numerical_columns) {
        cleaned_df.column(numerical_column).asType('float32', { inplace: true });
    }

    const grouped = cleaned_df.groupby([categorical_column]);
    let mean_df = grouped.col(numerical_columns).mean();

    // Rename the columns to remove the '_mean' suffix
    for (const col of mean_df.columns) {
        if (col.endsWith('_mean')) mean_df = mean_df.rename({ [col]: col.split('_')[0] });
    }

    console.log("Grouped DataFrame Count:", grouped.count());
    console.log("Grouped DataFrame Sum:", grouped.sum());
    console.log("Mean DataFrame:", mean_df.head(5));

    return mean_df; // return the modified DataFrame
}
